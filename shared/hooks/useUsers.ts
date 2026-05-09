import {
	useMutation,
	useQuery,
	useQueryClient,
	UseMutationResult,
	UseQueryResult,
} from "@tanstack/react-query";
import type { ErrorResponse } from "../models/error-response";
import type {
	ChangePasswordDto,
	LoginUserDto,
	RegisterUserDto,
	UpdateUserDto,
	User,
} from "../models/user";
import {
	changePassword,
	getUser,
	loginUser,
	registerUser,
	updateUser,
} from "../api/userApi";

export function useRegisterUser(): UseMutationResult<
	User,
	ErrorResponse,
	RegisterUserDto
> {
	return useMutation<User, ErrorResponse, RegisterUserDto>({
		mutationFn: (payload: RegisterUserDto) => registerUser(payload),
	});
}

export function useLoginUser(): UseMutationResult<
	User,
	ErrorResponse,
	LoginUserDto
> {
	return useMutation<User, ErrorResponse, LoginUserDto>({
		mutationFn: (payload: LoginUserDto) => loginUser(payload),
	});
}

export function useUpdateUser(): UseMutationResult<
	User,
	ErrorResponse,
	UpdateUserDto
> {
	const queryClient = useQueryClient();
	return useMutation<User, ErrorResponse, UpdateUserDto>({
		mutationFn: (payload: UpdateUserDto) => updateUser(payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["user", variables.id],
				exact: true,
			});
		},
	});
}

export function useChangePassword(): UseMutationResult<
	void,
	ErrorResponse,
	ChangePasswordDto
> {
	return useMutation<void, ErrorResponse, ChangePasswordDto>({
		mutationFn: (payload: ChangePasswordDto) => changePassword(payload),
	});
}

export function useGetUser(id: string): UseQueryResult<User, ErrorResponse> {
	return useQuery<User, ErrorResponse>({
		queryKey: ["user", id],
		queryFn: () => getUser(id),
	});
}
