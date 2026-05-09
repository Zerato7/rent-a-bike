import z from "zod";
import { idRule, stringRequiredRule } from "./util-validators";

export const startRentalRequest = z.object({
	userId: idRule("User"),
	bikeQrToken: stringRequiredRule("Bike qr token"),
});

export type StartRentalForm = z.infer<typeof startRentalRequest>;

export const endRentalRequest = z.object({
	photo: z.any().refine((file: any) => file !== null, "Photo is required"),
});

export type EndRentalForm = z.infer<typeof endRentalRequest>;
