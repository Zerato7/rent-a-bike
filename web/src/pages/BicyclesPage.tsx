import {
	useGetBikes,
	useGetLocations,
	type BikeStatus,
	BIKESTATUS,
	bikeStatusVariant,
	type Bicycle,
	type BikeType,
	BIKETYPE,
	formatLocation,
} from "@project/shared/index";
import { Pencil, QrCode } from "lucide-react";
import { useState } from "react";
import { BikeStatusBadge } from "../components/badges/BikeStatusBadge";
import { Table, type Column } from "../components/tables/Table";
import { TableToolbar } from "../components/tables/TableToolbar";
import bicycleOverview from "../assets/bicycle-overview.svg";
import { HeaderMultiFilter } from "../components/tables/HeaderMultiFilter";
import { toggleSetValue } from "../utils/toggleSetValue";
import { Modal } from "../components/Modal";
import { AddBikeForm } from "../components/forms/AddBikeForm";
import { EditBikeForm } from "../components/forms/EditBikeForm";
import { Pending } from "../components/states/Pending";
import { ErrorLoading } from "../components/states/ErrorLoading";
import { compare, sortDirNeg, type SortDir } from "../utils/sortDir";
import { BikeQrCode } from "../components/info/BikeQrCode";

export default function BicyclesPage() {
	const { data: bikes = [], isPending, error, isError } = useGetBikes();
	const { data: locations = [] } = useGetLocations();

	const [addBikeOpen, setAddBikeOpen] = useState(false);
	const [editBike, setEditBike] = useState<Bicycle | null>(null);
	const [bikeQrCode, setBikeQrCode] = useState<Bicycle | null>(null);

	const openAddBike = () => {
		setEditBike(null);
		setBikeQrCode(null);
		setAddBikeOpen(true);
	};

	const openEditBike = (bike: Bicycle) => {
		setAddBikeOpen(false);
		setBikeQrCode(null);
		setEditBike(bike);
	};

	const openBikeQrCode = (bike: Bicycle) => {
		setAddBikeOpen(false);
		setEditBike(null);
		setBikeQrCode(bike);
	}

	const [typeFilter, setTypeFilter] = useState<Set<BikeType>>(new Set());
	const [statusFilter, setStatusFilter] = useState<Set<BikeStatus>>(
		new Set(),
	);
	const [search, setSearch] = useState("");
	const [sortDir, setSortDir] = useState<SortDir>("asc");
	const [page, setPage] = useState(1);
	const pageSize = 5;

	const handleSearch = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const handleTypeFilterToggle = (value: BikeType) => {
		setTypeFilter((prev) => toggleSetValue(prev, value));
		setPage(1);
	};

	const handleStatusFilterToggle = (value: BikeStatus) => {
		setStatusFilter((prev) => toggleSetValue(prev, value));
		setPage(1);
	};

	const handleSortToggle = () => {
		setSortDir((v) => sortDirNeg(v));
		setPage(1);
	};

	const filteredBikes = bikes.filter((bike: Bicycle) => {
		const matchesSearch = bike.location.name
			?.toLowerCase()
			.includes(search.toLowerCase());

		const matchesTypeFilter =
			typeFilter.size === 0 || typeFilter.has(bike.type);

		const matchesStatusFilter =
			statusFilter.size === 0 || statusFilter.has(bike.status);

		return matchesSearch && matchesTypeFilter && matchesStatusFilter;
	});

	filteredBikes.sort((ab: Bicycle, bb: Bicycle) => {
		return compare(sortDir, ab.pricePerHour, bb.pricePerHour);
	});

	const columns: Column<Bicycle>[] = [
		{
			key: "index",
			header: "#",
			render: (_, rowIndex) => (page - 1) * pageSize + rowIndex + 1,
		},
		{
			key: "displayId",
			header: "Display ID",
		},
		{
			key: "location",
			header: "Location",
			render: (bike) => formatLocation(bike),
		},
		{
			key: "type",
			header: "Type",
			headerRender: () => (
				<HeaderMultiFilter
					headerLabel="Type"
					options={Object.values(BIKETYPE)}
					selected={typeFilter}
					onToggle={handleTypeFilterToggle}
				/>
			),
		},
		{
			key: "pricePerHour",
			header: "Price / Hour",
			sortable: true,
			sortDir: sortDir,
			onSortToggle: handleSortToggle,
			render: (bike) => `${bike.pricePerHour} RSD`,
		},
		{
			key: "status",
			header: "Status",
			headerRender: () => (
				<HeaderMultiFilter
					headerLabel="Status"
					options={Object.values(BIKESTATUS)}
					selected={statusFilter}
					onToggle={handleStatusFilterToggle}
				/>
			),
			render: (bike) => (
				<BikeStatusBadge
					label={bike.status}
					variant={bikeStatusVariant(bike.status)}
				/>
			),
		},
		{
			key: "actions",
			header: "Actions",
			render: (bike) => (
				<div className="flex items-center justify-center gap-2">
					<Pencil
						onClick={() => openEditBike(bike)}
						className="h-5 w-auto text-warning/70 cursor-pointer hover:text-warning transition"
					/>
					<QrCode 
						onClick={() => openBikeQrCode(bike)}
						className={`
							h-5 w-auto 
							text-neutral/70 
							${bike.status === BIKESTATUS.AVAILABLE 
								? "cursor-pointer hover:text-neutral transition"
								: "cursor-not-allowed"
							}
						`}
					/>
				</div>
			),
			cellClassName: "w-20",
		},
	];

	if (isPending) {
		return <Pending label="bicycles" />;
	}

	if (isError) {
		return <ErrorLoading label="bicycles" error={error} />;
	}

	return (
		<div className="max-w-7xl mx-auto">
			<img
				src={bicycleOverview}
				alt="Bicycle Overview"
				className="h-8 w-auto mb-4 mx-auto"
			/>
			<TableToolbar
				search={search}
				searchPlaceholder="Search location ..."
				onSearch={handleSearch}
				onAdd={openAddBike}
				addLabel="Add bicycle"
			/>
			<Table
				columns={columns}
				data={filteredBikes}
				emptyMessage="No bicycles found"
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
			/>
			<Modal<Bicycle>
				open={addBikeOpen}
				onClose={() => {
					setAddBikeOpen(false);
				}}
				title="Add new bicycle"
				titleAlign="center"
				contentClassName="bg-success-light border-success pb-1"
			>
				{(close) => (
					<AddBikeForm
						locations={locations}
						onCancel={close}
						onSuccess={(bike) => close(bike)}
					/>
				)}
			</Modal>
			{editBike && (
				<Modal<Bicycle>
					open={!!editBike}
					onClose={() => {
						setEditBike(null);
					}}
					title="Edit bicycle"
					titleAlign="center"
					contentClassName="bg-warning border-primary"
				>
					{(close) => (
						<EditBikeForm
							bicycle={editBike}
							locations={locations}
							onCancel={close}
							onSuccess={(bike) => close(bike)}
						/>
					)}
				</Modal>
			)}
			{bikeQrCode && (
				<Modal
					open={!!bikeQrCode}
					onClose={() => {
						setBikeQrCode(null);
					}}
					title="Bike Qr Code"
					titleAlign="center"
					titleColor="text-primary"
					contentClassName="bg-white border-primary pb-1"
				>
					{() => (
						<div className="flex items-center justify-center">
							<BikeQrCode 
								token={bikeQrCode.qrToken}
								size={400}
							/>
						</div>
					)}
				</Modal>
			)}
		</div>
	);
}
