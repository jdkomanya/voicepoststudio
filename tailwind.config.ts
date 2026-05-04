import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F3A",
        teal: "#0F766E",
        mint: "#DDF8EC",
        clinic: "#F5F8FA",
        leaf: "#228B52"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(11, 31, 58, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
