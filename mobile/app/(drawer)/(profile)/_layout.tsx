import { useTheme } from "@/hooks/useTheme";
import { Tabs } from "expo-router";
import { User, UserKey } from "lucide-react-native";

export default function ProfileLayout() {
	const { colors } = useTheme();

	return (
		<Tabs 
			screenOptions={{
				headerShown: false,
				sceneStyle: {
					backgroundColor: "transparent"
				},
				tabBarStyle: {
					backgroundColor: colors.primaryMedium(),
					paddingTop: 7,
					height: 120,
				},
			}}
		>
			<Tabs.Screen 
				name="personal-info"
				options={{
					title: "Personal Info",
					tabBarIcon: ({ focused }) => (
						<User 
							size={24} 
							color={focused ? colors.success() : colors.success(50)}
						/>
					),
					tabBarActiveTintColor: colors.success(),
					tabBarInactiveTintColor: colors.accent(50),
				}}
			/>
			<Tabs.Screen 
				name="change-password"
				options={{
					title: "Change Password",
					tabBarIcon: ({ focused }) => (
						<UserKey 
							size={24}
							color={focused ? colors.accent() : colors.accent(50)}
						/>
					),
					tabBarActiveTintColor: colors.accent(),
					tabBarInactiveTintColor: colors.success(50),
				}}
			/>
		</Tabs>
	);
}