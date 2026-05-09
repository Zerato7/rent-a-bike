export interface ErrorResponse {
	status: number;
	statusText: string;
	error: string;
	formErrors: string[];
	fieldErrors: { [key: string]: string[] };
}
