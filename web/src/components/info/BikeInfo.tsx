import { bikeStatusVariant, formatLocation, type Bicycle } from "@project/shared/index";
import { BikeStatusBadge } from "../badges/BikeStatusBadge";

interface BikeInfoProps {
	bike: Bicycle;
	labelColor: string;
	infoColor: string;
}

export function BikeInfo({ 
	bike, 
	labelColor,
	infoColor
}: BikeInfoProps) {
	return (
		<div className={`grid sm:grid-cols-[2fr_1fr] grid-cols-1 gap-2 ${infoColor} font-semibold`}>
			<div className="sm:col-span-2">
				<div className={`${labelColor}`}>Display ID</div>
				<div>{bike.displayId}</div>
			</div>
			<div>
				<div className={`${labelColor}`}>Type</div>
				<div>{bike.type}</div>
			</div>
			<div>
				<div className={`${labelColor}`}>Price per Hour</div>
				<div>{bike.pricePerHour} RSD</div>
			</div>
			<div>
				<div className={`${labelColor}`}>Location</div>
				<div>{formatLocation(bike)}</div>
			</div>
			<div className="flex items-center">
				<BikeStatusBadge 
					label={bike.status}
					variant={bikeStatusVariant(bike.status)}
					className="border-success-light"
				/>
			</div>
		</div>
	);
}
