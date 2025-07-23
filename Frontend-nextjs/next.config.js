/** @type {import('next').NextConfig} */

// Importa il bundle analyzer
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true", // Lo attivi solo quando serve
});

// =========================
// Config Next.js principale
// =========================
const nextConfig = {
    reactStrictMode: true,

    // Ottimizzazioni build/dev
    swcMinify: true, // Build più veloce

    experimental: {
        scrollRestoration: true, // Migliora UX su SPA
        // Altri flag qui se ti servono
    },

    productionBrowserSourceMaps: false, // No sourcemap in prod

    typescript: {
        ignoreBuildErrors: false, // Blocca su errori TS
    },
};

// ==========================
// Esporta con analyzer (solo se ANALYZE=true)
// ==========================
module.exports = withBundleAnalyzer(nextConfig);
