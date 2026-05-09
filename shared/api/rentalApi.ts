import type {
	EndRentalDto,
	Rental,
	RentalFullDetail,
	RentalLiteDetail,
	StartRentalDto,
} from "../models/rental";
import { request } from "./client";

const prefixPath = "/rentals";

export async function startRental(payload: StartRentalDto) {
	return request<Rental>(`${prefixPath}`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function endRental(payload: EndRentalDto, lng: number, lat: number) {
	const formData = new FormData();
	formData.append("photo", payload.photo);

	return request<Rental>(`${prefixPath}/return/${payload.id}?lng=${lng}&lat=${lat}`, {
		method: "PUT",
		body: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

export async function getUserActiveRental(userId: string) {
	return request<RentalLiteDetail>(`${prefixPath}/user/${userId}/active`);
}

export async function getUserHistoryRentals(userId: string) {
	return request<RentalLiteDetail[]>(`${prefixPath}/user/${userId}/history`);
}

export async function getRentals() {
	return request<RentalFullDetail[]>(`${prefixPath}`);
}
