// app/layout.tsx
// ======================================================================
// Root layout: tema dinamico + supporto "system", niente hydration error.
// - Legge cookie "theme" lato server (async cookies())
// - Applica class/data-theme su SSR
// - Script early nel <head> per risolvere "system" e prevenire flicker
// ======================================================================

import "../styles/globals.css";
import "@/styles/table.css";
import "@/styles/themes.css";
import type { Metadata } from "next";
import { cookies } from "next/headers"; // async in Next 15
import Script from "next/script";
import Providers from "./providers";

// ----------------------
// SEO base
// ----------------------
export const metadata: Metadata = {
    title: "Synapsy",
    description: "Gestione finanziaria personale",
};

// ----------------------
// Utils: sanifica il nome tema (a-z, 0-9, -, _)
// ----------------------
function sanitizeTheme(raw: string | undefined): string | null {
    if (!raw) return null;
    const safe = raw.trim().toLowerCase();
    return /^[a-z0-9_-]+$/.test(safe) ? safe : null;
}

// ----------------------
// Ottieni tema iniziale lato server (async cookies())
//  - Se "system": SSR usa placeholder "dark"; script applica light/dark
//  - Se altro: applica direttamente
// ----------------------
async function getInitialTheme(): Promise<string> {
    const cookieStore = await cookies();
    const raw = cookieStore.get("theme")?.value;
    const theme = sanitizeTheme(raw);
    return theme ?? "dark"; // fallback sicuro
}

// ======================================================================
// RootLayout (Server Component async)
// ======================================================================
export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const initialTheme = await getInitialTheme(); // "dark" | "light" | "emerald" | "solarized" | "system" | ...
    const ssrTheme = initialTheme === "system" ? "dark" : initialTheme;

    return (
        <html
            lang="it"
            className={ssrTheme} // es. "emerald" oppure "dark" placeholder per "system"
            data-theme={ssrTheme}
            suppressHydrationWarning
        >
            {/* ───────────────────────────────────────────────────────────────
            Head del documento: qui è consentito inserire <Script />
            ──────────────────────────────────────────────────────────────── */}
            <head>
                {/* No-flash Theme Script (prima della hydration) */}
                <Script id="theme-init" strategy="beforeInteractive">
                    {`
                        (function() {
                            try {
                                // leggi cookie "theme"
                                var m = document.cookie.match(/(?:^|; )theme=([^;]+)/);
                                var raw = m ? decodeURIComponent(m[1]) : "";
                                var theme = (raw || "").trim().toLowerCase();
                                var safe = /^[a-z0-9_-]+$/.test(theme) ? theme : "dark";

                                // system → risolvi in light/dark con prefers-color-scheme
                                if (safe === "system") {
                                    safe = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                                }

                                var html = document.documentElement;
                                if (html.getAttribute("data-theme") !== safe) {
                                    html.setAttribute("data-theme", safe);
                                    html.className = safe;
                                }
                            } catch(_) {}
                        })();
                    `}
                </Script>
            </head>

            <body>
                {/* Providers NON deve cambiare <html>; SSR + script hanno già allineato */}
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Layout radice App Router. Sposta lo script di init tema nel <head> con
// strategy="beforeInteractive" (niente errori su <script> dentro <html>).
// cookies() async, tema dinamico (anche "system") senza liste hardcoded.
// ----------------------------------------------------------------------
