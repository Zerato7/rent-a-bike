import { randomUUID } from "crypto";
import mongoose, { Document, Schema } from "mongoose";

export const BIKETYPE = {
	MOUNTAIN: "Mountain",
	ROAD: "Road",
	ELECTRICAL: "Electrical",
	HYBRID: "Hybrid",
} as const;

export const BIKESTATUS = {
	AVAILABLE: "Available",
	MAINTENANCE: "Maintenance",
	IN_USE: "In Use",
	SUSPENDED: "Suspended",
} as const;

export interface IBicycle extends Document {
	location: mongoose.Types.ObjectId;
	type: (typeof BIKETYPE)[keyof typeof BIKETYPE];
	pricePerHour: number;
	status: (typeof BIKESTATUS)[keyof typeof BIKESTATUS];
	qrToken: string;
}

const bicycleSchema = new Schema<IBicycle>(
	{
		location: {
			type: Schema.Types.ObjectId,
			ref: "Location",
			required: true,
		},
		type: { type: String, enum: Object.values(BIKETYPE), required: true },
		pricePerHour: { type: Number, required: true },
		status: {
			type: String,
			enum: Object.values(BIKESTATUS),
			default: BIKESTATUS.AVAILABLE,
		},
		qrToken: {
			type: String,
			unique: true,
			default: () => randomUUID(),
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	},
);

bicycleSchema.virtual("displayId").get(function () {
	return `BK-${this._id.toString().slice(-4).toUpperCase()}`;
});

export default mongoose.model<IBicycle>("Bicycle", bicycleSchema);
