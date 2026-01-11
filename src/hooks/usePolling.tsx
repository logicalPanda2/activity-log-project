import { useEffect, useState } from "react";

export default function usePolling<T>(
    fetchFn: () => Promise<T>, 
    {
        delay = 5000,
        maxRetries = 3,
    }: {
        delay?: number,
        maxRetries?: number,
    } = {}
): {
    data: T | null,
    error: string,
    refresh: () => void,
    pauseAndResume: () => Promise<void>,
} {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string>("");
    const [errorCount, setErrorCount] = useState<number>(0);
    let isFetching = false;
    let timeoutId: number;
        
    const tick = async () => {
        if(isFetching) return;

        setError("");
        isFetching = true;

        try {
            const result = await fetchFn();
            setData(result);
            isFetching = false;
        } catch(error) {
            setErrorCount(c => c + 1);
            if(hasStringMessage(error)) setError(`Error: ${error.message}\nRetrying...`);
            isFetching = false;
        }

        timeoutId = setTimeout(tick, delay);

        if(errorCount >= maxRetries) {
            clearTimeout(timeoutId);
            setError(`Max retries exceeded. Please click refresh to rerun the auto-refresh.`);
        }
    }

    const refresh = () => {
        if(errorCount !== 3 || isFetching) return;

        console.log("refresh ran");
        setErrorCount(0);
        clearTimeout(timeoutId);
    }

    useEffect(() => {
        if(!isFetching) tick();
        console.log("use effect ran");

        return () => {
            if(timeoutId) clearTimeout(timeoutId);
            console.log("clean up");
        }
    }, [delay, maxRetries, fetchFn, errorCount]);

    return {
        data, 
        error, 
        refresh,
        pauseAndResume: tick,
    };
}

function hasStringMessage(error: unknown): error is Record<"message", string> {
    if(
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string" 
    ) return true;

    return false;
}
