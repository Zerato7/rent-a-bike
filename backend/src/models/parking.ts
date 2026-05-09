import mongoose, { Document, Schema } from "mongoose";
import { IPoint, pointSchema } from "./submodels/location.js";

export interface IParking extends Document {
	location: IPoint;
	name: string;
}

const parkingSchema = new Schema({
	location: {
		type: pointSchema,
		index: "2dsphere",
		required: true,
	},
	name: { type: String, required: true }
});

export default mongoose.model<IParking>("Parking", parkingSchema);
