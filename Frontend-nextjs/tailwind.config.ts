/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

// =========================
// Helper colori HSL
// =========================
const c = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

// =========================
// Configurazione Tailwind
// =========================
const config: Config = {
    // ──────────────────────
    // Limita i percorsi (scan più rapido)
    // ──────────────────────
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "./context/**/*.{ts,tsx}",
        "./hooks/**/*.{ts,tsx}",
        // Se hai un solo entry CSS tailwind, tienilo. Altrimenti rimuovi:
        "./styles/tailwind.css",
    ],
    darkMode: "class",

    theme: {
        extend: {
            colors: {
                // ── neutrali
                bg: c("c-bg"),
                "bg-alt": c("c-bg-alt"),
                "bg-soft": c("c-bg-soft"),
                "bg-elevate": c("c-bg-elevate"),
                "bg-glass": c("c-bg-glass"),

                text: c("c-text"),
                "text-secondary": c("c-text-secondary"),
                "text-tertiary": c("c-text-tertiary"),
                "text-invert": c("c-text-invert"),

                // ── primaria
                primary: c("c-primary"),
                "primary-light": c("c-primary-light"),
                "primary-dark": c("c-primary-dark"),

                // ── semantic
                success: c("c-success"),
                "success-dark": c("c-success-dark"),
                danger: c("c-danger"),
                "danger-dark": c("c-danger-dark"),
                warning: c("c-warning"),
                "warning-dark": c("c-warning-dark"),

                // ── tabella
                "table-bg": c("c-table-bg"),
                "table-bg-alt": c("c-table-bg-alt"),
                "table-header-bg": c("c-table-header-bg"),
                "table-header-text": c("c-table-header-text"),
                "table-text": c("c-table-text"),
                "table-text-secondary": c("c-table-text-secondary"),
                "table-divider": c("c-table-divider"),
                "table-row-hover": c("c-table-row-hover"),
                "table-row-selected": c("c-table-row-selected"),
                "table-accent": c("c-table-accent"),
                "table-danger": c("c-table-danger"),
                "table-danger-2": c("c-table-danger-2"),
                "table-success": c("c-table-success"),
                "table-success-2": c("c-table-success-2"),

                // ── Modal/Overlay
                "modal-bg": c("modal-bg"),
                "modal-border": c("modal-border"),
                "modal-text": c("modal-text"),
                "modal-title": c("modal-title"),
                "modal-danger": c("modal-danger"),
                "modal-warning": c("modal-warning"),
                "modal-success": c("modal-success"),
                "modal-info": c("modal-info"),
            },
            borderColor: {
                DEFAULT: c("c-table-divider"),
                modal: c("modal-border"),
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
            backgroundImage: {
                "gradient-radial": "radial-gradient(circle at center, var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at center, var(--tw-gradient-stops))",
            },
        },
    },

    // ──────────────────────
    // Plugin (ESM import, no require)
    // ──────────────────────
    plugins: [forms],
};

export default config;
