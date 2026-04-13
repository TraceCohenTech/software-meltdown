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
        base: "#080b12",
        surface: "#0f172a",
        border: "#1e293b",
        accent: "#38bdf8",
        "text-primary": "#f1f5f9",
        "text-muted": "#64748b",
      },
    },
  },
  plugins: [],
}
export default config
