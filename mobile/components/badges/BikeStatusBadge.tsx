import { Text, View } from "react-native";

interface BikeStatusBadgeProps {
	label: string;
	variant: "success" | "neutral" | "warning" | "danger";
	className?: string;
}

export function BikeStatusBadge({ label, variant, className }: BikeStatusBadgeProps) {
	const styles = {
		success: "text-black bg-success-light",
		neutral: "text-black bg-neutral",
		warning: "text-black bg-warning",
		danger: "text-black bg-danger-light",
	};

	return (
		<View className={`
			p-1 rounded-lg border-4 border-primary-medium
			${styles[variant]} ${className ?? ""}
		`}>
			<Text className={`${styles[variant]} font-bold`}>{label}</Text>
		</View>
	);
}
