import { Request, Response } from "express";
import Location from "../models/submodels/location.js";

export const getLocations = async (req: Request, res: Response) => {
	const locations = await Location.find();
	res.json(locations);
};
