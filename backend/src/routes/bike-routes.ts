import express from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import { BikeIdParams, getBike, getBikes, registerBike, updateAllBikes, updateBike } from "../controllers/bike-controller.js";
import { validate } from "../middleware/validate.js";
import { registerBikeRequest, updateBikeRequest } from "../utils/validators/bike-validators.js";

const router = express.Router();

router.post("/", validate(registerBikeRequest), asyncHandler(registerBike));
router.put("/all", asyncHandler(updateAllBikes));
router.put<BikeIdParams>("/:id", validate(updateBikeRequest), asyncHandler(updateBike));
router.get("/", asyncHandler(getBikes));
router.get<BikeIdParams>("/:id", asyncHandler(getBike));

export default router;
