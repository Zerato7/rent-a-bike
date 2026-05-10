import { useTheme } from "@/hooks/useTheme";
import { ActivityIndicator, View } from "react-native";

export function Pending() {
	const { colors } = useTheme();

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
			}}
		>
			<ActivityIndicator size="large" color={colors.success()} />
		</View>
	);
}
