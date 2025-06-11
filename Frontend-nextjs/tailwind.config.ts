/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}", // opzionale se usi la dir "pages"
        "./styles/**/*.{css}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    light: "var(--color-primary-light)",
                    DEFAULT: "var(--color-primary)",
                    dark: "var(--color-primary-dark)",
                    foreground: "var(--color-primary-foreground)",
                },
                secondary: {
                    light: "var(--color-secondary-light)",
                    DEFAULT: "var(--color-secondary)",
                    dark: "var(--color-secondary-dark)",
                    foreground: "var(--color-secondary-foreground)",
                },
                tertiary: {
                    light: "var(--color-tertiary-light)",
                    DEFAULT: "var(--color-tertiary)",
                    dark: "var(--color-tertiary-dark)",
                    foreground: "var(--color-tertiary-foreground)",
                },
                success: "var(--color-success)",
                warning: "var(--color-warning)",
                danger: "var(--color-danger)",
                accent: {
                    yellow: "var(--color-accent-yellow)",
                    orange: "var(--color-accent-orange)",
                    red: "var(--color-accent-red)",
                    purple: "var(--color-accent-purple)",
                    brown: "var(--color-accent-brown)",
                },
                bg: "var(--color-bg)",
                "bg-soft": "var(--color-bg-soft)",
                text: "var(--color-text)",
                muted: "var(--color-muted)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "var(--radius)",
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};

export default config;
