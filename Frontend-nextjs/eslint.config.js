// ╔══════════════════════════════════════════════════════╗
// ║ ESLint 9 flat config — Next 15 + regola locale       ║
// ╚══════════════════════════════════════════════════════╝

import nextPlugin from "eslint-plugin-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // ─────────────────────────────────────────────
  // Base Next.js (Core Web Vitals)
  // ─────────────────────────────────────────────
  ...nextPlugin.configs["core-web-vitals"],

  // ─────────────────────────────────────────────
  // Regole progetto
  // ─────────────────────────────────────────────
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: {
      // Plugin "virtuale" contenente la tua regola
      "no-global-context": {
        rules: {
          "forbid-aggregator": {
            meta: { type: "problem" },
            create(context) {
              return {
                ImportDeclaration(node) {
                  const from = node.source.value;
                  const names = (node.specifiers || [])
                    .filter(s => s.type === "ImportSpecifier")
                    .map(s => s.imported.name);

                  const badPath = typeof from === "string" && from.includes("context/contexts");
                  const badName = names.includes("GlobalContextProvider");

                  if (badPath || badName) {
                    context.report({ node, message: "Global context aggregators are forbidden" });
                  }
                }
              };
            }
          }
        }
      }
    },
    rules: {
      "no-global-context/forbid-aggregator": "error"
    },
    ignores: ["node_modules/", ".next/", "dist/", "build/", "coverage/"]
  }
];
