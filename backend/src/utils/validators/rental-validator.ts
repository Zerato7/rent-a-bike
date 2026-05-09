import z from "zod";
import { idRule, stringRequiredRule } from "./util-validators.js";

export const startRentalRequest = z.object({
	userId: idRule("User"),
	bikeQrToken: stringRequiredRule("Bike qr token"),
});
