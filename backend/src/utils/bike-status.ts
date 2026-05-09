import { BIKESTATUS } from "../models/bicycle.js";
import { ISSUESTATUS } from "../models/issue.js";

export function canConvert(
	from: (typeof BIKESTATUS)[keyof typeof BIKESTATUS],
	to: (typeof BIKESTATUS)[keyof typeof BIKESTATUS],
): boolean {
	if (
		from === BIKESTATUS.IN_USE &&
		(to === BIKESTATUS.MAINTENANCE || to === BIKESTATUS.SUSPENDED)
	)
		return false;
	if (
		(from === BIKESTATUS.MAINTENANCE || from === BIKESTATUS.SUSPENDED) &&
		to === BIKESTATUS.IN_USE
	)
		return false;
	return true;
}

export function fromIssueStatusToBikeStatus(
	issueStatus: (typeof ISSUESTATUS)[keyof typeof ISSUESTATUS],
): (typeof BIKESTATUS)[keyof typeof BIKESTATUS] | null {
	if (issueStatus === ISSUESTATUS.REPAIR) return BIKESTATUS.MAINTENANCE;
	if (issueStatus === ISSUESTATUS.SUSPEND) return BIKESTATUS.SUSPENDED;
	return null
}
