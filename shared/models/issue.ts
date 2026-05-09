import type { Bicycle } from "./bicycle";

export const ISSUESTATUS = {
	UNRESOLVED: "Unresolved",
	IGNORE: "Ignore",
	REPAIR: "Repair",
	SUSPEND: "Suspend",
} as const;

export type IssueStatus = (typeof ISSUESTATUS)[keyof typeof ISSUESTATUS];

export const RESOLVED = Object.values(ISSUESTATUS).filter(
	(issue) => issue !== ISSUESTATUS.UNRESOLVED,
);

export interface Issue {
	_id: string;
	userId: string;
	bikeId: string;
	description: string;
	photo: string;
	status: IssueStatus;
	createdAt: Date | string;
	updatedAt?: Date | string;
	displayId: string;
}

export interface IssueDetail extends Omit<Issue, "userId" | "bikeId"> {
	userId: {
		_id: string;
		username: string;
	};
	bikeId: Bicycle;
}

export interface ReportIssueDto {
	userId: string;
	bikeId: string;
	description: string;
	photo: File | Blob;
}

export interface ResolveIssueDto {
	id: string;
	status: IssueStatus;
}
