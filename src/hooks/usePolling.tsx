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
): [T | null, string] {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string>("");
    let isFetching = false;

    useEffect(() => {
        let timeoutId: number;
        let errors: number = 0;
        
        const tick = async () => {
            if(isFetching) return;

            setError("");
            isFetching = true;

            try {
                const result = await fetchFn();
                setData(result);
                isFetching = false;
            } catch(error) {
                errors++;
                if(hasStringMessage(error)) setError(`Error: ${error.message}\nRetrying...`);
                isFetching = false;
            }

            timeoutId = setTimeout(tick, delay);

            if(errors >= maxRetries) {
                clearTimeout(timeoutId);
                setError(`Max retries exceeded. Please click refresh to rerun the auto-refresh.`);
            }
        }

        if(!isFetching) tick();

        return () => {
            if(timeoutId) clearTimeout(timeoutId);
        }
    }, [delay, maxRetries, fetchFn]);

    return [data, error];
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
