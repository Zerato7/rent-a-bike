import { Request, Response } from "express";
import Bicycle, { BIKESTATUS } from "../models/bicycle.js";
import {
	BikeStatusError,
	MissingInputDataError,
	NotAtParkingError,
	NotFoundError,
	RentalAlreadyEndedError,
	UserAlreadyHasActiveRentalError,
} from "../utils/errors.js";
import User from "../models/user.js";
import Rental from "../models/rental.js";
import { StatusCodes } from "http-status-codes";
import { UserIdParams } from "./user-controller.js";
import Parking from "../models/parking.js";
import Location from "../models/submodels/location.js";

export const startRental = async (req: Request, res: Response) => {
	const { userId, bikeQrToken } = req.body;

	const user = await User.findById(userId);
	if (!user) throw new NotFoundError("User", "id", userId);

	const bike = await Bicycle.findOne({ qrToken: bikeQrToken});
	if (!bike) throw new NotFoundError("Bicycle", "qrToken", bikeQrToken);

	if (bike.status !== BIKESTATUS.AVAILABLE)
		throw new BikeStatusError(bike.status, BIKESTATUS.IN_USE);

	const activeRental = await Rental.findOne({
        userId,
        endTime: { $exists: false },
    });

    if (activeRental) {
        throw new UserAlreadyHasActiveRentalError(user.username); 
    }

	const rental = new Rental({
		userId,
		bikeId: bike._id,
		startTime: new Date(),
	});
	bike.status = BIKESTATUS.IN_USE;

	await Promise.all([rental.save(), bike.save()]);
	res.status(StatusCodes.CREATED).json(rental);
};

export interface RentalIdParams {
	id: string;
}

export const endRental = async (
	req: Request<RentalIdParams>,
	res: Response,
) => {
	const rentalId = req.params.id;

	const relativePath = "/uploads/rentals/" + req.file?.filename;

	const rental = await Rental.findById(rentalId);
	if (!rental) throw new NotFoundError("Rental", "id", rentalId);

	if (rental.endTime) throw new RentalAlreadyEndedError();

	const { lng, lat } = req.query;
	
	if (!lng || !lat) {
		throw new MissingInputDataError("Longitude and latitude are required.");
	}

	const longitude = parseFloat(lng as string);
	const latitude = parseFloat(lat as string);

	const parkings = await Parking.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [longitude, latitude],
				},
				distanceField: "distance",
				spherical: true,
			}
		},
		{ $limit: 3 }
	]);
	if (parkings.length < 1 || parkings[0].distance > 50) {
		throw new NotAtParkingError();
	}

	const location = await Location.findOne({ name: parkings[0].name });
	if (!location) {
		throw new NotFoundError("Location", "name", parkings[0].name);
	}

	rental.endTime = new Date();
	const duration = Math.ceil(
		(rental.endTime.getTime() - rental.startTime.getTime()) /
			(1000 * 60 * 60),
	);

	const bike = await Bicycle.findById(rental.bikeId);
	if (bike) {
		rental.price = duration * bike.pricePerHour;
		bike.status = BIKESTATUS.AVAILABLE;
		bike.location = location._id;
		await bike.save();
	}

	rental.photo = relativePath;

	await rental.save();
	res.json(rental);
};

export const getUserActiveRental = async (
	req: Request<UserIdParams>,
	res: Response,
) => {
	const userId = req.params.id;

	const rentals = await Rental.findOne({
		userId,
		endTime: { $exists: false },
	}).populate({
		path: "bikeId",
		populate: "location"
	});
	res.json(rentals);
};

export const getUserHistoryRentals = async (
	req: Request<UserIdParams>,
	res: Response,
) => {
	const userId = req.params.id;

	const rentals = await Rental.find({
		userId,
		endTime: { $exists: true },
	}).populate({
		path: "bikeId",
		populate: "location"
	}).sort("-endTime -startTime");
	res.json(rentals);
};

export const getRentals = async (req: Request, res: Response) => {
	const rentals = await Rental.find()
		.populate({
			path: "bikeId",
			populate: "location"
		})
		.populate("userId", "username");
	res.json(rentals);
};
