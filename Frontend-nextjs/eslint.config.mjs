// eslint.config.mjs
// ╔══════════════════════════════════════════════════════╗
// ║ ESLint 9 Flat Config — Next 15 + regole progetto     ║
// ╚══════════════════════════════════════════════════════╝

import pluginNext from "@next/eslint-plugin-next";
import pluginReact from "eslint-plugin-react"; // ← NEW
import pluginReactHooks from "eslint-plugin-react-hooks"; // ← NEW
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
            react: { version: "detect" }, // auto-detect versione React
        },
        plugins: {
            "@next/next": pluginNext,
            react: pluginReact,
            "react-hooks": pluginReactHooks,
            // ── Plugin locale con la tua regola ──
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

            // Hooks: le due regole canoniche
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn", // o "error" se vuoi severo

            // 👇 Nuove override per JSX runtime moderno
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",

            // Per <style jsx> di styled-jsx (altrimenti segnala 'jsx' come prop sconosciuta)
            "react/no-unknown-property": ["error", { ignore: ["jsx"] }],

            // Regole progetto
            "no-global-context/forbid-aggregator": "error",
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        { name: "@/hooks/useTransactions", message: "Importa da '@/context/TransactionsContext'." },
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
// Descrizione file:
// Flat config con @next/eslint-plugin-next, eslint-plugin-react,
// eslint-plugin-react-hooks. Abilitate regole hooks per useEffect/useMemo.
// Aggiunta la tua regola custom e import vietato legacy.
// ------------------------------------------------------
