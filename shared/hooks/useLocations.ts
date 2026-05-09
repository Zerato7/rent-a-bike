import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { type Location } from "../models/submodels/location";
import { type ErrorResponse } from "../models/error-response";
import { getLocations } from "../api/locationApi";

export function useGetLocations(): UseQueryResult<Location[], ErrorResponse> {
	return useQuery<Location[], ErrorResponse>({
		queryKey: ["locations"],
		queryFn: getLocations,
	});
}
