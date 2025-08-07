import { heroui } from "@heroui/react";

export default {
  content: [
    // Your app source
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/ ** / *. {js,ts,jsx,tsx,mdx}",
    "./src/components/ ** / *. {js,ts,jsx, tsx,mdx}",

    "./src/app/**/*.{js,ts,jsx,tsx}",
    
    // HeroUI theme
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
