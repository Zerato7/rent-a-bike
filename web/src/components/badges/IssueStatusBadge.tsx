import { ISSUESTATUS, type IssueStatus } from "@project/shared/index";
import { CircleAlert, CircleX, Settings } from "lucide-react";

interface IssueStatusBadge {
	variant: IssueStatus;
	onClick?: () => void;
}

export function IssueStatusBadge({ variant, onClick }: IssueStatusBadge) {
	switch (variant) {
		case ISSUESTATUS.IGNORE:
			return (
				<div
					className={`
						flex flex-wrap justify-center gap-1 
						text-neutral font-bold
						${onClick ? "cursor-pointer" : ""}
					`}
					onClick={() => onClick && onClick()}
				>
					<CircleX />
					Ignore
				</div>
			);
		case ISSUESTATUS.REPAIR:
			return (
				<div
					className={`
						flex flex-wrap justify-center gap-1 
						text-warning font-bold
						${onClick ? "cursor-pointer" : ""}
					`}
					onClick={() => onClick && onClick()}
				>
					<Settings />
					Repair
				</div>
			);
		case ISSUESTATUS.SUSPEND:
			return (
				<div
					className={`
						flex flex-wrap justify-center gap-1 
						text-danger-light font-bold
						${onClick ? "cursor-pointer" : ""}
					`}
					onClick={() => onClick && onClick()}
				>
					<CircleAlert />
					Suspend
				</div>
			);
	}
}
