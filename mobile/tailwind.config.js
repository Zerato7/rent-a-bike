/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	darkMode: "class",
	content: [
		"./components/**/*.{js,jsx,ts,tsx}",
		"./app/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				primary: "rgb(var(--primary) / <alpha-value>)",
				"primary-medium": "rgb(var(--primary-medium) / <alpha-value>)",
				"primary-heavy": "rgb(var(--primary-heavy) / <alpha-value>)",
				success: "rgb(var(--success) / <alpha-value>)",
				"success-medium": "rgb(var(--success-medium) / <alpha-value>)",
				"success-light": "rgb(var(--success-light) / <alpha-value>)",
				danger: "rgb(var(--danger) / <alpha-value>)",
				"danger-light": "rgb(var(--danger-light) / <alpha-value>)",
				warning: "rgb(var(--warning) / <alpha-value>)",
				accent: "rgb(var(--accent) / <alpha-value>)",
				shadow: "rgb(var(--shadow) / <alpha-value>)",
				neutral: "rgb(var(--neutral) / <alpha-value>)",
				blackish: "rgb(var(--blackish) / <alpha-value>)",
			},
		},
	},
	plugins: [],
};
