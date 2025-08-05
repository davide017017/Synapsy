/** @type {import('next').NextConfig} */

// =========================
// Configurazione Next.js
// =========================
const nextConfig = {
    reactStrictMode: true, // Strict mode React (consigliato)
    swcMinify: true, // Build più veloce

    experimental: {
        scrollRestoration: true, // Ripristino scroll tra le pagine (UX migliore)
        // Aggiungi altri flag sperimentali se servono
    },

    productionBrowserSourceMaps: false, // No sourcemap in produzione (sicurezza)

    typescript: {
        ignoreBuildErrors: false, // Blocca build se errori TS
    },

    images: {
        unoptimized: true, // ✅ Disabilita ottimizzazione immagini Next.js
    },
};

// =========================
// Esporta la configurazione
// =========================
module.exports = nextConfig;
