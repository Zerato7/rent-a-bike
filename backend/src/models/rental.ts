import mongoose, { Document, Schema } from "mongoose";

export interface IRental extends Document {
	userId: mongoose.Types.ObjectId;
	bikeId: mongoose.Types.ObjectId;
	startTime: Date;
	endTime?: Date;
	price?: number;
	photo?: string;
}

const rentalSchema = new Schema<IRental>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		bikeId: {
			type: Schema.Types.ObjectId,
			ref: "Bicycle",
			required: true,
		},
		startTime: { type: Date, required: true },
		endTime: { type: Date },
		price: { type: Number },
		photo: { type: String },
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IRental>("Rental", rentalSchema);
