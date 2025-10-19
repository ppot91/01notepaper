import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          background: "#f8f8f6",
          foreground: "#111111",
          muted: "#d4d4d4"
        }
      },
      fontFamily: {
        serif: ["var(--font-georgia)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        wide: "0.25em"
      }
    }
  },
  plugins: []
};

export default config;
