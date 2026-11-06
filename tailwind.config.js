/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ggg: {
          bg: "var(--ggg-bg)",
          panel: "var(--ggg-panel)",
          "panel-strong": "var(--ggg-panel-strong)",
          border: "var(--ggg-border)",
          "border-strong": "var(--ggg-border-strong)",
          text: "var(--ggg-text)",
          muted: "var(--ggg-muted)",
          dim: "var(--ggg-dim)",
          accent: "var(--ggg-accent)",
          "accent-glow": "var(--ggg-accent-glow)",
          "accent-soft": "var(--ggg-accent-soft)",
          "accent-border": "var(--ggg-accent-border)",
          "accent-border-strong": "var(--ggg-accent-border-strong)",
          live: "var(--ggg-live)",
          "live-dim": "var(--ggg-live-dim)",
        },
      },
      maxWidth: {
        ggg: "var(--ggg-max)",
      },
      spacing: {
        ggg: "var(--ggg-pad)",
        4.5: "18px",
        5.5: "22px",
      },
      fontFamily: {
        // Legacy token name: this is the display font (a soft sans, see layout.jsx), not Bebas Neue.
        bebas: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "ggg-hero": ["clamp(56px, 7.6vw, 112px)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "ggg-section": ["clamp(32px, 3.6vw, 52px)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "ggg-page": ["clamp(34px, 3.9vw, 56px)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "ggg-contact": ["clamp(34px, 4vw, 58px)", { lineHeight: "1.06", letterSpacing: "-0.025em" }],
        "ggg-studio": ["clamp(34px, 3.9vw, 56px)", { lineHeight: "1.06", letterSpacing: "-0.025em" }],
        "ggg-metric": ["clamp(20px, 2.6vw, 32px)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "ggg-media-stat": ["clamp(40px, 5vw, 60px)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "ggg-body": ["15px", { lineHeight: "1.65" }],
        "ggg-body-sm": ["13px", { lineHeight: "1.6" }],
        "ggg-body-xs": ["12.5px", { lineHeight: "1.5" }],
        "ggg-label": ["10.5px", { lineHeight: "1.35", letterSpacing: "0.14em" }],
        "ggg-eyebrow": ["10px", { lineHeight: "1.3", letterSpacing: "0.2em" }],
      },
      borderRadius: {
        "ggg-sm": "8px",
        ggg: "14px",
        "ggg-md": "18px",
        "ggg-lg": "22px",
      },
      // Softer weight scale: the heaviest tiers all render at 600.
      fontWeight: {
        bold: "600",
        extrabold: "600",
        black: "600",
      },
      boxShadow: {
        "ggg-card": "0 8px 28px rgba(0,0,0,0.32)",
        "ggg-card-hover":
          "0 18px 48px rgba(0,0,0,0.42)",
      },
      keyframes: {
        landingTicker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        livePulse: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.45",
            transform: "scale(0.8)",
          },
        },
      },
      animation: {
        "landing-ticker": "landingTicker 38s linear infinite",
        "live-pulse": "livePulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
