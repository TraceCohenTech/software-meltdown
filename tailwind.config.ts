import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      colors: {
        base: "#f6f8fb",
        surface: "#ffffff",
        "surface-hover": "#f1f5f9",
        border: "#e2e8f0",
        "border-hover": "#cbd5e1",
        accent: "#0284c7",
        "text-primary": "#0f172a",
        "text-secondary": "#334155",
        "text-muted": "#64748b",
      },
    },
  },
  plugins: [],
}
export default config
