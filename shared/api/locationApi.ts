import { type Location } from "../models/submodels/location";
import { request } from "./client";

const prefixPath = "/locations";

export async function getLocations() {
	return request<Location[]>(`${prefixPath}`);
}
