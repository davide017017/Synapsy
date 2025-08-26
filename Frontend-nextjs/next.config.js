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
    // Sperimentali utili
    // ──────────────────────
    experimental: {
        scrollRestoration: true,
        optimizePackageImports: ["lucide-react"],
    },

    // ──────────────────────
    // Qualità di vita
    // ──────────────────────
    productionBrowserSourceMaps: false,
    typescript: { ignoreBuildErrors: false },
    images: { unoptimized: true },

    // ──────────────────────
    // Router micro‑ottimizzazioni
    // ──────────────────────
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,

    // ──────────────────────
    // Webpack (dev) — Windows friendly
    // ──────────────────────
    webpack: (config, { dev }) => {
        if (dev) {
            config.cache = { type: "memory", maxGenerations: 1 };
            config.resolve = config.resolve || {};
            config.resolve.symlinks = false;
            config.snapshot = config.snapshot || {};
            config.snapshot.managedPaths = [];
        }
        return config;
    },
};

module.exports = nextConfig;
