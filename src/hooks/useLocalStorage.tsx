import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
	localStorageKey: string,
	initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(() => {
		const item = localStorage.getItem(localStorageKey);
		return item ? JSON.parse(item) : initialValue;
	});

	useEffect(() => {
		localStorage.setItem(localStorageKey, JSON.stringify(value));
	}, [localStorageKey, value]);

	return [value, setValue];
}
