/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-light": "rgb(var(--primary-light) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        "success-light": "rgb(var(--success-light) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        "danger-light": "rgb(var(--danger-light) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        shadow: "rgb(var(--shadow) / <alpha-value>)",
        neutral: "rgb(var(--neutral) / <alpha-value>)",
        blackish: "rgb(var(--blackish) / <alpha-value>)"
      }
    },
  },
  plugins: [],
} satisfies import('tailwindcss').Config;

