import { useTheme } from "@/hooks/useTheme";
import { TextInput, View } from "react-native";
import { Search } from "lucide-react-native";

interface SearchToolbarProps {
	search: string;
	setSearch: (v: string) => void;
}

export function SearchToolbar({
	search,
	setSearch,
}: SearchToolbarProps) {
	const { colors } = useTheme();
	return (
		<View className="justify-center w-full">
			<TextInput
				value={search}
				onChangeText={(text) => setSearch(text)}
				className="
					text-success-light bg-primary-heavy/30 
					font-semibold
					border-2 border-success-light
					rounded-lg
					pl-10 pr-2
				"
				placeholder="Search location..."
				placeholderTextColor={colors.successLight(80)}
			/>
			<View className="absolute left-3">
				<Search 
					size={20}
					color={colors.successLight()}
				/>
			</View>
		</View>
	);
}