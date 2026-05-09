import mongoose, { Document, Schema } from "mongoose";

export const ROLES = {
	USER: "user",
	ADMIN: "admin",
} as const;

export interface IUser extends Document {
	username: string;
	passwordHash: string;
	firstName: string;
	lastName: string;
	phone?: string;
	email: string;
	role: (typeof ROLES)[keyof typeof ROLES];
}

const userSchema = new Schema<IUser>(
	{
		username: { type: String, required: true, unique: true },
		passwordHash: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phone: { type: String },
		email: { type: String, required: true, unique: true },
		role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IUser>("User", userSchema);
