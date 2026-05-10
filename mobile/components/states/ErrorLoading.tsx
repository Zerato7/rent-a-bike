import type { ErrorResponse } from "@project/shared/index";
import { Text, View } from "react-native";

interface ErrorLoadingProps {
	label: string;
	error: ErrorResponse;
}

export function ErrorLoading({ label, error }: ErrorLoadingProps) {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text
				className="
					p-2 rounded-lg border-2 border-danger 
					text-danger font-bold bg-primary/80
				"
			>
				{error.error ?? `Failed to load ${label}`}
			</Text>
		</View>
	);
}
