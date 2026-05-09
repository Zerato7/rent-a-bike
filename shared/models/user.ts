export const ROLES = {
	USER: "user",
	ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface User {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	phone?: string;
	email: string;
	role: Role;
	createdAt?: Date | string;
	updatedAt?: Date | string;
}

export interface RegisterUserDto {
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	phone?: string;
	email: string;
}

export interface LoginUserDto {
	username: string;
	password: string;
	role: Role;
}

export interface UpdateUserDto {
	id: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	email?: string;
}

export interface ChangePasswordDto {
	id: string;
	oldPassword: string;
	newPassword: string;
}
