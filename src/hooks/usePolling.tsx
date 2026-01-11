import { useState, useEffect, useRef } from "react";

export default function usePolling<T>(
    fetchFn: () => Promise<T>,
    {
        maxRetries = 3,
        delay = 5000,
    }: {
        maxRetries?: number,
        delay?: number,
    } = {}
): {
    data: T | null,
    pollingEnabled: boolean,
    refresh: () => void,
    pauseAndResume: () => void,
} {
    let isFetching = useRef<boolean>(false);
    let errorCount = useRef<number>(0);
    let timeoutId = useRef<number | undefined>(undefined);
    const [pollingEnabled, setPollingEnabled] = useState<boolean>(true);
    const [data, setData] = useState<T | null>(null);
    
    const poll = async () => {
        if(isFetching.current) return;

        isFetching.current = true;

        try {
            const data = await fetchFn();
            setData(data);
            errorCount.current = 0;
        } catch(e) {
            errorCount.current++;
            console.error(e);

            if(errorCount.current >= maxRetries) {
                setPollingEnabled(false);
                console.error("Max retries exceeded. Stopping auto-refresh..");
            }
        } finally {
            isFetching.current = false;
        }
    }

    const refresh = () => {
        if(pollingEnabled) return;

        errorCount.current = 0;
        setPollingEnabled(true);
    }

    const pauseAndResume = () => {
        clearTimeout(timeoutId.current);
        setPollingEnabled(!pollingEnabled);
    }

    useEffect(() => {
        if(!pollingEnabled) return;

        let cancelled = false;

        const tick = async () => {
            if(cancelled) return;

            await poll();

            if(!cancelled && pollingEnabled) {
                timeoutId.current = setTimeout(tick, delay);
            }
        };

        tick();

        return () => {
            cancelled = true;
            if(timeoutId.current) clearTimeout(timeoutId.current);
        };
    }, [pollingEnabled]);

    return {
        data,
        pollingEnabled,
        refresh,
        pauseAndResume,
    }
}