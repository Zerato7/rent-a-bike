import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

function getStorageValue<T>(key: string, defaultValue: T) {
	const saved = localStorage.getItem(key);
	if (saved) {
		return JSON.parse(saved);
	}
	return typeof defaultValue === "function" ? defaultValue() : defaultValue;
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
	const [value, setValue] = useState<T>(getStorageValue(key, defaultValue));

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
	}, [key, value]);

	return [value, setValue];
}
