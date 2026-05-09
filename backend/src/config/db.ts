import mongoose from "mongoose";

export const connectDB = async () => {
	const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/rent-a-bike";
	try {
		await mongoose.connect(DB_URL);
		console.log("MongoDB connected");
	} catch (err: any) {
		console.error(err.message);
		process.exit(1);
	}
};
