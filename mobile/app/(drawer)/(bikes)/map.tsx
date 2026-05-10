import { ErrorLoading } from "@/components/states/ErrorLoading";
import { Pending } from "@/components/states/Pending";
import {
	Bicycle,
	BIKESTATUS,
	Parking,
	useGetBikes,
	useGetParkingSpots,
} from "@project/shared/index";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";

export default function Map() {
	const {
		data: bikes,
		isPending: isBikesLoadingPending,
		error: bikesError,
		isError: isBikesLoadingError,
	} = useGetBikes();
	const {
		data: parkingSpots,
		isPending: isParkingSpotsLoadingPending,
		error: parkingSpotsError,
		isError: isParkingSpotsLoadingError,
	} = useGetParkingSpots();

	if (isBikesLoadingPending || isParkingSpotsLoadingPending) {
		return <Pending />;
	}

	if (isBikesLoadingError) {
		return <ErrorLoading label="bikes" error={bikesError} />;
	}

	if (isParkingSpotsLoadingError) {
		return <ErrorLoading label="parking spots" error={parkingSpotsError} />;
	}

	const filteredBikes = bikes.filter(
		(bike: Bicycle) => bike.status === BIKESTATUS.AVAILABLE,
	);

	return <MapContent bikes={filteredBikes} parkingSpots={parkingSpots} />;
}

interface MapContentProps {
	bikes: Bicycle[];
	parkingSpots: Parking[];
}

export function MapContent({ bikes, parkingSpots }: MapContentProps) {
	const router = useRouter();
	const bikesJson = JSON.stringify(bikes);
	const parkingJson = JSON.stringify(parkingSpots);
	const userLocation = [44.801541, 20.452455];
	const userLocationJson = JSON.stringify(userLocation);

	const html = `
		<!DOCTYPE html>
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
				<style>
					html, body, #map { height: 100%; margin: 0; }

					.marker-bike {
						width: 40px;
						height: 40px;
						border-radius: 50%;
						border: 2px solid rgb(29, 155, 80);
						background: rgba(22, 163, 74, 0.15);
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.marker-parking {
						width: 30px;
						height: 30px;
						border-radius: 7px;
						background: rgba(59, 130, 246, 0.5);
					}

					.marker-bike svg {
						width: 25px;
						height: 25px;
						color: rgb(29, 155, 80);
					}
					
					.marker-parking svg {
						display: block;
						padding: 0;
						margin: 0;
						width: 100%;
						height: 100%;
						color: rgb(54, 54, 183);
					}

					.marker-user {
						width: 34px;
						height: 34px;
					}
					
					.marker-user svg {
						display: block;
						padding: 0;
						margin: 0;
						width: 100%;
						height: 100%;
					}

					.parking-popup .leaflet-popup-content-wrapper {
						background-color: rgb(194, 194, 244);
						border: 2px solid rgb(54, 54, 183);
						color: rgb(54, 54, 183);
						font-weight: bold;
						font-size: 12px;
					}

					.parking-popup .leaflet-popup-close-button {
						display: none;
					}

					.user-popup .leaflet-popup-content-wrapper {
						background-color: rgb(241, 205, 176);
						border: 2px solid rgb(236, 120, 27);
						color: rgb(236, 120, 27);
						font-weight: bold;
						font-size: 12px;
					}
					
					.user-popup .leaflet-popup-close-button {
						display: none;
					}
				</style>
			</head>
			<body>

				<div id="map"></div>

				<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
				<script src="https://unpkg.com/lucide@latest"></script>
				<script>

					var map = L.map('map').setView(${userLocationJson}, 13);

					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						attribution: '© OpenStreetMap'
					}).addTo(map);

					var bikes = ${bikesJson};
					var parkingSpots = ${parkingJson};

					// Bikes
					var bikeIcon = L.divIcon({
						html: '<div class="marker-bike"><i data-lucide="bike"></i></div>',
						className: '',
						iconSize: [38, 38]
					});
					bikes.forEach(function(bike) {
						var marker = L.marker([
							bike.location.location.coordinates[1], 
							bike.location.location.coordinates[0]
						], {
							icon: bikeIcon,
						})
							.addTo(map);
						marker.on("click", function() {
							window.ReactNativeWebView.postMessage(
								JSON.stringify({
									type: "bike_click",
									id: bike._id
								})
							);
						});
					});

					// User Location
					var userIcon = L.divIcon({
						html: '<div class="marker-user"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f1cdb0" stroke="#ec781b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg></div>',
						className: '',
						iconSize: [38, 38]
					});
					L.marker(${userLocationJson}, {
						icon: userIcon,
					})
						.addTo(map)
						.bindPopup("<div>Yep, that's you</div>", {
							'className': 'user-popup'
						});

					// Parking spots
					var parkingIcon = L.divIcon({
						html: '<div class="marker-parking"><i data-lucide="square-parking"></i></div>',
						className: '',
						iconSize: [30, 30]
					});
					parkingSpots.forEach(function(parkingSpot) {
						var popupHtml = '<div>Parking spot: ' + parkingSpot.name + '</div>';

						L.marker([
							parkingSpot.location.coordinates[1], 
							parkingSpot.location.coordinates[0]
						], {
							icon: parkingIcon,
						})
							.addTo(map)
							.bindPopup(popupHtml, {
								'className': 'parking-popup'
							});
					});

					lucide.createIcons();
				</script>

			</body>
		</html>
	`;

	function handleMessage(event: any) {
		const data = JSON.parse(event.nativeEvent.data);

		if (data.type === "bike_click") {
			router.push({
				pathname: "/bike/[id]",
				params: { id: data.id },
			});
		}
	}

	return <WebView originWhitelist={["*"]} source={{ html }}
		onMessage={handleMessage}
	/>;
}
