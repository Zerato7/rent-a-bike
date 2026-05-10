import { vars } from "nativewind";

export const RAW_COLORS = {
	light: {
		"--primary": "150 150 260",
		"--primary-medium": "143 141 249",
		"--primary-heavy": "120 120 210",
		"--success": "29 155 80",
		"--success-medium": "70 250 100",
		"--success-light": "199 225 184",
		"--danger": "215 0 0",
		"--danger-light": "145 25 25",
		"--warning": "223 234 0",
		"--accent": "210 160 120",
		"--shadow": "0 0 0",
		"--neutral": "172 172 177",
		"--blackish": "50 50 85",
	},
	dark: {
		"--primary": "54 54 183",
		"--primary-medium": "61 57 152",
		"--primary-heavy": "136 136 230",
		"--success": "199 225 184",
		"--success-medium": "60 168 104",
		"--success-light": "29 155 80",
		"--danger": "215 0 0",
		"--danger-light": "242 94 94",
		"--warning": "223 234 0",
		"--accent": "210 160 120",
		"--shadow": "82 81 162",
		"--neutral": "172 172 177",
		"--blackish": "29 29 52",
	}
}

export const lightTheme = vars(RAW_COLORS.light);
export const darkTheme = vars(RAW_COLORS.dark);
