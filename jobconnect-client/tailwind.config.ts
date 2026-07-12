import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: "#F1FEC6",
        green: {
          DEFAULT: "#496F5D",
          dark: "#1a2e25",
        },
        lavender: "#BCB6FF",
      },
      fontFamily: {
        heading: ["var(--font-bricolage)"],
        body: ["var(--font-dm-sans)"],
      },
    },
  },
  plugins: [],
}

export default config