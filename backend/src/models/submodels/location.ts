import mongoose, { Schema } from "mongoose";

export interface IPoint {
	type: "Point";
	coordinates: number[];
}

export const pointSchema = new Schema<IPoint>({
	type: {
		type: String,
		enum: ["Point"],
		required: true,
	},
	coordinates: {
		type: [Number],
		required: true,
	},
});

export interface ILocation {
	location: IPoint;
	name: string;
}

const locationSchema = new Schema({
	location: {
		type: pointSchema,
		index: "2dsphere",
		required: true,
	},
	name: { type: String, required: true },
});

export default mongoose.model<ILocation>("Location", locationSchema);
