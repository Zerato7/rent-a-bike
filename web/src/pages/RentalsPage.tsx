import { useState, type SetStateAction } from "react";
import { Table, type Column } from "../components/tables/Table";
import {
	getCurrentPrice,
	getDuration,
	type RentalFullDetail,
	useGetRentals,
	type Bicycle,
} from "@project/shared/index";
import { Pending } from "../components/states/Pending";
import { ErrorLoading } from "../components/states/ErrorLoading";
import { Tabs } from "../components/tables/Tabs";
import { Photo } from "../components/Photo";
import { compare, sortDirNeg, type SortDir } from "../utils/sortDir";
import { Modal } from "../components/Modal";
import { BikeInfo } from "../components/info/BikeInfo";
import { PersonalInfo } from "../components/info/PersonalInfo";

export default function RentalsPage() {
	const { data: rentals = [], isPending, error, isError } = useGetRentals();

	const [openBike, setOpenBike] = useState<Bicycle | null>(null);
	const [openUser, setOpenUser] = useState<string | null>(null);

	// sorting for Active Rentals
	const [sortDirActiveStartTime, setSortDirActiveStartTime] = useState<SortDir>("desc");
	const [sortDirActivePrice, setSortDirActivePrice] = useState<SortDir>("desc");

	type sortActiveKey = "startTime" | "price";
	const [sortOrderActive, setSortOrderActive] = useState<sortActiveKey[]>(["startTime", "price"]);

	const sortByActiveStartTime = (ar: RentalFullDetail, br: RentalFullDetail,) => {
		const arStartDate = new Date(ar.startTime);
		const brStartDate = new Date(br.startTime);
		return compare<number>(sortDirActiveStartTime, arStartDate.getTime(), brStartDate.getTime());
	};

	const sortByActivePrice = (ar: RentalFullDetail, br: RentalFullDetail) => {
		const arPrice = getCurrentPrice(ar);
		const brPrice = getCurrentPrice(br);
		return compare<number>(sortDirActivePrice, arPrice, brPrice);
	};

	const sortRegistryActive = {
		startTime: sortByActiveStartTime,
		price: sortByActivePrice,
	};

	// sorting for Old Rentals
	const [sortDirOldStartTime, setSortDirOldStartTime] = useState<SortDir>("desc");
	const [sortDirOldEndTime, setSortDirOldEndTime] = useState<SortDir>("desc");
	const [sortDirOldPrice, setSortDirOldPrice] = useState<SortDir>("desc");

	type sortOldKey = "startTime" | "endTime" | "price";
	const [sortOrderOld, setSortOrderOld] = useState<sortOldKey[]>(["endTime", "startTime", "price"]);

	const sortByOldStartTime = (ar: RentalFullDetail, br: RentalFullDetail) => {
		const arStartDate = new Date(ar.startTime);
		const brStartDate = new Date(br.startTime);
		return compare<number>(sortDirOldStartTime, arStartDate.getTime(), brStartDate.getTime());
	};

	const sortByOldEndTime = (ar: RentalFullDetail, br: RentalFullDetail) => {
		const arEndDate = ar.endTime ? new Date(ar.endTime) : new Date();
		const brEndDate = br.endTime ? new Date(br.endTime) : new Date();
		return compare<number>(sortDirOldEndTime, arEndDate.getTime(), brEndDate.getTime());
	};

	const sortByOldPrice = (ar: RentalFullDetail, br: RentalFullDetail) => {
		const arPrice = getCurrentPrice(ar);
		const brPrice = getCurrentPrice(br);
		return compare<number>(sortDirOldPrice, arPrice, brPrice);
	};

	const sortRegistryOld = {
		startTime: sortByOldStartTime,
		endTime: sortByOldEndTime,
		price: sortByOldPrice,
	}

	// pagination
	const [activePage, setActivePage] = useState(1);
	const [oldPage, setOldPage] = useState(1);
	const pageSize = 5;

	const activeRentals = rentals.filter((rental: RentalFullDetail) => !rental.endTime);
	const oldRentals = rentals.filter((rental: RentalFullDetail) => rental.endTime);

	activeRentals.sort((ar: RentalFullDetail, br: RentalFullDetail) => {
		for (const key of sortOrderActive) {
			const ret = sortRegistryActive[key](ar, br);
			if (ret !== 0) return ret;
		}
		return 0;
	});

	oldRentals.sort((ar: RentalFullDetail, br: RentalFullDetail) => {
		for (const key of sortOrderOld) {
			const ret = sortRegistryOld[key](ar, br);
			if (ret !== 0) return ret;
		}
		return 0;
	})

	const handleSortToggleActive = (key: sortActiveKey, setSortDirActive: (value: SetStateAction<SortDir>) => void) => {
		setSortDirActive((v) => sortDirNeg(v));
		setSortOrderActive((prev) => [
			key,
			...prev.filter((k) => k !== key),
		]);
		setActivePage(1);
	};

	const handleSortToggleOld = (key: sortOldKey, setSortDirOld: (value: SetStateAction<SortDir>) => void) => {
		setSortDirOld((v) => sortDirNeg(v));
		setSortOrderOld((prev) => [
			key,
			...prev.filter((k) => k !== key),
		]);
		setActivePage(1);
	};

	const columnsActive: Column<RentalFullDetail>[] = [
		{
			key: "index",
			header: "#",
			render: (_, rowIndex) => (activePage - 1) * pageSize + rowIndex + 1,
		},
		{
			key: "bikeId",
			header: "Bicycle",
			render: (rental) => (
				<div className="flex flex-col items-start">
					<span className="text-nowrap">{rental.bikeId.displayId}</span>
					<span className="opacity-50 text-sm">
						{rental.bikeId.pricePerHour} RSD
					</span>
				</div>
			),
			onClick: (rental) => setOpenBike(rental.bikeId),
		},
		{
			key: "userId",
			header: "User",
			render: (rental) => rental.userId.username,
			onClick: (rental) => setOpenUser(rental.userId._id),
		},
		{
			key: "startTime",
			header: "Start Time",
			sortable: true,
			sortDir: sortDirActiveStartTime,
			onSortToggle: () => handleSortToggleActive("startTime", setSortDirActiveStartTime),
			render: (rental) => new Date(rental.startTime).toLocaleString(),
		},
		{
			key: "Current Price",
			header: "Current Price",
			sortable: true,
			sortDir: sortDirActivePrice,
			onSortToggle: () => handleSortToggleActive("price", setSortDirActivePrice),
			render: (rental) => `${getCurrentPrice(rental)} RSD`,
		},
	];

	const columnsOld: Column<RentalFullDetail>[] = [
		{
			key: "index",
			header: "#",
			render: (_, rowIndex) => (oldPage - 1) * pageSize + rowIndex + 1,
		},
		{
			key: "bikeId",
			header: "Bicycle",
			render: (rental) => (
				<div className="flex flex-col items-start">
					<span className="text-nowrap">{rental.bikeId.displayId}</span>
					<span className="opacity-50 text-sm">
						{rental.bikeId.pricePerHour} RSD
					</span>
				</div>
			),
			onClick: (rental) => setOpenBike(rental.bikeId),
		},
		{
			key: "userId",
			header: "User",
			render: (rental) => rental.userId.username,
			onClick: (rental) => setOpenUser(rental.userId._id),
		},
		{
			key: "startTime",
			header: "Start Time",
			sortable: true,
			sortDir: sortDirOldStartTime,
			onSortToggle: () => handleSortToggleOld("startTime", setSortDirOldStartTime),
			render: (rental) => new Date(rental.startTime).toLocaleString(),
		},
		{
			key: "endTime",
			header: "End Time",
			sortable: true,
			sortDir: sortDirOldEndTime,
			onSortToggle: () => handleSortToggleOld("endTime", setSortDirOldEndTime),
			render: (rental) => {
				if (rental.endTime)
					return new Date(rental.endTime).toLocaleString();
				return undefined;
			},
		},
		{
			key: "price",
			header: "Price / Duration",
			sortable: true,
			sortDir: sortDirOldPrice,
			onSortToggle: () => handleSortToggleOld("price", setSortDirOldPrice),
			render: (rental) => (
				<div className="flex flex-col items-start">
					{`${rental.price ?? undefined} RSD`}
					<span className="opacity-50 text-sm">
						{getDuration(rental)}
					</span>
				</div>
			),
		},
		{
			key: "photo",
			header: "Photo",
			render: (rental) => (
				<Photo
					photo={rental.photo}
					alt={`Rental(${rental._id}) photo`}
				/>
			),
			cellClassName: "w-1/4",
		},
	];

	if (isPending) {
		return <Pending label="rentals" />;
	}

	if (isError) {
		return <ErrorLoading label="rentals" error={error} />;
	}

	return (
		<div className="max-w-5xl mx-auto">
			<Tabs
				label1="Active Rentals"
				label2="Old Rentals"
				child1={
					<Table<RentalFullDetail>
						columns={columnsActive}
						data={activeRentals}
						emptyMessage="No active rentals"
						page={activePage}
						pageSize={pageSize}
						onPageChange={setActivePage}
					/>
				}
				child2={
					<Table
						columns={columnsOld}
						data={oldRentals}
						emptyMessage="No old rentals"
						page={oldPage}
						pageSize={pageSize}
						onPageChange={setOldPage}
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
		</div>
	);
}
