import express from "express";
import { getNearbyParkingSpots, getParkingSpots } from "../controllers/parking-controller.js";
import { asyncHandler } from "../middleware/async-handler.js";

const router = express.Router();

router.get("/", asyncHandler(getParkingSpots));
router.get("/nearby", asyncHandler(getNearbyParkingSpots));

export default router;
