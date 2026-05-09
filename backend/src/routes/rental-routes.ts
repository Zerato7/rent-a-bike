import express from "express";
import { validate } from "../middleware/validate.js";
import { startRentalRequest } from "../utils/validators/rental-validator.js";
import { endRental, getRentals, getUserActiveRental, getUserHistoryRentals, RentalIdParams, startRental } from "../controllers/rental-controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { uploadRentalPhoto, wrapUpload } from "../middleware/uploads.js";
import { UserIdParams } from "../controllers/user-controller.js";

const router = express.Router();

router.post("/", validate(startRentalRequest), asyncHandler(startRental));
router.put<RentalIdParams>("/return/:id", wrapUpload(uploadRentalPhoto), asyncHandler(endRental));
router.get<UserIdParams>("/user/:id/active", asyncHandler(getUserActiveRental));
router.get<UserIdParams>("/user/:id/history", asyncHandler(getUserHistoryRentals));
router.get("/", asyncHandler(getRentals));

export default router;
