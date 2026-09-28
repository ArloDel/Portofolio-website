import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic tokens — channel triples in globals.css, flipped per theme */
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        /* Translucent layering base: flows white-on-dark, ink-on-light */
        fill: "rgb(var(--fill) / <alpha-value>)",
        /* Inverted surface for primary buttons / active chips */
        invert: "rgb(var(--invert) / <alpha-value>)",
        "invert-ink": "rgb(var(--invert-ink) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
          hi: "rgb(var(--ink-hi) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          strong: "rgb(var(--accent-strong) / <alpha-value>)",
        },
        success: "rgb(var(--success) / <alpha-value>)",
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
        glass: "var(--shadow-glass)",
        glassSoft: "var(--shadow-glass-soft)",
        glow: "0 0 40px -8px var(--glow-color)",
        glowSoft: "0 0 24px -6px var(--glow-soft)",
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
