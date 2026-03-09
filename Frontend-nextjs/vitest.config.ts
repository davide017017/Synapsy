import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        // jsdom simula il DOM del browser
        environment: "jsdom",
        // Carica i matcher di jest-dom automaticamente
        setupFiles: ["./tests/unit/setup.ts"],
        globals: true,
        // Includi solo i test unitari (non i test E2E di playwright)
        include: ["tests/unit/**/*.test.{ts,tsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["lib/**", "hooks/**", "context/**", "src/lib/**"],
            exclude: ["node_modules", ".next"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
});
