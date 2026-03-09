/** @type {import('next').NextConfig} */

// =========================
// Security Headers
// =========================
const securityHeaders = [
    // Impedisce il clickjacking: la pagina non può essere caricata in iframe
    {
        key: "X-Frame-Options",
        value: "DENY",
    },
    // Impedisce lo sniffing del Content-Type
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    // Controlla le informazioni del referrer inviate nelle richieste
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    },
    // Limita l'accesso a funzionalità browser sensibili
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
    },
    // Content Security Policy
    // ─────────────────────────────────────────────────────────────────
    // NOTE: 'unsafe-inline' è richiesto da Next.js per gli stili inline
    // e gli script di inizializzazione tema. Da restringere in futuro
    // con nonce-based CSP quando si migra a un setup più strict.
    // ─────────────────────────────────────────────────────────────────
    {
        key: "Content-Security-Policy",
        value: [
            // Sorgenti di default: solo stessa origine
            "default-src 'self'",
            // Script: stessa origine + inline (richiesto da Next.js)
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            // Stili: stessa origine + inline (Tailwind CSS / framer-motion)
            "style-src 'self' 'unsafe-inline'",
            // Immagini: stessa origine + data URI (avatar base64)
            "img-src 'self' data: blob:",
            // Font: stessa origine
            "font-src 'self'",
            // Connessioni API: stessa origine + API backend
            "connect-src 'self' " + (process.env.NEXT_PUBLIC_API_BASE_URL || ""),
            // Worker: stessa origine
            "worker-src 'self' blob:",
            // Frame ancestors: nessuno (equivalente a X-Frame-Options DENY)
            "frame-ancestors 'none'",
            // Form action: stessa origine
            "form-action 'self'",
            // Base URI: stessa origine
            "base-uri 'self'",
        ].join("; "),
    },
];

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
    // Security Headers
    // ──────────────────────
    async headers() {
        return [
            {
                // Applica gli header a tutte le route
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },

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
// ottimizzazioni router e feature sperimentali supportate.
// Security headers aggiunti: CSP, X-Frame-Options, X-Content-Type-Options,
// Referrer-Policy, Permissions-Policy.
// ─────────────────────────────────────────────────────────────
