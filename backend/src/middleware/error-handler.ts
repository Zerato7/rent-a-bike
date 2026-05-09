import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/errors.js";
import mongoose from "mongoose";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	console.error("Error:", err);

	const status = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	res.status(status).json({ error: message, errors: err.errors });
};
