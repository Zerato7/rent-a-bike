import { useState } from "react";
import { Table, type Column } from "../components/tables/Table";
import {
	ISSUESTATUS,
	RESOLVED,
	type IssueDetail,
	type IssueStatus,
	type ResolveIssueDto,
	bikeStatusVariant,
	type Bicycle,
	useGetResolvedIssues,
	useGetUnresolvedIssues,
	useResolveIssue,
	type ErrorResponse,
} from "@project/shared/index";
import { Photo } from "../components/Photo";
import { Pending } from "../components/states/Pending";
import { ErrorLoading } from "../components/states/ErrorLoading";
import { Tabs } from "../components/tables/Tabs";
import { Modal } from "../components/Modal";
import { BikeInfo } from "../components/info/BikeInfo";
import { PersonalInfo } from "../components/info/PersonalInfo";
import { BikeStatusBadge } from "../components/badges/BikeStatusBadge";
import { IssueStatusBadge } from "../components/badges/IssueStatusBadge";
import { HeaderMultiFilter } from "../components/tables/HeaderMultiFilter";
import { toggleSetValue } from "../utils/toggleSetValue";
import { myToast, myToastError } from "../utils/toasts";
import { compare, sortDirNeg, type SortDir } from "../utils/sortDir";

function toastReportIssue(issue: IssueDetail) {
	switch (issue.status) {
		case ISSUESTATUS.IGNORE:
			myToast("neutral", `Issue(${issue.displayId}) has been ignored.`);
			break;
		case ISSUESTATUS.REPAIR:
			myToast("warning", `Bike(${issue.bikeId.displayId}) has been sent to maintenance!`);
			break;
		case ISSUESTATUS.SUSPEND:
			myToast("danger-light", `Bike(${issue.bikeId.displayId}) has been suspended!`);
			break;
	}
}

export default function IssuesPage() {
	const {
		data: unresolvedIssues = [],
		isPending: unresolvedIsPending,
		error: unresolvedError,
		isError: unresolvedIsError,
	} = useGetUnresolvedIssues();
	const {
		data: resolvedIssues = [],
		isPending: resolvedIsPending,
		error: resolvedError,
		isError: resolvedIsError,
	} = useGetResolvedIssues();
	const { mutate  } = useResolveIssue();

	function handleReportIssue(dto: ResolveIssueDto) {
		mutate(dto, {
			onSuccess: (issue: IssueDetail) => {
				toastReportIssue(issue);
			},
			onError: (err: ErrorResponse) => {
				myToastError(err);
			},
		});
	}

	const [openUser, setOpenUser] = useState<string | null>(null);
	const [openBike, setOpenBike] = useState<Bicycle | null>(null);
	const [confirmSuspendIssue, setConfirmSuspendIssue] = useState<IssueDetail | null>(null);

	// sorting
	const [sortDirUnresolved, setSortDirUnresolved] = useState<SortDir>("asc");
	const [sortDirResolved, setSortDirResolved] = useState<SortDir>("desc");

	const handleUnresolvedSortToggle = () => {
		setSortDirUnresolved((v) => sortDirNeg(v));
		setUnresolvedPage(1);
	};

	const handleResolvedSortToggle = () => {
		setSortDirResolved((v) => sortDirNeg(v));
		setResolvedPage(1);
	};

	// filter and search
	const [statusFilter, setStatusFilter] = useState<Set<IssueStatus>>(new Set());
	
	const filteredUnresolvedIssues = unresolvedIssues.filter(() => true);

	const filteredResolvedIssues = resolvedIssues.filter((issue: IssueDetail) => {
		const matchesStatusFilter = statusFilter.size === 0 || statusFilter.has(issue.status);

		return matchesStatusFilter;
	});

	filteredUnresolvedIssues.sort((ai: IssueDetail, bi: IssueDetail) => {
		const aiCreatedAt = new Date(ai.createdAt);
		const biCreatedAt = new Date(bi.createdAt);
		return compare(sortDirUnresolved, aiCreatedAt.getTime(), biCreatedAt.getTime());
	});

	filteredResolvedIssues.sort((ai: IssueDetail, bi: IssueDetail) => {
		const aiCreatedAt = new Date(ai.createdAt);
		const biCreatedAt = new Date(bi.createdAt);
		return compare(sortDirResolved, aiCreatedAt.getTime(), biCreatedAt.getTime());
	});
	
	// pagination
	const [unresolvedPage, setUnresolvedPage] = useState(1);
	const [resolvedPage, setResolvedPage] = useState(1);
	const pageSize = 5;

	const handleStatusFilterToggle = (value: IssueStatus) => {
		setStatusFilter((prev) => toggleSetValue(prev, value));
		setResolvedPage(1);
	};

	function getColumns(page: number, resolved: boolean) {
		const columns: Column<IssueDetail>[] = [
			{
				key: "index",
				header: "#",
				render: (_, rowIndex) => (page - 1) * pageSize + rowIndex + 1,
			},
			{
				key: "bikeId",
				header: "Bicycle",
				render: (issue) => (
					<div className="flex flex-col items-start">
						<span className="text-nowrap">{issue.bikeId.displayId}</span>
						<BikeStatusBadge 
								label={issue.bikeId.status} 
								variant={bikeStatusVariant(issue.bikeId.status)} 
						/>
					</div>
				),
				onClick: (issue) => setOpenBike(issue.bikeId),
			},
			{
				key: "userId",
				header: "User",
				render: (issue) => issue.userId.username,
				onClick: (issue) => setOpenUser(issue.userId._id),
			},
			{
				key: "description",
				header: "Description"
			},
			{
				key: "photo",
				header: "Photo",
				render: (issue) => (
					<Photo
						photo={issue.photo}
						alt={`Issue(${issue._id}) photo`}
					/>
				),
				cellClassName: "w-[20%]",
			},
			{
				key: "createdAt",
				header: "Reported At",
				sortable: true,
				sortDir: resolved ? sortDirResolved : sortDirUnresolved,
				onSortToggle: () => resolved ? handleResolvedSortToggle() : handleUnresolvedSortToggle(),
				render: (issue) => (
					(issue.createdAt 
						? new Date(issue.createdAt).toLocaleString()
						: "Unknown"
					)
				),
			},
		];
		if (resolved) {
			columns.push({
				key: "status",
				header: "Status",
				headerRender: () => (
					<HeaderMultiFilter 
						headerLabel="Status"
						options={Object.values(RESOLVED)}
						selected={statusFilter}
						onToggle={handleStatusFilterToggle}
					/>	
				),
				render: (issue) => (
					<IssueStatusBadge 
						variant={issue.status}
					/>
				)
			});
		} else {
			columns.push({
				key: "actions",
				header: "Actions",
				render: (issue) => (
					<div className="flex flex-col items-start justify-center gap-2">
						<IssueStatusBadge 
							variant="Ignore"
							onClick={() => handleReportIssue({
								id: issue._id,
								status: "Ignore"
							})}
						/>
						<IssueStatusBadge 
							variant="Repair"
							onClick={() => handleReportIssue({
								id: issue._id,
								status: "Repair"
							})}
						/>
						<IssueStatusBadge 
							variant="Suspend"
							onClick={() => setConfirmSuspendIssue(issue)}
						/>
					</div>
				),
			});
		}
		return columns;
	}

	if (unresolvedIsPending || resolvedIsPending) {
		return <Pending label="reported issues" />
	}

	if (unresolvedIsError) {
		return <ErrorLoading 
			label="unresolved issues"
			error={unresolvedError}
		/>
	}

	if (resolvedIsError) {
		return <ErrorLoading 
			label="resolved issues"
			error={resolvedError}
		/>
	}

	return (
		<div className="max-w-6xl mx-auto">
			<Tabs 
				label1="Unresolved Issues"
				label2="Resolved Issues"
				child1={
					<Table 
						columns={getColumns(unresolvedPage, false)}
						data={unresolvedIssues}
						emptyMessage="No unresolved issues"
						page={unresolvedPage}
						pageSize={pageSize}
						onPageChange={setUnresolvedPage}
					/>
				}
				child2={
					<Table 
						columns={getColumns(resolvedPage, true)}
						data={filteredResolvedIssues}
						emptyMessage="No resolved issues"
						page={resolvedPage}
						pageSize={pageSize}
						onPageChange={setResolvedPage}
					/>
				}
			/>
			{openBike && <Modal
				open={!!openBike}
				onClose={() => {
					setOpenBike(null);
				}}
				title="Bicycle Info"
				titleAlign="between"
				titleColor="text-success-light"
				contentClassName="bg-blackish border-success-light pb-1"
			>
				{() => (
					<BikeInfo 
						bike={openBike} 
						labelColor="text-success-light"
						infoColor="text-success"	
					/>
				)}
			</Modal>}
			{openUser && <Modal
				open={!!openUser}
				onClose={() => {
					setOpenUser(null);
				}}
				title="User Info"
				titleAlign="between"
				titleColor="text-success-light"
				contentClassName="bg-blackish border-success-light pb-1"
			>
				{() => (
					<PersonalInfo
						userId={openUser}
						labelColor="text-success-light"
						infoColor="text-success"
					/>
				)}
			</Modal>}
			{confirmSuspendIssue && <Modal
				open={!!confirmSuspendIssue}
				onClose={() => {
					setConfirmSuspendIssue(null);
				}}
				title="Confirm Suspension"
				titleAlign="between"
				titleColor="text-blackish"
				contentClassName="bg-danger-light border-blackish pb-1"
			>
				{(close) => (
					<div className="flex flex-col items-center justify-center gap-6">
						<div className="text-blackish font-semibold">
							Are you sure you want to suspend bike
							<span className="text-success-light font-bold mx-1">
								{confirmSuspendIssue.bikeId.displayId}
							</span>
							?
						</div>
						<div className="w-full flex items-center justify-between">
							<button
								onClick={() => {
									handleReportIssue({
										id: confirmSuspendIssue._id,
										status: "Suspend",
									});
									close();
								}}
								className="
									text-white font-semibold
									p-2 
									rounded border-2 border-white
									bg-danger hover:bg-danger/50 transition
								"
							>
								Yes, suspend
							</button>
							<button
								onClick={() => close()}
								className="
									text-blackish font-semibold
									p-2 
									rounded border-2 border-blackish
									bg-neutral hover:bg-neutral/50 transition 
								"
							>
								No, cancel
							</button>
						</div>
					</div>
				)}
			</Modal>}
		</div>
	);
}
