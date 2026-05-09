import z from "zod";
import { idRule, stringRequiredRule } from "./util-validators";
import { ISSUESTATUS } from "../models/issue";

export const reportIssueRequest = z.object({
	userId: idRule("User"),
	bikeId: idRule("Bicycle"),
	description: stringRequiredRule("Description"),
	photo: z.any().refine((file: any) => file !== null, "Photo is required"),
});

export type ReportIssueForm = z.infer<typeof reportIssueRequest>;

const allowedStatuses = Object.values(ISSUESTATUS).filter(
	(s) => s !== ISSUESTATUS.UNRESOLVED,
) as [string, ...string[]];

export const resolveIssueRequest = z.object({
	status: z.enum(allowedStatuses),
});
