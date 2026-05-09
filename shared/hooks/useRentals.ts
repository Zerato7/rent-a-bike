import {
	useMutation,
	useQuery,
	useQueryClient,
	UseMutationResult,
	UseQueryResult,
} from "@tanstack/react-query";
import type {
	EndRentalDto,
	Rental,
	RentalFullDetail,
	RentalLiteDetail,
	StartRentalDto,
} from "../models/rental";
import type { ErrorResponse } from "../models/error-response";
import {
	endRental,
	getRentals,
	getUserActiveRental,
	getUserHistoryRentals,
	startRental,
} from "../api/rentalApi";

export function useStartRental(): UseMutationResult<
	Rental,
	ErrorResponse,
	StartRentalDto
> {
	const queryClient = useQueryClient();
	return useMutation<Rental, ErrorResponse, StartRentalDto>({
		mutationFn: (payload: StartRentalDto) => startRental(payload),
		onSuccess: (ret, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["rentals"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["rental", variables.userId, "active"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["bikes"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["bike", ret.bikeId],
				exact: true,
			});
		},
	});
}

export function useEndRental(
	lng: number,
	lat: number,
): UseMutationResult<Rental, ErrorResponse, EndRentalDto> {
	const queryClient = useQueryClient();
	return useMutation<Rental, ErrorResponse, EndRentalDto>({
		mutationFn: (payload: EndRentalDto) => endRental(payload, lng, lat),
		onSuccess: (ret) => {
			queryClient.invalidateQueries({
				queryKey: ["rentals"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["rental", ret.userId],
				exact: false,
			});
			queryClient.invalidateQueries({
				queryKey: ["bikes"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["bike", ret.bikeId],
				exact: true,
			});
		},
	});
}

export function useGetUserActiveRental(
	userId: string,
): UseQueryResult<RentalLiteDetail, ErrorResponse> {
	return useQuery<RentalLiteDetail, ErrorResponse>({
		queryKey: ["rental", userId, "active"],
		queryFn: () => getUserActiveRental(userId),
	});
}

export function useGetUserHistoryRentals(
	userId: string,
): UseQueryResult<RentalLiteDetail[], ErrorResponse> {
	return useQuery<RentalLiteDetail[], ErrorResponse>({
		queryKey: ["rental", userId, "history"],
		queryFn: () => getUserHistoryRentals(userId),
	});
}

export function useGetRentals(): UseQueryResult<
	RentalFullDetail[],
	ErrorResponse
> {
	return useQuery<RentalFullDetail[], ErrorResponse>({
		queryKey: ["rentals"],
		queryFn: getRentals,
	});
}
