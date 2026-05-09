import z from "zod";
import { BIKESTATUS, BIKETYPE } from "../models/bicycle";
import { idRule } from "./util-validators";

// export const longitudeRule = z
// 	.number()
// 	.min(-180, "Longitude must be between -180 and 180")
// 	.max(180, "Longitude must be between -180 and 180");
// export const latitudeRule = z
// 	.number()
// 	.min(-90, "Latitude must be between -90 and 90")
// 	.max(90, "Latitude must be between -90 and 90");

export const registerBikeRequest = z.object({
	locationId: idRule("Location"),
	type: z.enum(BIKETYPE),
	pricePerHour: z.number().positive("Price per hour must be positive"),
});

export type RegisterBikeForm = z.infer<typeof registerBikeRequest>;

export const updateBikeRequest = z.object({
	locationId: idRule("Location"),
	type: z.enum(BIKETYPE),
	pricePerHour: z.number().positive("Price per hour must be positive"),
	status: z.enum(BIKESTATUS),
});

export type UpdateBikeForm = z.infer<typeof updateBikeRequest>;
