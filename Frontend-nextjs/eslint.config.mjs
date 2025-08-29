// eslint.config.mjs
// ╔══════════════════════════════════════════════════════╗
// ║ ESLint 9 Flat Config — Next 15 + FlatCompat + custom ║
/* ╚══════════════════════════════════════════════════════╝ */

import { FlatCompat } from "@eslint/eslintrc";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ─────────────────────────────────────────────────────────────
// Base dir ESM (evita import.meta.dirname che non è standard)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compat: consente di usare "extends: 'next/core-web-vitals'" in Flat
const compat = new FlatCompat({
    baseDirectory: __dirname,
    // (opzionale, utile in monorepo)
    resolvePluginsRelativeTo: __dirname,
});

// ─────────────────────────────────────────────────────────────
// Esporta Flat Config
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    // ==============================================
    // 1) Preset ufficiale Next via FlatCompat
    //    (equivale a "extends: ['next', 'next/core-web-vitals']")
    // ==============================================
    ...compat.extends("next", "next/core-web-vitals"),

    // ==============================================
    // 2) Config progetto: parser, plugin e regole custom
    // ==============================================
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: { version: "detect" },
        },
        plugins: {
            react: pluginReact,
            "react-hooks": pluginReactHooks,

            // ── Plugin locale con la tua regola preesistente ──
            "no-global-context": {
                rules: {
                    "forbid-aggregator": {
                        meta: { type: "problem" },
                        create(context) {
                            return {
                                ImportDeclaration(node) {
                                    const from = node.source.value;
                                    const names = (node.specifiers || [])
                                        .filter((s) => s.type === "ImportSpecifier")
                                        .map((s) => s.imported.name);

                                    const badPath = typeof from === "string" && from.includes("context/contexts");
                                    const badName = names.includes("GlobalContextProvider");

                                    if (badPath || badName) {
                                        context.report({ node, message: "Global context aggregators are forbidden" });
                                    }
                                },
                            };
                        },
                    },
                },
            },
        },

        // ─────────────────────────────────────────────────────────
        // Regole custom (NON re-importiamo qui le regole Next)
        // ─────────────────────────────────────────────────────────
        rules: {
            // Hooks canoniche
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // JSX runtime moderno
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",

            // Per <style jsx> (styled-jsx)
            "react/no-unknown-property": ["error", { ignore: ["jsx"] }],

            // Regola custom preesistente
            "no-global-context/forbid-aggregator": "error",

            // Evita import legacy
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        { name: "@/hooks/useTransactions", message: "Importa da '@/context/TransactionsContext'." },

                        // Provider bloccati globalmente
                        {
                            name: "@/context/TransactionsContext",
                            importNames: ["TransactionsProvider"],
                            message: "Montalo solo in app/(protected)/layout.tsx",
                        },
                        {
                            name: "@/context/CategoriesContext",
                            importNames: ["CategoriesProvider"],
                            message: "Montalo solo in app/(protected)/layout.tsx",
                        },
                        {
                            name: "@/context/UserContext",
                            importNames: ["UserProvider"],
                            message: "Montalo solo in app/providers.tsx",
                        },
                    ],
                },
            ],

            // Blocca import namespace dai context (aggiramento tipico)
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        "ImportDeclaration[source.value='@/context/TransactionsContext'] ImportNamespaceSpecifier",
                    message:
                        "Evita import namespace da '@/context/TransactionsContext'. Importa solo i nomi necessari.",
                },
                {
                    selector: "ImportDeclaration[source.value='@/context/CategoriesContext'] ImportNamespaceSpecifier",
                    message: "Evita import namespace da '@/context/CategoriesContext'. Importa solo i nomi necessari.",
                },
                {
                    selector: "ImportDeclaration[source.value='@/context/UserContext'] ImportNamespaceSpecifier",
                    message: "Evita import namespace da '@/context/UserContext'. Importa solo i nomi necessari.",
                },
            ],
        },
    },

    // ==============================================
    // 3) Override: area protetta (layout)
    // ==============================================
    {
        files: ["app/(protected)/layout.tsx"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        { name: "@/hooks/useTransactions", message: "Importa da '@/context/TransactionsContext'." },
                        // ❌ Vietato importare UserProvider qui
                        {
                            name: "@/context/UserContext",
                            importNames: ["UserProvider"],
                            message: "UserProvider va montato solo in app/providers.tsx",
                        },
                    ],
                },
            ],
        },
    },

    // ==============================================
    // 4) Override: app/providers.tsx
    // ==============================================
    {
        files: ["app/providers.tsx"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        { name: "@/hooks/useTransactions", message: "Importa da '@/context/TransactionsContext'." },
                        // ❌ Vietati gli altri due provider qui
                        {
                            name: "@/context/TransactionsContext",
                            importNames: ["TransactionsProvider"],
                            message: "TransactionsProvider va in app/(protected)/layout.tsx",
                        },
                        {
                            name: "@/context/CategoriesContext",
                            importNames: ["CategoriesProvider"],
                            message: "CategoriesProvider va in app/(protected)/layout.tsx",
                        },
                    ],
                },
            ],
        },
    },

    // ==============================================
    // 5) Ignora build output
    // ==============================================
    {
        ignores: ["node_modules/", ".next/", "dist/", "build/", "coverage/"],
    },
];

// ─────────────────────────────────────────────────────────────
// Descrizione file:
// Config ESLint Flat con Next 15 usando FlatCompat per includere
// 'next' e 'next/core-web-vitals' (preset ufficiali). Aggiunge
// parser TypeScript, plugin React/Hooks e le tue regole custom,
// con override per dove montare i Provider. Così Next “vede” il
// suo preset e sparisce il warning sul plugin mancante.
// ─────────────────────────────────────────────────────────────
