import { DisplayInput } from "@/components/forms/DisplayInput";
import { ErrorLoading } from "@/components/states/ErrorLoading";
import { Pending } from "@/components/states/Pending";
import { useAuthUser } from "@/hooks/useAuthUser";
import { ErrorResponse, getCurrentPrice, RentalLiteDetail, useGetUserActiveRental, useStartRental } from "@project/shared/index";
import { useRouter } from "expo-router";
import { CircleAlert } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import Toast from "react-native-toast-message";
import { ScannerOverlay } from "@/components/ScannerOverlay";

function formatDuration(rental: RentalLiteDetail, now: Date) {
	const duration = now.getTime() - new Date(rental.startTime).getTime();
	const hours = Math.floor(duration / (1000 * 60 * 60));
	const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((duration % (1000 * 60)) / 1000);

	return `${hours}h ${minutes}min ${seconds}s`;
}

export default function RentBike() {
	const { userId, isLoading } = useAuthUser();
	
	if (isLoading) {
		return <Pending />;
	}

	if (!userId) return <Text className="text-danger">User not found</Text>;

	return <RentBikeContent userId={userId} />;
}

export function RentBikeContent({ userId }: { userId: string}) {
	const {
		data: rental,
		isPending: isRentalPending,
		error,
		isError,
	} = useGetUserActiveRental(userId);
	const [nowDate, setNowDate] = useState(new Date());
	const router = useRouter();
	const { mutate: startRental, isPending: isStartRentalPending } = useStartRental();
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);


	useEffect(() => {
		const interval = setInterval(() => setNowDate(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	function handleScan(result: BarcodeScanningResult) {
		console.log("Qr code", result);
		if (scanned) return;

		setScanned(true);

		console.log("Scanned passed");
		const data = result.data.trim();
		if (data.startsWith("bike:")) {
			const token = data.split(":")[1];
			startRental(
				{
					userId,
					bikeQrToken: token,
				}, 
				{
					onSuccess: async () => {
						Toast.show({
							type: "success",
							text1: "Successfully started rental!",
							position: "bottom",
							visibilityTime: 3000,
						});
					},
					onError: (err: ErrorResponse) => {
						console.log(err);
						setScanned(false);
						Toast.show({
							type: "error",
							text1: `Error happened. ${err.error}`,
							position: "bottom",
							visibilityTime: 3000,
						});
					}
				}
			);
		} else {
			setScanned(false);
			Toast.show({
				type: "error",
				text1: "Qr code is not valid!",
				position: "bottom",
				visibilityTime: 3000,
			});
		}
	}

	if (isRentalPending || isStartRentalPending) return <Pending />;

	if (isError) return <ErrorLoading label="active rental" error={error} />;

	if (rental) {
		return (
			<View className="flex-1 items-center pt-10 pb-20">
				<View className={`
					items-center
					w-[85%]
					text-primary
					bg-blackish
					border-4 border-primary-medium rounded-2xl
					px-6 py-8
				`}>
					<DisplayInput 
						label="Bike"
						value={rental.bikeId.displayId}
						inputColor="text-success-light"
					/>
					<View className="flex-row">
						<View className="w-1/2 items-center justify-center">
							<DisplayInput 
								label="Price per Hour"
								value={`${rental.bikeId.pricePerHour} RSD`}
								inputColor="text-success-light"
							/>
						</View>
						<View className="w-1/2 items-center justify-center">
							<DisplayInput 
								label="Current Price"
								value={`${getCurrentPrice(rental)} RSD`}
								inputColor="text-success-light"
							/>
						</View>
					</View>
					<View className="w-full items-start">
						<DisplayInput 
							label="Duration"
							value={formatDuration(rental, nowDate)}
							inputColor="text-success-light"
						/>
					</View>
					<TouchableOpacity
						onPress={() => router.push({
							pathname: "/return-bike/[id]",
							params: { id: rental._id }
						})}
						className={`
							w-full py-3 
							flex-row gap-1
							items-center justify-center 
							rounded-lg 
							mt-8
							bg-success-light border-2 border-white
						`}
					>
						<Text className={`
							font-bold text-white
						`}>
							Return Bike
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => router.push({
							pathname: "/report-issue/[id]",
							params: { id: rental.bikeId._id },
						})}
						className={`
							w-full py-3 
							flex-row gap-1
							items-center justify-center 
							rounded-lg 
							mt-4
							bg-danger-light border-2 border-white
						`}
					>
						<CircleAlert 
							size={20}
							color="white"
						/>
						<Text className={`
							font-bold text-white
						`}>
							Report Issue
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	} else {
		if (!permission) {
			return <View></View>
		}

		if (!permission.granted) {
			return (
				<View className="flex-1 items-center justify-center">
					<Text className="text-primary font-bold mb-4">
						Camera permission required
					</Text>
					<TouchableOpacity
						onPress={requestPermission}
						className="px-6 py-3 bg-primary-medium rounded-lg"
					>
						<Text className="text-white font-bold">
							Grant Permission
						</Text>
					</TouchableOpacity>
				</View>
			);
		}

		return (
			<View className="flex-1">
				<CameraView
					style={{ flex: 1 }}
					barcodeScannerSettings={{
						barcodeTypes: ["qr"],
					}}
					onBarcodeScanned={(result) => {
						if (!scanned) handleScan(result);
					}}
				/>

				<ScannerOverlay />
			</View>
		);
	}
}
