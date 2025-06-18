/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

/* helper → rgb(var(--c-name) / <alpha-value>)  */
const c = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./styles/**/*.css",
    ],
    darkMode: "class",

    theme: {
        extend: {
            colors: {
                /* neutrali */
                bg: c("c-bg"),
                "bg-soft": c("c-bg-soft"),
                text: c("c-text"),
                muted: c("c-muted"),

                /* palette primaria */
                primary: c("c-primary"),
                "primary-light": c("c-primary-light"),
                "primary-dark": c("c-primary-dark"),

                /* altre semantic */
                success: c("c-success"),
                warning: c("c-warning"),
                danger: c("c-danger"),
            },

            /* se vuoi un bordo di default semi-trasparente */
            borderColor: {
                DEFAULT: c("c-muted"),
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
