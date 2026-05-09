export interface IPoint {
	type: "Point";
	coordinates: [number, number];
}

export interface Location {
	_id: string;
	location: IPoint;
	name: string;
}
