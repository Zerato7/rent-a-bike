import { useColorScheme } from "nativewind";
import { RAW_COLORS } from "@/constants/themes";

export const useTheme = () => {
	const { colorScheme, toggleColorScheme } = useColorScheme();

	const themeVars = colorScheme === "dark" ? RAW_COLORS.dark : RAW_COLORS.light;
	//console.log(themeVars);

	const getColor = (key: keyof typeof RAW_COLORS.light, opacity: number = 100) => {
		const rawValue = themeVars[key];
		const formattedValue = rawValue.replace(/\s+/g, ", ");
        const alpha = opacity / 100;
        return `rgba(${formattedValue}, ${alpha})`;
	};

	return {
		colors: {
			getColor,
			primary: (opacity: number = 100) => getColor("--primary", opacity),
			primaryMedium: (opacity: number = 100) => getColor("--primary-medium", opacity),
			primaryHeavy: (opacity: number = 100) => getColor("--primary-heavy", opacity),
			success: (opacity: number = 100) => getColor("--success", opacity),
			successMedium: (opacity: number = 100) => getColor("--success-medium", opacity),
			successLight: (opacity: number = 100) => getColor("--success-light", opacity),
			danger: (opacity: number = 100) => getColor("--danger", opacity),
			dangerLight: (opacity: number = 100) => getColor("--danger-light", opacity),
			warning: (opacity: number = 100) => getColor("--warning", opacity),
			accent: (opacity: number = 100) => getColor("--accent", opacity),
			shadow: (opacity: number = 100) => getColor("--shadow", opacity),
			neutral: (opacity: number = 100) => getColor("--neutral", opacity),
			blackish: (opacity: number = 100) => getColor("--blackish", opacity),
		},
		isDark: colorScheme === "dark",
		toggleColorScheme
	};
};
