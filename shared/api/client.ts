import type { ErrorResponse } from "../models/error-response";
import { getAppConfig } from "../config/apiConfig";

export async function request<T>(
	path: string,
	options: RequestInit = {}
): Promise<T> {
	const config = getAppConfig();
	const headers =
		options.method === "POST" || options.method === "PUT"
			? {
					"Content-Type": "application/json",
			  }
			: undefined;
	const res = await fetch(`${config.apiUrl}${path}`, {
		headers: options.headers ?? headers,
		...options,
	});
	if (!res.ok) {
		const error: ErrorResponse = await res.json();
		error.status = res.status;
		error.statusText = res.statusText
		throw error;
	}
	if (res.status === 204) {
		return undefined as T;
	}
	return res.json() as Promise<T>;
}
