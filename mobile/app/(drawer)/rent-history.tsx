import { ErrorLoading } from "@/components/states/ErrorLoading";
import { Pending } from "@/components/states/Pending";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useTheme } from "@/hooks/useTheme";
import {
	getDurationLite,
	RentalLiteDetail,
	useGetUserHistoryRentals,
} from "@project/shared/index";
import { useRouter } from "expo-router";
import { Bike, Clock, Coins, Search } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RentHistory() {
	const { userId, isLoading } = useAuthUser();

	if (isLoading) {
		return <Pending />;
	}

	if (!userId) return <Text className="text-danger">User not found</Text>;

	return <RentalHistoryContent userId={userId} />;
}

function RentalHistoryContent({ userId }: { userId: string }) {
	const insets = useSafeAreaInsets();
	const { colors } = useTheme();
	const {
		data: oldRentals,
		isPending,
		error,
		isError,
	} = useGetUserHistoryRentals(userId);
	const [bikeSearch, setBikeSearch] = useState("");
	const router = useRouter();

	if (isPending) return <Pending />;

	if (isError) {
		return <ErrorLoading label="user" error={error} />;
	}

	const filteredOldRentals = oldRentals.filter((rental: RentalLiteDetail) => 
		rental.bikeId.displayId.slice(-4).toUpperCase().includes(bikeSearch.toUpperCase())
	);

	const renderItem = ({ item }: { item: RentalLiteDetail }) => (
		<Pressable onPress={() => router.push({
			pathname: "/bike/[id]",
			params: { id: item.bikeId._id }
		})}>
			<View
				className="
					flex-row items-center justify-between
					bg-primary/80
					border-2 border-success-light
					rounded-2xl p-4 mb-3
				"
			>
				<View className="items-start justify-center gap-2">
					<View className="flex-row gap-1">
						<Bike size={20} color={colors.successMedium()} />
						<Text className="text-success-medium text-lg font-semibold">
							{item.bikeId.displayId}
						</Text>
					</View>
					<Text className="text-primary-heavy text-sm font-medium">
						{new Date(item.startTime).toLocaleString()}
					</Text>
				</View>
				<View className="items-end justify-center gap-2">
					<View className="flex-row gap-1">
						<Coins size={20} color={colors.warning()} />
						<Text className="text-warning text-lg font-semibold">
							{item.price} RSD
						</Text>
					</View>
					<View className="flex-row gap-1">
						<Clock size={20} color={colors.primaryHeavy(100)} />
						<Text className="text-primary-heavy text-sm font-medium">
							{getDurationLite(item)}
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);

	return (
		<View style={{
			paddingBottom: insets.bottom,
		}}>
			<View className="
					flex-row items-center justify-start gap-1 
					mt-4
					bg-primary/80
					border-2 border-success-light
					rounded-2xl
					px-4 py-2
				"
				style={{
					marginHorizontal: 20,
				}}
			>
				<Search size={20} color={colors.successLight()} />
				<Text className="text-primary-heavy font-medium">Search bike: </Text>
				<Text className="text-success-light font-semibold">BK-</Text>
				<TextInput 
					value={bikeSearch}
					onChangeText={(text) => setBikeSearch(text)}
					className="
						min-w-[48px]
						text-success-light bg-primary-heavy/30 
						font-semibold
						border-2 border-success-light
						rounded-lg
					"
				/>
			</View>
			<FlatList 
				data={filteredOldRentals}
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
						Got no history of renting bikes...
					</Text>
				}
			/>
		</View>
	);
}	
