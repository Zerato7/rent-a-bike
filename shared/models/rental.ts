import type { Bicycle } from "./bicycle";

export interface Rental {
	_id: string;
	userId: string;
	bikeId: string;
	startTime: Date | string;
	endTime?: Date | string;
	price?: number;
	photo?: string;
	createdAt?: Date | string;
	updatedAt?: Date | string;
}

export interface RentalLiteDetail extends Omit<Rental, "bikeId"> {
	bikeId: Bicycle;
}

export interface RentalFullDetail extends Omit<RentalLiteDetail, "userId"> {
	userId: {
		_id: string;
		username: string;
	};
}

export interface StartRentalDto {
	userId: string;
	bikeQrToken: string;
}

export interface EndRentalDto {
	id: string;
	lng: number;
	lat: number;
	photo: File | Blob;
}

const formatDuration = (ms: number) => {
	const hours = Math.floor(ms / (60 * 60 * 1000));
	const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
	const seconds = Math.floor((ms % (60 * 1000)) / 1000);
	const milliseconds = ms % 1000;

	return `${hours}:${
			minutes
				.toString()
				.padStart(2, "0")
		}:${
			seconds
				.toString()
				.padStart(2, "0")
		}.${
			milliseconds
				.toString()
				.padStart(3, "0")
		}`;
};

export function getDuration(rental: RentalFullDetail) {
	const endTime = rental.endTime ? new Date(rental.endTime) : new Date();
	const startTime = new Date(rental.startTime);
	return formatDuration(endTime.getTime() - startTime.getTime());
}

export function getDurationLite(rental: RentalLiteDetail) {
	const endTime = rental.endTime ? new Date(rental.endTime) : new Date();
	const startTime = new Date(rental.startTime);
	return formatDuration(endTime.getTime() - startTime.getTime());
}

export function getCurrentPrice(rental: RentalFullDetail) {
	const endDate = new Date();
	const startDate = new Date(rental.startTime);
	return (
		Math.ceil(
			(endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000),
		) * rental.bikeId.pricePerHour
	);
}
