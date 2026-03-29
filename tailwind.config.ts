import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f3efe4",
        ink: "#151515",
        sunrise: "#ff785a",
        wave: "#0f6c7b",
        moss: "#5f7f41",
        error: "#ef4444",
        success: "#22c55e",
      },
      spacing: {
        "0": "0",
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "6": "1.5rem",
        "8": "2rem",
        "12": "3rem",
        "16": "4rem",
        "24": "6rem",
      },
      boxShadow: {
        card: "0 20px 45px -28px rgba(15, 108, 123, 0.45)",
        "card-dark": "0 20px 45px -28px rgba(88, 166, 255, 0.25)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
        },
      },
    },
  },
  plugins: [],
};

export default config;
