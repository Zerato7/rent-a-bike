import { ErrorLoading } from "@/components/states/ErrorLoading";
import { Pending } from "@/components/states/Pending";
import { SearchToolbar } from "@/components/tables/SearchToolbar";
import { useTheme } from "@/hooks/useTheme";
import { Parking, useGetParkingSpots } from "@project/shared/index";
import { ParkingSquare } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ParkingSlots() {
	const insets = useSafeAreaInsets();
	const { colors } = useTheme();
	const {
		data: parkingSlots,
		isPending,
		error,
		isError,
	} = useGetParkingSpots();
	const [locationSearch, setLocationSearch] = useState("");

	if (isPending) return <Pending />;

	if (isError) {
		return <ErrorLoading label="parking slots" error={error} />;
	}

	const filteredParkingSlots = parkingSlots.filter((parkingSlot: Parking) => 
		parkingSlot.name.toLowerCase().includes(locationSearch.toLowerCase())
	);

	const renderItem = ({ item }: { item: Parking }) => {
		return (
			<View
				className={`
					flex-row items-center justify-between
					bg-primary/80
					border-2 
					border-success-light
					rounded-2xl p-4 mb-3
				`}
			>
				<ParkingSquare size={20} color={colors.successLight()} />
				<Text className={`
					text-success-light
					text-lg font-semibold
				`}>
					{item.name}
				</Text>
			</View>
		);
	}

	return (
		<View style={{
			paddingBottom: insets.bottom,
		}}>
			<View className="
					items-start justify-between gap-2
					mt-4
					bg-primary/80
					border-2 border-success-light
					rounded-2xl
					px-4 py-3
				"
				style={{
					marginHorizontal: 20,
				}}
			>
				<SearchToolbar 
					search={locationSearch}
					setSearch={setLocationSearch}
				/>
			</View>
			<FlatList 
				data={filteredParkingSlots}
				keyExtractor={(item) => item._id}
				renderItem={renderItem}
				contentContainerStyle={{
					paddingTop: 10,
					paddingBottom: 100,
					paddingHorizontal: 20,
				}}
				ListEmptyComponent={
					<Text className="
							text-center text-primary-heavy text-xl font-semibold 
							mt-10
						"
					>
						Hmm, seems there are no parking slots...
					</Text>
				}
			/>
		</View>
	);
}
