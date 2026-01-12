import { useState, useEffect, useRef } from "react";

function hasStringMessage(error: unknown): error is Record<"message", string> {
	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof error.message === "string"
	)
		return true;

	return false;
}

export default function usePolling<T>(
	fetchFn: () => Promise<T>,
	{
		maxRetries = 3,
		delay = 5000,
	}: {
		maxRetries?: number;
		delay?: number;
	} = {},
): {
	data: T | null;
	error: string;
	pollingEnabled: boolean;
	refresh: () => void;
	pauseAndResume: () => void;
} {
	let isFetching = useRef<boolean>(false);
	let errorCount = useRef<number>(0);
	let timeoutId = useRef<number | undefined>(undefined);
	const [pollingEnabled, setPollingEnabled] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const [data, setData] = useState<T | null>(null);

	const poll = async () => {
		if (isFetching.current) return;

		isFetching.current = true;
		setError("");

		try {
			const data = await fetchFn();
			setData(data);
			errorCount.current = 0;
		} catch (e) {
			errorCount.current++;
			console.error(e);
			if (hasStringMessage(e)) setError(e.message);

			if (errorCount.current >= maxRetries) {
				setPollingEnabled(false);
				console.error("Max retries exceeded. Auto-refresh stopped.");
				setError("Max retries exceeded. Auto-refresh stopped.");
			}
		} finally {
			isFetching.current = false;
		}
	};

	const refresh = () => {
		if (pollingEnabled) return;

		errorCount.current = 0;
		setPollingEnabled(true);
	};

	const pauseAndResume = () => {
		clearTimeout(timeoutId.current);
		setPollingEnabled(!pollingEnabled);
	};

	useEffect(() => {
		if (!pollingEnabled) return;

		let cancelled = false;

		const tick = async () => {
			if (cancelled) return;

			await poll();

			if (!cancelled && pollingEnabled) {
				timeoutId.current = setTimeout(tick, delay);
			}
		};

		tick();

		return () => {
			cancelled = true;
			if (timeoutId.current) clearTimeout(timeoutId.current);
		};
	}, [pollingEnabled]);

	return {
		data,
		error,
		pollingEnabled,
		refresh,
		pauseAndResume,
	};
}
