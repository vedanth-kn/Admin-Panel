import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/react");  // Keep this import

// Remove this line as it's causing a duplicate import
// import {heroui} from '@heroui/theme';  

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Update this line to include all NextUI components
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
	extend: {
		colors: {
			background: "var(--background)",
			foreground: "var(--foreground)",
		},
	  },
  },
  darkMode: "class", // Add this for dark mode support
  plugins: [heroui()],
} satisfies Config;