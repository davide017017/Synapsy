import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests", // cartella dei test
    timeout: 60000, // timeout 60s per test
    use: {
        browserName: "chromium", // 👉 solo Chromium
        channel: "chrome", // 👉 usa Chrome installato
        baseURL: "http://localhost:3000", // URL base app
    },
    webServer: {
        command: "npm run dev", // avvia Next.js
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI, // in locale riusa server già avviato
        timeout: 120 * 1000, // aspetta max 2 min per partire
    },
});
