import type { Location } from "./submodels/location";

export const BIKETYPE = {
	MOUNTAIN: "Mountain",
	ROAD: "Road",
	ELECTRICAL: "Electrical",
	HYBRID: "Hybrid",
} as const;

export const BIKESTATUS = {
	AVAILABLE: "Available",
	MAINTENANCE: "Maintenance",
	IN_USE: "In Use",
	SUSPENDED: "Suspended",
} as const;

export type BikeType = (typeof BIKETYPE)[keyof typeof BIKETYPE];
export type BikeStatus = (typeof BIKESTATUS)[keyof typeof BIKESTATUS];

export interface Bicycle {
	_id: string;
	location: Location;
	type: BikeType;
	pricePerHour: number;
	status: BikeStatus;
	qrToken: string;
	createdAt?: Date | string;
	updatedAt?: Date | string;
	displayId: string;
}

export interface RegisterBikeDto {
	locationId: string;
	type: BikeType;
	pricePerHour: number;
}

export interface UpdateBikeDto {
	id: string;
	locationId?: string;
	type?: BikeType;
	pricePerHour?: number;
	status?: BikeStatus;
}

export function bikeStatusVariant(status: BikeStatus) {
  switch (status) {
    case BIKESTATUS.AVAILABLE:
      	return "success"
    case BIKESTATUS.IN_USE:
      	return "neutral";
    case BIKESTATUS.MAINTENANCE:
		return "warning";
    case BIKESTATUS.SUSPENDED:
      	return "danger";
  }
}

export function formatLocation(bike: Bicycle) {
	const locationString = (bike.status === BIKESTATUS.IN_USE
							? "From: " : "") + bike.location.name;
	return locationString;
}
