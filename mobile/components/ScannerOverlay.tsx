import { View, Text } from "react-native";

export function ScannerOverlay() {
	return (
		<View className="absolute inset-0 items-center justify-center">
			<Text
				className="
					text-white
					mt-6
					text-lg
					font-semibold
					p-6
					bg-black/30
					rounded-lg
				"
			>
				Scan bike QR code
			</Text>
		</View>
	);
}
