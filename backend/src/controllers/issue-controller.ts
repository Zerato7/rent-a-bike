import { Request, Response } from "express";
import Issue, { ISSUESTATUS, RESOLVED } from "../models/issue.js";
import {
	BikeStatusError,
	IssueStatusError,
	NotFoundError,
} from "../utils/errors.js";
import { StatusCodes } from "http-status-codes";
import Bicycle from "../models/bicycle.js";
import {
	canConvert,
	fromIssueStatusToBikeStatus,
} from "../utils/bike-status.js";
import User from "../models/user.js";

export const reportIssue = async (req: Request, res: Response) => {
	const relativePath = "/uploads/issues/" + req.file?.filename;

	const { userId, bikeId, description } = req.body;

	const user = await User.findById(userId);
	if (!user) throw new NotFoundError("User", "id", userId);

	const bike = await Bicycle.findById(bikeId);
	if (!bike) throw new NotFoundError("Bicycle", "id", bikeId);

	const issue = new Issue({
		userId,
		bikeId,
		description,
		photo: relativePath,
		status: ISSUESTATUS.UNRESOLVED,
	});

	await issue.save();
	const savedIssue = await issue.populate([
		{
			path: "bikeId",
			populate: "location",
		},
		{
			path: "userId",
			select: "username",
		},
	]);
	res.status(StatusCodes.CREATED).json(savedIssue);
};

export interface IssueIdParams {
	id: string;
}

export const resolveIssue = async (
	req: Request<IssueIdParams>,
	res: Response,
) => {
	const issueId = req.params.id;

	const { status } = req.body;

	const issue = await Issue.findById(issueId);
	if (!issue) throw new NotFoundError("Reported issue", "id", issueId);

	if (issue.status !== ISSUESTATUS.UNRESOLVED)
		throw new IssueStatusError(
			`Reported issue with id: ${issueId} does not have status 'UNRESOLVED'`,
		);

	const bike = await Bicycle.findById(issue.bikeId);
	if (!bike)
		throw new NotFoundError(
			`Reported issue's bike (issueId: ${issueId}) bike`,
			"id",
			issue.bikeId.toString(),
		);

	let newBikeStatus = fromIssueStatusToBikeStatus(status);
	if (newBikeStatus && !canConvert(bike!.status, newBikeStatus)) {
		throw new BikeStatusError(bike!.status, newBikeStatus);
	}

	issue.status = status;
	await issue.save();

	if (newBikeStatus) {
		bike.status = newBikeStatus;
		await bike.save();
	}

	const savedIssue = await issue.populate([
		{
			path: "bikeId",
			populate: "location",
		},
		{
			path: "userId",
			select: "username",
		},
	]);
	res.json(savedIssue);
};

export const getUnresolvedIssues = async (req: Request, res: Response) => {
	const issues = await Issue.find({ status: ISSUESTATUS.UNRESOLVED })
		.populate({
			path: "bikeId",
			populate: "location"
		})
		.populate("userId", "username")
		.sort("bikeId -createdAt");
	res.json(issues);
};

export const getResolvedIssues = async (req: Request, res: Response) => {
	const issues = await Issue.find({ status: { $in: RESOLVED } })
		.populate({
			path: "bikeId",
			populate: "location"
		})
		.populate("userId", "username")
		.sort("-createdAt");
	res.json(issues);
};
