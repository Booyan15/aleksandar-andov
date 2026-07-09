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
          darkRed: "#991B1B",
          yellow: "#FACC15",
          gold: "#EAB308",
          warm: "#FAFAF7",
          cream: "#FFFFFF",
          dark: "#1F2937",
          muted: "#6B7280",
          text: "#1F2937",
          line: "#E5E7EB"
        }
      },
      boxShadow: {
        official: "0 18px 45px rgba(31, 41, 55, 0.08)",
        card: "0 12px 28px rgba(31, 41, 55, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
