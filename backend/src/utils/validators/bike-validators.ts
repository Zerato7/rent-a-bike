import z from "zod";
import { BIKESTATUS, BIKETYPE } from "../../models/bicycle.js";
import { idRule } from "./util-validators.js";

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

export const updateBikeRequest = z.object({
	locationId: idRule("Location").optional(),
	type: z.enum(BIKETYPE).optional(),
	pricePerHour: z
		.number()
		.positive("Price per hour must be positive")
		.optional(),
	status: z.enum(BIKESTATUS).optional(),
});
