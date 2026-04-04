import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          accent: "#facc15",   // primary yellow — used as brand-accent throughout admin
          gold:   "#facc15",
          light:  "#fde047",
          dark:   "#030303",
          card:   "#0a0a0a",
          pink:   "#f472b6",
          cyan:   "#22d3ee",
          purple: "#a78bfa",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      animation: {
        "shimmer":     "shimmer 3s linear infinite",
        "glow-pulse":  "glow-pulse 2.5s ease-in-out infinite",
        "float":       "float 4s ease-in-out infinite",
        "spin-slow":   "spin-slow 20s linear infinite",
        "fade-up":     "fade-up .6s ease-out forwards",
        "fade-in":     "fade-in .5s ease-out forwards",
        "aurora":      "aurora 8s ease-in-out infinite",
      },
      keyframes: {
        shimmer:      { "0%":{"background-position":"-200% center"}, "100%":{"background-position":"200% center"} },
        "glow-pulse": { "0%,100%":{"box-shadow":"0 0 20px rgba(250,204,21,.25)"}, "50%":{"box-shadow":"0 0 50px rgba(250,204,21,.5)"} },
        float:        { "0%,100%":{"transform":"translateY(0)"}, "50%":{"transform":"translateY(-14px)"} },
        "spin-slow":  { "to":{"transform":"rotate(360deg)"} },
        "fade-up":    { "from":{"opacity":"0","transform":"translateY(24px)"}, "to":{"opacity":"1","transform":"translateY(0)"} },
        "fade-in":    { "from":{"opacity":"0"}, "to":{"opacity":"1"} },
        aurora:       { "0%,100%":{"opacity":".4","transform":"translateY(0) scale(1)"}, "50%":{"opacity":".8","transform":"translateY(-20px) scale(1.05)"} },
      },
    },
  },
  plugins: [],
};
export default config;
