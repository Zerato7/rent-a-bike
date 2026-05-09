import mongoose, { Document, Schema } from "mongoose";

export const ISSUESTATUS = {
	UNRESOLVED: "Unresolved",
	IGNORE: "Ignore",
	REPAIR: "Repair",
	SUSPEND: "Suspend",
} as const;

export const RESOLVED = Object.values(ISSUESTATUS).filter(
	(issue) => issue !== ISSUESTATUS.UNRESOLVED,
) as [string, ...string[]];

export interface IIssue extends Document {
	userId: mongoose.Types.ObjectId;
	bikeId: mongoose.Types.ObjectId;
	description: string;
	photo: string;
	status: (typeof ISSUESTATUS)[keyof typeof ISSUESTATUS];
}

const issueSchema = new Schema<IIssue>(
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
		description: { type: String, required: true },
		photo: { type: String, required: true },
		status: {
			type: String,
			enum: Object.values(ISSUESTATUS),
			default: ISSUESTATUS.UNRESOLVED,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	},
);

issueSchema.virtual("displayId").get(function() {
	return `ReIss-${this._id.toString().slice(-4).toUpperCase()}`;
});

export default mongoose.model<IIssue>("Issue", issueSchema);
