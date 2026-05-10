import { Slot, usePathname } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { darkTheme, lightTheme } from "@/constants/themes";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Pending } from "@/components/states/Pending";
import Toast, { SuccessToast } from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import { setAppConfig } from "@project/shared/index";
const backgroundTexture = require("@/assets/background-texture.svg");

setAppConfig({
	apiUrl: process.env.EXPO_PUBLIC_API_URL!,
});

const queryClient = new QueryClient();

export const historyPathRef = { 
	current: "/",
	prev: "/",
};

export default function RootLayout() {
	const insets = useSafeAreaInsets();
	const isCheckDone = useAuthGuard();
	const { colors, isDark } = useTheme();
	const theme = isDark ? darkTheme : lightTheme;
	
	const pathname = usePathname();
	
	const toastConfig = {
		success: (props: any) => (
			<SuccessToast 
				{...props}
				style={{
					backgroundColor: colors.success(),
					borderLeftColor: colors.successLight(),
					borderColor: colors.successLight(),
					borderWidth: 2,
					borderRadius: 5,
					marginBottom: insets.bottom,
				}}
				text1Style={{
					color: colors.successLight(),
				}}

			/>
		)
	};

	useEffect(() => {
		return () => {
			if (!pathname.includes("report-issue")) {
				historyPathRef.prev = historyPathRef.current;
				historyPathRef.current = pathname;
			} else {
				historyPathRef.current = historyPathRef.prev;
			}
		};
	}, [pathname]);

	return (
		<QueryClientProvider client={queryClient}>
			<View style={[theme, { flex: 1 }]} key={isDark ? "dark" : "light"}>
				<View style={StyleSheet.absoluteFill}>
					<Image
						source={backgroundTexture}
						style={{ height: "100%", width: "100%" }}
						contentFit="cover"
						priority="high"
					/>
				</View>
				<View
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: colors.primary(50),
							pointerEvents: "none",
						},
					]}
				></View>
				<View
					style={{
						flex: 1,
						backgroundColor: "transparent",
					}}
				>
					{isCheckDone ? (
						<>
							<Slot />
							<Toast config={toastConfig} />
						</>
					) : (
						<Pending />
					)}
				</View>
			</View>
		</QueryClientProvider>
	);
}
