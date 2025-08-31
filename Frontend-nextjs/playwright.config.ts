// ╔══════════════════════════════════════════════════════╗
// ║ Playwright Config — Chromium only + Next.js webServer║
// ╚══════════════════════════════════════════════════════╝

/// <reference types="node" />

import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    timeout: 60_000,
    use: {
        browserName: "chromium",
        baseURL: "http://localhost:3000",
        headless: true,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },
    webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});

// ───────────────────────────────────────────────────────
// Descrizione file:
// Config Playwright minimal per Chromium, con avvio
// Next.js e trace/screenshot su errori.
// ───────────────────────────────────────────────────────
