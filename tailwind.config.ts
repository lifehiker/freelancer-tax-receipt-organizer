import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f766e",
          50: "#f0fdfa",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
        },
      },
    },
  },
  plugins: [],
};

export default config;
