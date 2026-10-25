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
        brand: {
          navy: {
            DEFAULT: "#0A1E42",
            dark: "#07152B",
            light: "#132B59",
            surface: "#F4F7FB",
          },
          azure: {
            DEFAULT: "#0066B2",
            dark: "#004F8A",
            light: "#0077B6",
            tint: "#EBF5FC",
          },
          cyan: {
            DEFAULT: "#009BE5",
            hover: "#0088CC",
            light: "#38BDF8",
          },
          copper: {
            DEFAULT: "#D96B27",
            hover: "#C85A17",
            dark: "#A8450E",
            tint: "#FDF4ED",
          },
          slate: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          },
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
