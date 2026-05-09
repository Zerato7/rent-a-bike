import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const roleCheck = (requiredRole: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const role = req.headers["x-user-role"];
		if (role !== requiredRole) {
			return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
		}
		next();
	};
};
