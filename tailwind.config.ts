import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0A0A0C",
        surface: "#101014",
        accent: {
          DEFAULT: "#8FA6FF",
          strong: "#C7D2FE",
          dim: "rgba(143, 166, 255, 0.35)",
        },
        ink: {
          DEFAULT: "#F4F4F5",
          muted: "#A1A1AA",
          faint: "#71717A",
        },
        success: "#34D399",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        caption: "0.22em",
      },
      boxShadow: {
        glass: "0 24px 64px -32px rgba(0, 0, 0, 0.55)",
        glassSoft: "0 12px 40px -24px rgba(0, 0, 0, 0.45)",
        glow: "0 0 40px -8px rgba(143, 166, 255, 0.35)",
        glowSoft: "0 0 24px -6px rgba(143, 166, 255, 0.25)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.8)" },
        },
        "scroll-dot": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
        orb: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(3%, -4%) scale(1.06)" },
        },
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        "float-slow": "float 16s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
        "scroll-dot": "scroll-dot 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        orb: "orb 24s ease-in-out infinite",
        "orb-slow": "orb 32s ease-in-out infinite reverse",
      },
    },
  },
  plugins: [],
};

export default config;
