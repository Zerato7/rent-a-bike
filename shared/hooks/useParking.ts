import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { Parking, ParkingDistance } from "../models/parking";
import type { ErrorResponse } from "../models/error-response";
import { getNearbyParkingSpots, getParkingSpots } from "../api/parkingApi";

export function useGetParkingSpots(): UseQueryResult<Parking[], ErrorResponse> {
	return useQuery<Parking[], ErrorResponse>({
		queryKey: ["parking"],
		queryFn: getParkingSpots,
	});
}

export function useGetNearbyParkingSpots(
	lng: number,
	lat: number,
): UseQueryResult<ParkingDistance[], ErrorResponse> {
	return useQuery<ParkingDistance[], ErrorResponse>({
		queryKey: ["parkingDistance", lng, lat],
		queryFn: () => getNearbyParkingSpots(lng, lat),
	});
}
