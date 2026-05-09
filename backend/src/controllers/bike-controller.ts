import { Request, Response } from "express";
import Bicycle, { BIKESTATUS } from "../models/bicycle.js";
import { StatusCodes } from "http-status-codes";
import { BikeStatusError, NotFoundError } from "../utils/errors.js";
import { canConvert } from "../utils/bike-status.js";
import Location from "../models/submodels/location.js";
import { randomUUID } from "crypto";

export const registerBike = async (req: Request, res: Response) => {
	const { locationId, type, pricePerHour } = req.body;

	const bike = new Bicycle({
		location: locationId,
		type,
		pricePerHour,
		status: BIKESTATUS.AVAILABLE,
	});

	await bike.save();
	res.status(StatusCodes.CREATED).json(bike);
};

export const updateBike = async (req: Request<BikeIdParams>, res: Response) => {
	const bikeId = req.params.id;

	const { locationId, type, pricePerHour, status } = req.body;

	const bike = await Bicycle.findById(bikeId).populate("location");
	if (!bike) throw new NotFoundError("Bicycle", "id", bikeId);

	if (status && !canConvert(bike.status, status))
		throw new BikeStatusError(bike.status, status);

	if (locationId) {
		const location = await Location.findById(locationId);
		if (!location) throw new NotFoundError("Location", "id", locationId);

		bike.location = locationId;
	}
	if (type) bike.type = type;
	if (pricePerHour) bike.pricePerHour = pricePerHour;
	if (status) bike.status = status;

	await bike.save();
	const savedBike = await bike.populate("location");
	res.json(savedBike);
};

export const getBikes = async (req: Request, res: Response) => {
	const bikes = await Bicycle.find().populate("location");
	res.json(bikes);
};

export interface BikeIdParams {
	id: string;
}

export const getBike = async (req: Request<BikeIdParams>, res: Response) => {
	const bikeId = req.params.id;

	const bike = await Bicycle.findById(bikeId).populate("location");
	res.json(bike);
};

export const updateAllBikes = async (req: Request, res: Response) => {
	const bikes = await Bicycle.find({}, "_id");

	const bulkWrite = bikes.map((bike) => ({
		updateOne: {
			filter: { _id: bike._id },
			update: { $set: { qrToken: randomUUID() } },
		}
	}));

	if (bulkWrite.length > 0) {
		const result = await Bicycle.bulkWrite(bulkWrite);
		console.log(result.modifiedCount);
	} else {
		console.log("nothing");
	}
	
	res.json();
}
