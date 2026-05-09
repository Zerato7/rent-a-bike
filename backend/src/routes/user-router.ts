import express from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import { changePassword, getUser, loginUser, registerUser, updateUser, UserIdParams } from "../controllers/user-controller.js";
import { validate } from "../middleware/validate.js";
import { loginRequest, passwordChangeRequest, registerUserRequest, updateUserRequest } from "../utils/validators/user-validators.js";

const router = express.Router();

router.post("/register", validate(registerUserRequest), asyncHandler(registerUser));
router.post("/login", validate(loginRequest), asyncHandler(loginUser));
router.put<UserIdParams>("/:id", validate(updateUserRequest), asyncHandler(updateUser));
router.put<UserIdParams>("/password/:id", validate(passwordChangeRequest), asyncHandler(changePassword));
router.get<UserIdParams>("/:id", asyncHandler(getUser));

export default router;
