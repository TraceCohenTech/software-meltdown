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
        base: "#0a0f1a",
        surface: "#141c2e",
        "surface-hover": "#1a2540",
        border: "#293548",
        "border-hover": "#3b4a63",
        accent: "#38bdf8",
        "text-primary": "#f1f5f9",
        "text-secondary": "#cbd5e1",
        "text-muted": "#8b9ab8",
      },
    },
  },
  plugins: [],
}
export default config
