import type { Config } from "tailwindcss";

const config: Config = {
   content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#e6eaf0",
          100: "#b0bfd1",
          200: "#8a9dbb",
          300: "#54709c",
          400: "#335489",
          500: "#00296b",
          600: "#002561",
          700: "#001d4c",
          800: "#00173b",
          900: "#00112d",
        },

        gold: {
          50: "#f3e5c6",
          100: "#e6d08a",
          200: "#eec85a",
          300: "#e8d530",
          400: "#f1d133",
          500: "#c5a500",
          600: "#b59300",
          700: "#a38000",
          800: "#8c6c00",
          900: "#6a5300",
        },

        red: {
          500: "#e00000",
          600: "#c00000",
          700: "#8b0000",
        },

        green: {
          500: "#70c000",
          600: "#60c000",
        },

        cyan: {
          500: "#00c9a6",
          600: "#00c699",
        },

        white: {
          100: "#f9f9f9",
          300: "#f3f3f3",
          500: "#ececec",
          700: "#a8a8a8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
