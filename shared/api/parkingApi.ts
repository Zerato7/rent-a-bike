import type { Parking, ParkingDistance } from "../models/parking";
import { request } from "./client";

const prefixPath = "/parking";

export async function getParkingSpots() {
	return request<Parking[]>(`${prefixPath}`);
}

export async function getNearbyParkingSpots(
	lng: number,
	lat: number,
) {
	return request<ParkingDistance[]>(
		`${prefixPath}/nearby?lng=${lng}&lat=${lat}`,
	);
}
