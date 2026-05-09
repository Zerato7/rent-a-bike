import type { Bicycle, RegisterBikeDto, UpdateBikeDto } from "../models/bicycle";
import { request } from "./client";

const prefixPath = "/bikes";

export async function registerBike(payload: RegisterBikeDto) {
	return request<Bicycle>(`${prefixPath}`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function updateBike(payload: UpdateBikeDto) {
	return request<Bicycle>(`${prefixPath}/${payload.id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function getBikes() {
	return request<Bicycle[]>(`${prefixPath}`);
}

export async function getBike(id: string) {
	return request<Bicycle>(`${prefixPath}/${id}`);
}
