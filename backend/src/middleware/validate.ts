import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { ParamsDictionary } from "express-serve-static-core";

export const validate =
	<P = ParamsDictionary>(schema: any) =>
	(req: Request<P>, res: Response, next: NextFunction) => {
		try {
			req.body = schema.parse(req.body);
			next();
		} catch (err: any) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: "Bad request",
				...z.flattenError(err),
			});
		}
	};
