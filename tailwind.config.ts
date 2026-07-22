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
        forest: "#18382E",
        pine: "#2E5144",
        amber: "#C6862E",
        linen: "#F4EFE4",
        driftwood: "#6F746D",
        fog: "#A7B8B4",
        flax: "#D8C9AD",
        rye: "#4A3529",
        mist: "#A7B8B4",
        steel: "#1F2727",
        beeswax: "#E1B861",
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Arial", "Helvetica", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "40": "10rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slowZoom: {
          "0%, 100%": { transform: "scale(1.05)" },
          "50%": { transform: "scale(1.12)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        "slow-zoom": "slowZoom 30s cubic-bezier(0.22,1,0.36,1) infinite",
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
