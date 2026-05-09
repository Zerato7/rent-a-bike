import { Request, Response } from "express";
import User, { ROLES } from "../models/user.js";
import { ConflictError, InvalidCredentialsError, NotFoundError } from "../utils/errors.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { userResponse } from "../utils/validators/user-validators.js";

export const registerUser = async (req: Request, res: Response) => {
	const { username, password, firstName, lastName, phone, email } = req.body;

	if (await User.findOne({ username })) {
		throw new ConflictError("Username", username);
	}

	if (await User.findOne({ email })) {
		throw new ConflictError("Email", email);
	}

	const passwordHash = await bcrypt.hash(password, 10);
	const user = new User({
		username,
		passwordHash,
		firstName,
		lastName,
		phone,
		email,
		role: ROLES.USER
	});

	await user.save();
	res.status(StatusCodes.CREATED).json(userResponse.parse(user));
};

export const loginUser = async (req: Request, res: Response) => {
	req.params.id;
	const { username, password, role } = req.body;

	const user = await User.findOne({ username, role });
	if (!user) throw new InvalidCredentialsError();

	const valid = await bcrypt.compare(password, user.passwordHash);
	if (!valid) throw new InvalidCredentialsError();

	res.json(userResponse.parse(user));
};

export interface UserIdParams {
	id: string;
}

export const updateUser = async (req: Request<UserIdParams>, res: Response) => {
	const userId = req.params.id;

	const { email } = req.body;
	if (email) {
		const existing = await User.findOne({ email });
		if (existing && existing.id !== userId) throw new ConflictError("Email", email);
	}

	const updated = await User.findByIdAndUpdate(userId, req.body, { returnDocument: "after" });
	if (!updated) throw new NotFoundError("User", "id", userId);
	res.json(userResponse.parse(updated));
};

export const changePassword = async (req: Request<UserIdParams>, res: Response) => {
	const userId = req.params.id;

	const { oldPassword, newPassword } = req.body;

	const user = await User.findById(userId);
	if (!user) throw new NotFoundError("User", "id", userId);

	const valid = await bcrypt.compare(oldPassword, user.passwordHash);
	if (!valid) throw new InvalidCredentialsError("Incorrect old password");

	user.passwordHash = await bcrypt.hash(newPassword, 10);
	await user.save();

	res.json({ message: "Password successfully changed" });
};

export const getUser = async (req: Request<UserIdParams>, res: Response) => {
	const userId = req.params.id;

	const user = await User.findById(userId);
	if (!user) throw new NotFoundError("User", "id", userId);

	res.json(userResponse.parse(user));
};
