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
                    primary: "#020617",
                    secondary: "#022c22",
                },
                accent: {
                    DEFAULT: "#10b981",
                    light: "#34d399",
                    dark: "#065f46",
                    glow: "rgba(59, 130, 246, 0.3)",
                    blue: "#3b82f6",
                },
                text: {
                    primary: "#f8fafc",
                    secondary: "#94a3b8",
                    muted: "#64748b",
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
