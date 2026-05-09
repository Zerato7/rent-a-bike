import { string, z } from "zod";
import { ROLES } from "../../models/user.js";
import { stringOptionalRule, stringRequiredRule } from "./util-validators.js";

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

export const loginRequest = z.object({
	username: stringRequiredRule("Username"),
	password: stringRequiredRule("Password"),
	role: z.enum(ROLES),
});

export const updateUserRequest = z.object({
	firstName: stringOptionalRule("First name"),
	lastName: stringOptionalRule("Last name"),
	phone: stringOptionalRule("Phone number"),
	email: z.email().optional(),
});

export const passwordChangeRequest = z.object({
	oldPassword: stringRequiredRule("Old password"),
	newPassword: passwordRule,
});

export const userResponse = z.object({
	id: z.string(),
	username: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string().optional(),
	email: z.email(),
	role: z.enum(ROLES),
});
