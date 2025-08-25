/** @type {import('next').NextConfig} */

// =========================
// Configurazione Next.js
// =========================
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    experimental: {
        scrollRestoration: true,
    },

    productionBrowserSourceMaps: false,

    typescript: {
        ignoreBuildErrors: false,
    },

    images: {
        // Lasciato intenzionalmente: ambiente locale / asset statici
        unoptimized: true,
    },

    // Silenzia i warning "Managed item ... isn't a directory" in dev
    webpack: (config, { dev }) => {
        if (dev) {
            config.snapshot = config.snapshot || {};
            config.snapshot.managedPaths = [];
        }
        return config;
    },
};

// =========================
// Esporta la configurazione
// =========================
module.exports = nextConfig;
