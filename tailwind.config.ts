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
        val: {
          bg:      "#0d1031",
          surface: "#111440",
          border:  "#1c2058",
          muted:   "#1e2565",
          primary: "#fe0000",
          accent:  "#fe0000",
          glow:    "#ff3333",
          text:    "#e2e8f0",
          subtle:  "#6b7db3",
          content: "#f5f7fb",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow:         "0 0 20px rgba(254,0,0,0.25)",
        "glow-sm":    "0 0 10px rgba(254,0,0,0.15)",
        "accent-glow":"0 0 20px rgba(254,0,0,0.2)",
      },
      animation: {
        pulse:     "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in":"slideIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideIn: { "0%": { transform: "translateX(-10px)", opacity: "0" }, "100%": { transform: "translateX(0)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};
export default config;
