import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6f5ef",
          100: "#b3e0cd",
          200: "#80cbab",
          300: "#4db689",
          400: "#26a66f",
          500: "#0d7c5f",
          600: "#0b6b52",
          700: "#095e48",
          800: "#074c3a",
          900: "#043a2d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
