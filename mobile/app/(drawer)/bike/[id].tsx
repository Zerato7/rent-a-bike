import { historyPathRef } from "@/app/_layout";
import { BikeStatusBadge } from "@/components/badges/BikeStatusBadge";
import { DisplayInput } from "@/components/forms/DisplayInput";
import { ErrorLoading } from "@/components/states/ErrorLoading";
import { Pending } from "@/components/states/Pending";
import { useTheme } from "@/hooks/useTheme";
import { Bicycle, bikeStatusVariant, formatDistance, formatLocation, ParkingDistance, useGetBike, useGetNearbyParkingSpots } from "@project/shared/index";
import { router, useLocalSearchParams } from "expo-router";
import { CircleAlert, X } from "lucide-react-native";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export default function BikeDetails() {
	const { id } = useLocalSearchParams();
	const idString = Array.isArray(id) ? id[0] : id;
	const { data: bike, isPending, error, isError } = useGetBike(idString);

	if (isPending) return <Pending />

	if (isError) return <ErrorLoading label="bike" error={error} />;

	return <BikeDetailsContent bike={bike} />;
}

interface BikeDetailsContentProps {
	bike: Bicycle;
}

export function BikeDetailsContent({
	bike,
}: BikeDetailsContentProps) {
	const { colors } = useTheme();
	const {
		data: nearbyParkingSpots,
		isPending,
		error,
		isError,
	} = useGetNearbyParkingSpots(
		bike.location.location.coordinates[0],
		bike.location.location.coordinates[1],
	);

	if (isPending) return <Pending />;

	if (isError) return <ErrorLoading label="parking spots" error={error} />;

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
				<View className="flex-row">
					<View className="w-1/2 items-center justify-center">
						<DisplayInput 
							label="Display ID"
							value={bike.displayId}
							inputColor="text-success-light"
						/>
					</View>
					<View className="w-1/2 items-end justify-start">
						<Pressable 
							onPress={() => {
									console.log(historyPathRef.current);
									router.push(historyPathRef.current as any);
								}
							}
							className="pl-2 pb-2"
						>
							<X 
								size={20}
								color={colors.success()}
							/>
						</Pressable>
					</View>
				</View>
				<DisplayInput 
					label="Location"
					value={formatLocation(bike)}
					inputColor="text-success-light"
				/>
				<View className="flex-row">
					<View className="w-1/2 items-center justify-center">
						<DisplayInput 
							label="Type"
							value={bike.type}
							inputColor="text-success-light"
						/>
					</View>
					<View className="w-1/2 items-center justify-center">
						<DisplayInput 
							label="Price per Hour"
							value={`${bike.pricePerHour} RSD`}
							inputColor="text-success-light"
						/>
					</View>
				</View>
				<View className="w-full items-start">
					<BikeStatusBadge 
						label={bike.status} 
						variant={bikeStatusVariant(bike.status)} 
					/>
				</View>
				<View className="w-full mt-6">
					<Text className="text-success font-semibold mb-2">
						Nearest Parking Spots:
					</Text>
					
					{nearbyParkingSpots?.map((parking: ParkingDistance) => (
						<View 
							key={parking._id} 
							className="
								flex-row flex-wrap items-center justify-between 
								bg-white/10 
								p-3 mb-2
								rounded-lg border border-primary"
						>
							<View className="items-center justify-center">
								<Text className="text-success-medium/70 font-semibold">
									{parking.name}
								</Text>
							</View>
							<View className="items-end justify-center ml-auto">
								<Text className="text-success-light font-semibold">
									{formatDistance(parking.distance)}
								</Text>
							</View>
						</View>
					))}
				</View>
				<TouchableOpacity
					onPress={() => router.push({
						pathname: "/report-issue/[id]",
						params: { id: bike._id },
					})}
					className={`
						w-full py-3 
						flex-row gap-1
						items-center justify-center 
						rounded-lg 
						mt-8
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
}
