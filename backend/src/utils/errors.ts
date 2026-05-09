import { StatusCodes } from "http-status-codes";

export class CustomError extends Error {
	statusCode: number;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class InvalidCredentialsError extends CustomError {
	constructor(message = "Invalid credentials") {
		super(message, StatusCodes.UNAUTHORIZED);
	}
}

export class ConflictError extends CustomError {
	constructor(subject: string, value: string) {
		super(`${subject}: '${value}' already exists`, StatusCodes.CONFLICT);
	}
}

export class NotFoundError extends CustomError {
	constructor(subject: string, identifier: string, value: string | number) {
		super(`${subject} with ${identifier}: '${value}' not found`, StatusCodes.NOT_FOUND);
	}
}

export class UploadError extends CustomError {
	constructor(message: string) {
		super(message, StatusCodes.BAD_REQUEST);
	}
}

export class BikeStatusError extends CustomError {
	constructor(fromBikeStatus: string, toBikeStatus: string) {
		super(
			`Bikes with status: '${fromBikeStatus}' cannot be changed to status: '${toBikeStatus}'`,
			StatusCodes.CONFLICT,
		);
	}
}

export class IssueStatusError extends CustomError {
	constructor(message: string) {
		super(message, StatusCodes.BAD_REQUEST);
	}
}

export class RentalAlreadyEndedError extends CustomError {
	constructor() {
		super("Rental already ended", StatusCodes.BAD_REQUEST);
	}
}

export class UserAlreadyHasActiveRentalError extends CustomError {
	constructor(username: string) {
		super(`User with username: ${username} already has an active rental`, StatusCodes.BAD_REQUEST);
	}
}

export class MissingInputDataError extends CustomError {
	constructor(message: string) {
		super(message, StatusCodes.BAD_REQUEST);
	}
}

export class NotAtParkingError extends CustomError {
	constructor() {
		super("User is not near a parking spot and as such cannot return bike", StatusCodes.BAD_REQUEST);
	}
}
