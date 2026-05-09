import { IPoint } from "./submodels/location";

export interface Parking {
	_id: string;
    location: IPoint;
    name: string;
}

export interface ParkingDistance extends Parking {
	distance: number;
}

export const formatDistance = (meters: number) => {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
};
