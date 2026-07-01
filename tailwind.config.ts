import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        municipal: {
          red: "#B91C1C",
          dark: "#7F1D1D",
          yellow: "#FACC15",
          gold: "#EAB308",
          warm: "#FFF7ED",
          cream: "#FFFBF5",
          text: "#1F2937",
          line: "#F1D2C3"
        }
      },
      boxShadow: {
        official: "0 18px 55px rgba(127, 29, 29, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
