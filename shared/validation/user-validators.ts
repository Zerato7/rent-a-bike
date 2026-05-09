import { z } from "zod";
import { ROLES } from "../models/user";
import { stringOptionalRule, stringRequiredRule } from "./util-validators";

const passwordRule = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[^a-zA-Z0-9]/,
		"Password must contain at least one special character",
	);

export const registerUserRequest = z.object({
	username: stringRequiredRule("Username"),
	password: passwordRule,
	firstName: stringRequiredRule("First name"),
	lastName: stringRequiredRule("Last name"),
	phone: stringOptionalRule("Phone number"),
	email: z.email(),
	role: z.enum(ROLES).default(ROLES.USER),
});

export const registerUserFrontend = z
	.object({
		username: stringRequiredRule("Username"),
		password: passwordRule,
		confirmPassword: stringRequiredRule("Confirm password"),
		firstName: stringRequiredRule("First name"),
		lastName: stringRequiredRule("Last name"),
		phone: stringOptionalRule("Phone number"),
		email: z.email(),
		role: z.enum(ROLES).default(ROLES.USER),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterUserForm = z.infer<typeof registerUserFrontend>;

export const loginRequest = z.object({
	username: stringRequiredRule("Username"),
	password: stringRequiredRule("Password"),
});

export type LoginUserForm = z.infer<typeof loginRequest>;

export const updateUserRequest = z.object({
	firstName: stringRequiredRule("First name"),
	lastName: stringRequiredRule("Last name"),
	phone: stringOptionalRule("Phone number"),
	email: z.email(),
});

export type UpdateUserForm = z.infer<typeof updateUserRequest>;

export const passwordChangeRequest = z.object({
	oldPassword: stringRequiredRule("Old password"),
	newPassword: passwordRule,
});

export const passwordChangeFrontend = z
	.object({
		oldPassword: stringRequiredRule("Old password"),
		newPassword: passwordRule,
		confirmPassword: stringRequiredRule("Confirm password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type PasswordChangeForm = z.infer<typeof passwordChangeFrontend>;

export const userResponse = z.object({
	id: z.string(),
	username: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string().optional(),
	email: z.email(),
	role: z.enum(ROLES),
});
