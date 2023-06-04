/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./layouts/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				dark: {
					100: "#cfcdd1",
					200: "#9e9ba3",
					300: "#6e6a75",
					400: "#3d3847",
					500: "#0d0619",
					600: "#0a0514",
					700: "#08040f",
					800: "#05020a",
					900: "#030105",
				},
				background: {
					500: "#ffffff",
					600: "#cccccc",
					700: "#999999",
					800: "#666666",
					900: "#333333",
				},
				primary: {
					100: "#faf6fb",
					200: "#f5edf7",
					300: "#f0e5f2",
					400: "#ebdcee",
					500: "#e6d3ea",
					600: "#b8a9bb",
					700: "#8a7f8c",
					800: "#5c545e",
					900: "#2e2a2f",
				},
				secondary: {
					100: "#fefcfd",
					200: "#fdf9fc",
					300: "#fdf5fa",
					400: "#fcf2f9",
					500: "#fbeff7",
					600: "#c9bfc6",
					700: "#978f94",
					800: "#646063",
					900: "#323031",
				},
				accent: {
					100: "#ead3e2",
					200: "#d4a7c5",
					300: "#bf7ca7",
					400: "#a9508a",
					500: "#94246d",
					600: "#761d57",
					700: "#591641",
					800: "#3b0e2c",
					900: "#1e0716",
				},
			},
			animation: {
				spinLoader: "spinny 2s linear infinite",
				compass: "compass_rotate 2s alternate infinite",
			},
			keyframes: {
				spinny: {
					"0%": { transform: "rotate(0deg) scale(1)" },
					"50%": { transform: "rotate(45deg) scale(1.3)" },
					"10%": { transform: "rotate(360deg) scale(1)" },
				},
				compass_rotate: {
					"0%": { transform: "rotate(45deg)" },
					"30%, 50%, 70%": { transform: "rotate(230deg)" },
					"40%, 60%, 80%": { transform: "rotate(240deg)" },
					"100%": { transform: "rotate(245deg)" },
				},
			},
		},
	},
	plugins: [require("tailwind-scrollbar")],
};
