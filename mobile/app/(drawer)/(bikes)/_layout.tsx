import { useTheme } from "@/hooks/useTheme";
import { Tabs } from "expo-router";
import { Bike, MapPinned, ParkingSquare } from "lucide-react-native";

export default function BikesLayout() {
	const { colors } = useTheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				sceneStyle: {
					backgroundColor: "transparent",
				},
				tabBarStyle: {
					backgroundColor: colors.primaryMedium(),
					paddingTop: 7,
					height: 120,
				},
				tabBarActiveTintColor: colors.successLight(),
				tabBarInactiveTintColor: colors.successLight(50),
			}}
		>
			<Tabs.Screen
				name="map"
				options={{
					title: "Map",
					tabBarIcon: ({ focused }) => (
						<MapPinned
							size={24}
							color={
								focused ? colors.successLight() : colors.successLight(50)
							}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="bicycles"
				options={{
					title: "List of Bikes",
					tabBarIcon: ({ focused }) => (
						<Bike
							size={24}
							color={
								focused ? colors.successLight() : colors.successLight(50)
							}
						/>
					),
				}}
			/>
			<Tabs.Screen 
				name="parking-spots"
				options={{
					title: "List of Parking Spots",
					tabBarIcon: ({ focused }) => (
						<ParkingSquare 
							size={24}
							color={
								focused ? colors.successLight() : colors.successLight(50)
							}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
