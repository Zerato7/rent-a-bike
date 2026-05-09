import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { UploadError } from "../utils/errors.js";
import { ParamsDictionary } from "express-serve-static-core";

export const wrapUpload = <P = ParamsDictionary>(uploadMiddleware: any) => {
	return (req: Request<P>, res: Response, next: NextFunction) => {
		uploadMiddleware(req, res, (err: any) => {
			if (err) {
				const message =
					err.code === "LIMIT_FILE_SIZE"
						? "File too large (max 5MB)"
						: err.message;
				return next(new UploadError(message));
			}
			if (!req.file) {
				return next(new UploadError("Photo is required"));
			}
			next();
		});
	};
};

const storage = (location: string) => multer.diskStorage({
	destination: (req: Request, file: Express.Multer.File, cb) => {
		cb(null, path.join(process.cwd(), `public/uploads/${location}`));
	},
	filename: (req: Request, file: Express.Multer.File, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, file.fieldname + "-" + uniqueSuffix + ext);
	}
});

const issueStorage = storage("issues");
const rentalStorage = storage("rentals");

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
	const allowed = [".jpg", ".jpeg", ".png"];
	const ext = path.extname(file.originalname).toLowerCase();
	if (!allowed.includes(ext)) return cb(new Error("Only .jpg and .png files are allowed"));
	cb(null, true);
};

const limits = {
	fileSize: 5 * 1024 * 1024
};

export const uploadIssuePhoto = multer({
	storage: issueStorage,
	fileFilter,
	limits,
}).single("photo");

export const uploadRentalPhoto = multer({
	storage: rentalStorage,
	fileFilter,
	limits, 
}).single("photo");
