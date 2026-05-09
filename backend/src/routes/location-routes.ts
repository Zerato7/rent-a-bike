import express from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import { getLocations } from "../controllers/location-controller.js";

const router = express.Router();

router.get("/", asyncHandler(getLocations));

export default router;
