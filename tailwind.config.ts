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
                background: {
                    primary: "#0a0a0f",
                    secondary: "#12121a",
                },
                accent: {
                    DEFAULT: "#c9a96e",
                    light: "#e0c992",
                    dark: "#9a7d4e",
                    glow: "rgba(201, 169, 110, 0.3)",
                },
                text: {
                    primary: "#f0f0f5",
                    secondary: "#8a8a9a",
                    muted: "#55556a",
                },
            },
            fontFamily: {
                display: ["var(--font-display)", "Outfit", "sans-serif"],
                body: ["var(--font-body)", "Inter", "sans-serif"],
            },
            borderRadius: {
                lg: "24px",
                md: "16px",
                sm: "8px",
            },
            transitionTimingFunction: {
                smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        },
    },
    plugins: [],
};
export default config;
