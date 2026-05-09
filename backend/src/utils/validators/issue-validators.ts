import z from "zod";
import { idRule, stringRequiredRule } from "./util-validators.js";
import { ISSUESTATUS } from "../../models/issue.js";

export const reportRule = z.object({
	userId: idRule("User"),
	bikeId: idRule("Bicycle"),
	description: stringRequiredRule("Description"),
});

const allowedStatuses = Object.values(ISSUESTATUS).filter(
	(s) => s !== ISSUESTATUS.UNRESOLVED,
) as [string, ...string[]];

export const resolveIssueRequest = z.object({
	status: z.enum(allowedStatuses),
});
