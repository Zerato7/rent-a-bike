import { ErrorLoading } from "@/components/states/ErrorLoading";
import { Pending } from "@/components/states/Pending";
import { useTheme } from "@/hooks/useTheme";
import { Bicycle, BIKESTATUS, useGetBikes } from "@project/shared/index";
import { useRouter } from "expo-router";
import { Bike } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Checkbox } from "expo-checkbox";
import { SearchToolbar } from "@/components/tables/SearchToolbar";

export default function Bicycles() {
	const insets = useSafeAreaInsets();
	const { colors } = useTheme();
	const {
		data: bikes,
		isPending,
		error,
		isError,
	} = useGetBikes();
	const [locationSearch, setLocationSearch] = useState("");
	const [onlyAvailable, setOnlyAvailable] = useState(true);
	const router = useRouter();

	if (isPending) return <Pending />;

	if (isError) {
		return <ErrorLoading label="bikes" error={error} />;
	}

	const filteredBikes = bikes.filter((bike: Bicycle) => 
		(
			bike.status === BIKESTATUS.AVAILABLE 
			|| 
			!onlyAvailable && bike.status === BIKESTATUS.MAINTENANCE
		) &&
		bike.location.name?.toLowerCase().includes(locationSearch.toLowerCase())
	);

	const renderItem = ({ item }: { item: Bicycle }) => {
		const isAvailable = item.status === BIKESTATUS.AVAILABLE;
		return (
			<Pressable onPress={() => router.push({
				pathname: "/bike/[id]",
				params: { id: item._id }
			})}>
				<View
					className={`
						flex-row items-center justify-between
						bg-primary/80
						border-2 
						${isAvailable 
							? "border-success-light"
							: "border-warning/70"
						}
						rounded-2xl p-4 mb-3
					`}
				>
					<View className="flex-row gap-1">
						<Bike size={20} color={
								isAvailable 
									? colors.successLight()
									: colors.warning(70)
							} 
						/>
						<Text className={`
							${isAvailable 
								? "text-success-light"
								: "text-warning/70"
							}
							text-lg font-semibold
						`}>
							{item.displayId}
						</Text>
					</View>
					<Text className={`
						${isAvailable 
							? "text-success-light"
							: "text-warning/70"
						}
						text-lg font-semibold
					`}>
						{item.type}
					</Text>
				</View>
			</Pressable>
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
				<View className="flex-row items-center justify-center gap-1">
					<Checkbox 
						value={onlyAvailable}
						onValueChange={setOnlyAvailable}
						color={onlyAvailable ? colors.successLight() : undefined}
					/>
					<Text className="text-success-light font-semibold">
						Only Available
					</Text>
				</View>
			</View>
			<FlatList 
				data={filteredBikes}
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
						Hmm, seems there are no bikes...
					</Text>
				}
			/>
		</View>
	);
}
