import { Request, Response } from "express";
import Parking from "../models/parking.js";
import { MissingInputDataError } from "../utils/errors.js";

export const getParkingSpots = async (req: Request, res: Response) => {
	const parkingSpots = await Parking.find();
	res.json(parkingSpots);
};

export const getNearbyParkingSpots = async (req: Request, res: Response) => {
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

    res.json(parkings);
};
