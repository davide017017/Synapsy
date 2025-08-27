// eslint.config.mjs
// ╔══════════════════════════════════════════════════════╗
// ║ ESLint 9 Flat Config — Next 15 + regole progetto     ║
/* ╚══════════════════════════════════════════════════════╝ */

import pluginNext from "@next/eslint-plugin-next";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    // =========================
    // Base: parser + plugin
    // =========================
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
            "@next/next": pluginNext,
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

        // =========================
        // Regole
        // =========================
        rules: {
            // Next recommended + core web vitals
            ...(pluginNext.configs?.recommended?.rules ?? {}),
            ...(pluginNext.configs?.["core-web-vitals"]?.rules ?? {}),

            // React recommended
            ...(pluginReact.configs?.recommended?.rules ?? {}),

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
                    // ⛔ Vietiamo importare i PROVIDER dai loro moduli ovunque...
                    // (gli hook restano liberi)
                    paths: [
                        // tua regola preesistente
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

            // 🛡️ Blocca anche gli import namespace (aggiramento tipico)
            //   Esempio vietato: `import * as Ctx from '@/context/TransactionsContext'`
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        "ImportDeclaration[source.value='@/context/TransactionsContext'] ImportNamespaceSpecifier",
                    message:
                        "Evita import namespace da '@/context/TransactionsContext'. Importa solo i nomi necessari (hook ovunque, provider solo dove consentito).",
                },
                {
                    selector: "ImportDeclaration[source.value='@/context/CategoriesContext'] ImportNamespaceSpecifier",
                    message:
                        "Evita import namespace da '@/context/CategoriesContext'. Importa solo i nomi necessari (hook ovunque, provider solo dove consentito).",
                },
                {
                    selector: "ImportDeclaration[source.value='@/context/UserContext'] ImportNamespaceSpecifier",
                    message:
                        "Evita import namespace da '@/context/UserContext'. Importa solo i nomi necessari (hook ovunque, provider solo dove consentito).",
                },
            ],
        },
    },

    // =========================
    // Override #1: area protetta (layout)
    //  - Qui SONO CONSENTITI i provider Transactions + Categories
    //  - UserProvider resta VIETATO
    // =========================
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
            // Manteniamo il blocco degli import namespace (non serve disattivarlo)
        },
    },

    // =========================
    // Override #2: app/providers.tsx
    //  - Qui è CONSENTITO UserProvider
    //  - Restano VIETATI TransactionsProvider + CategoriesProvider
    // =========================
    {
        files: ["app/providers.tsx"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        { name: "@/hooks/useTransactions", message: "Importa da '@/context/TransactionsContext'." },

                        // ❌ Vietati gli altri due provider in questo file
                        {
                            name: "@/context/TransactionsContext",
                            importNames: ["TransactionsProvider"],
                            message: "TransactionsProvider va montato solo in app/(protected)/layout.tsx",
                        },
                        {
                            name: "@/context/CategoriesContext",
                            importNames: ["CategoriesProvider"],
                            message: "CategoriesProvider va montato solo in app/(protected)/layout.tsx",
                        },
                    ],
                },
            ],
        },
    },

    // =========================
    // Ignora build output
    // =========================
    {
        ignores: ["node_modules/", ".next/", "dist/", "build/", "coverage/"],
    },
];

// ------------------------------------------------------
// Spiegazione rapida:
// - `no-restricted-imports` vieta di importare i *Provider* ovunque.
// - Due override ri-consentono i provider SOLO nei file giusti.
// - Blocchiamo anche gli import namespace dai moduli dei context,
//   così non si può prendere il provider via `Ctx.TransactionsProvider`.
// - Gli hook (es. `useTransactions`) sono liberi.
// ------------------------------------------------------
