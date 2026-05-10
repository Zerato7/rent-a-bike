import { Text, TextInput, View } from "react-native";

interface DisplayInputProps {
	label: string;
	value: string;
	inputColor?: string;
}

export function DisplayInput({
	label,
	value,
	inputColor = "text-success-medium",
}: DisplayInputProps) {
	return (
		<View className="w-full mb-4">
			<Text className="text-success font-semibold mb-1">
				{label}
			</Text>

			<TextInput
				className={`
					font-semibold
					bg-transparent
					px-2 py-2
					rounded-lg
					${inputColor}
					border-2 border-transparent
				`}
				value={value}
				editable={false}
			/>
		</View>
	);
}
