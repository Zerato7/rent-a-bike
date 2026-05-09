import type {
	ChangePasswordDto,
	User,
	LoginUserDto,
	RegisterUserDto,
	UpdateUserDto,
} from "../models/user";
import { request } from "./client";

const prefixPath = "/users";

export async function registerUser(payload: RegisterUserDto) {
	return request<User>(`${prefixPath}/register`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function loginUser(payload: LoginUserDto) {
	return request<User>(`${prefixPath}/login`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function updateUser(payload: UpdateUserDto) {
	return request<User>(`${prefixPath}/${payload.id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function changePassword(payload: ChangePasswordDto) {
	console.log(payload);
	return request<void>(`${prefixPath}/password/${payload.id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function getUser(id: string) {
	return request<User>(`${prefixPath}/${id}`);
}
