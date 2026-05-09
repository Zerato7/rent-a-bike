import z from "zod";

export const stringRequiredRule = (path: string) =>
	z.string().min(1, `${path} is required`);

export const stringOptionalRule = (path: string) =>
	z.string().optional();

export const idRule = (path: string) =>
	z.string().regex(/^[0-9a-fA-F]{24}$/, `Invalid ${path} ID`);
