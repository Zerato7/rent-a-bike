import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

export const asyncHandler =
	<P = ParamsDictionary>(
		fn: (
			req: Request<P>,
			res: Response,
			next: NextFunction,
		) => Promise<any>,
	) =>
	(req: Request<P>, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next)
	};
