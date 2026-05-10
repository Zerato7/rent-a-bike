import { Drawer } from "expo-router/drawer";
import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from "@react-navigation/drawer";
import { Router, useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { Button, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function logout(router: Router) {
	await AsyncStorage.removeItem("loggedIn");
	router.replace("/login");
}

function CustomDrawerContent(props: any) {
	const { colors, toggleColorScheme } = useTheme();
	const router = useRouter();

	 const { state } = props;

	return (
		<DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<DrawerItemList {...props} />
			</View>

			<View
				style={{
					paddingBottom: 10,
					marginTop: "auto"
				}}
			>
				{/* <Button 
					title="Promeni temu" 
					onPress={toggleColorScheme} 
				/> */}
				<DrawerItem 
					label="Profile"
					focused={state.routeNames[state.index] === "(profile)"}
					onPress={() => router.push("/personal-info")}
					activeTintColor={colors.warning()}
					inactiveTintColor={colors.warning(50)}
					activeBackgroundColor={colors.primaryHeavy(50)}
					labelStyle={{
						fontWeight: "bold",
					}}
				/>
				<DrawerItem
					label="Logout"
					onPress={() => logout(router)}
					labelStyle={{ color: colors.danger(80) }}
				/>
			</View>
		</DrawerContentScrollView>
	);
}

export default function DrawerLayout() {
	const { colors } = useTheme();
	return (
		<Drawer
			screenOptions={{
				sceneStyle: {
					backgroundColor: "transparent",
				},
				headerStyle: {
					backgroundColor: colors.primary(),
				},
				headerTintColor: colors.successLight(),
				headerTitleStyle: {
					fontWeight: "bold",
				},
				drawerStyle: {
					backgroundColor: colors.primaryMedium(),
				},
				drawerInactiveTintColor: colors.successLight(50),
				drawerActiveTintColor: colors.successLight(),
				drawerActiveBackgroundColor: colors.primaryHeavy(20),
				drawerLabelStyle: {
					fontWeight: "bold",
				}
			}}
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			<Drawer.Screen 
				name="index" 
				options={{ 
					drawerItemStyle: { display: "none" },
					title: "Home",
				}} 
			/>
			<Drawer.Screen name="(bikes)" options={{ title: "Bike Overview" }} />
			<Drawer.Screen
				name="rent-bike"
				options={{ title: "Rent Bike" }}
			/>
			<Drawer.Screen
				name="rent-history"
				options={{ title: "Rent History" }}
			/>
			<Drawer.Screen 
				name="(profile)"
				options={{
					drawerItemStyle: {
						marginTop: "auto",
						display: "none",
					},
					title: "Profile",
					headerTintColor: colors.warning()
				}}
			/>
			<Drawer.Screen 
				name="bike/[id]"
				options={{
					drawerItemStyle: { display: "none" },
					title: "Bicycle Info",
				}}
			/>
			<Drawer.Screen
				name="report-issue/[id]"
				options={{
					drawerItemStyle: { display: "none" },
					title: "Report Issue",
				}}
			/>
			<Drawer.Screen
				name="return-bike/[id]"
				options={{
					drawerItemStyle: { display: "none" },
					title: "Return Bike",
				}}
			/>
		</Drawer>
	);
}
