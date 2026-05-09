import {
	useMutation,
	useQuery,
	useQueryClient,
	UseMutationResult,
	UseQueryResult,
} from "@tanstack/react-query";
import type {
	Bicycle,
	RegisterBikeDto,
	UpdateBikeDto,
} from "../models/bicycle";
import type { ErrorResponse } from "../models/error-response";
import { getBike, getBikes, registerBike, updateBike } from "../api/bikeApi";

export function useRegisterBike(): UseMutationResult<
	Bicycle,
	ErrorResponse,
	RegisterBikeDto
> {
	const queryclient = useQueryClient();
	return useMutation<Bicycle, ErrorResponse, RegisterBikeDto>({
		mutationFn: (payload: RegisterBikeDto) => registerBike(payload),
		onSuccess: () => {
			queryclient.invalidateQueries({
				queryKey: ["bikes"],
				exact: true,
			});
		},
	});
}

export function useUpdateBike(): UseMutationResult<
	Bicycle,
	ErrorResponse,
	UpdateBikeDto
> {
	const queryClient = useQueryClient();
	return useMutation<Bicycle, ErrorResponse, UpdateBikeDto>({
		mutationFn: (payload: UpdateBikeDto) => updateBike(payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["bike", variables.id],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["bikes"],
				exact: true,
			});
		},
	});
}

export function useGetBikes(): UseQueryResult<Bicycle[], ErrorResponse> {
	return useQuery<Bicycle[], ErrorResponse>({
		queryKey: ["bikes"],
		queryFn: getBikes,
	});
}

export function useGetBike(id: string): UseQueryResult<Bicycle, ErrorResponse> {
	return useQuery<Bicycle, ErrorResponse>({
		queryKey: ["bike", id],
		queryFn: () => getBike(id),
	});
}
