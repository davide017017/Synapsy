/** @type {import('next').NextConfig} */

// =========================
// Configurazione Next.js
// =========================
const nextConfig = {
    // ──────────────────────
    // Core
    // ──────────────────────
    reactStrictMode: true,
    poweredByHeader: false,

    // ──────────────────────
    // Sperimentali (compatibili con Turbopack)
    // ──────────────────────
    experimental: {
        // Ripristina scroll tra navigazioni
        scrollRestoration: true,
        // Import ottimizzati (es. lucide-react)
        optimizePackageImports: ["lucide-react"],
    },

    // ──────────────────────
    // Qualità di vita / Build
    // ──────────────────────
    productionBrowserSourceMaps: false,
    typescript: { ignoreBuildErrors: false },

    // ──────────────────────
    // Immagini
    // ──────────────────────
    images: { unoptimized: true },

    // ──────────────────────
    // Router micro-ottimizzazioni
    // ──────────────────────
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,

    // ──────────────────────
    // Turbopack (dichiara qui alias/rules se servono)
    // ──────────────────────
    turbopack: {
        // Esempi (decommenta/adatta se ti servono):
        // resolveAlias: {
        //     "@": "./",
        //     "@components": "./app/components",
        // },
        // rules: [
        //     { test: /\.ya?ml$/, loaders: ["yaml-loader"] },
        // ],
    },

    // ──────────────────────
    // Nota: niente sezione `webpack` → evita il warning con Turbopack
    // ──────────────────────
};

module.exports = nextConfig;

// ─────────────────────────────────────────────────────────────
// Descrizione file:
// Config Next.js per dev/build con Turbopack. Mantiene strict mode,
// ottimizzazioni router e feature sperimentali supportate. La sezione
// `turbopack` è pronta per alias/rules futuri. Rimosso `webpack()` per
// evitare il warning "Webpack is configured while Turbopack is not".
// ─────────────────────────────────────────────────────────────
