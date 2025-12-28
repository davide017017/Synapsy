"use client";

import { useUser } from "@/context/UserContext";

interface Props {
    inline?: boolean;
    floating?: boolean;
    className?: string;
}

export default function BetaBadge({ inline = false, floating = false, className = "" }: Props) {
    // ────────────────────────────────
    // HOOKS (SEMPRE IN CIMA)
    // ────────────────────────────────
    const { user } = useUser();

    // ────────────────────────────────
    // Feature flag globale
    // ────────────────────────────────
    const isBetaEnabled = process.env.NEXT_PUBLIC_BETA !== "false";

    // ────────────────────────────────
    // Utente demo
    // ────────────────────────────────
    const userEmail = (user?.email ?? "").toLowerCase().trim();
    const isDemoUser = userEmail === "demo@synapsy.app";

    // ────────────────────────────────
    // Condizione finale di rendering
    // ────────────────────────────────
    if (!isBetaEnabled || !isDemoUser) return null;

    // ────────────────────────────────
    // UI
    // ────────────────────────────────
    const text =
        "Versione Beta: alcuni dati potrebbero essere cancellati; " +
        "funzionalità e UI potrebbero cambiare senza preavviso; " +
        "non usare per dati sensibili reali; per feedback scrivi a synapsy.customer@gmail.com.";

    const base =
        "inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-pink-200 text-pink-800 border border-pink-300";

    const pos = floating ? "fixed top-2 right-2 z-50" : inline ? "ml-2" : "";

    return (
        <span className={`${base} ${pos} ${className}`.trim()} title={text}>
            Beta
        </span>
    );
}

/* --------------------------------------------------
DESCRIZIONE FILE
-----------------------------------------------------
Badge "Beta" visibile solo se:
- NEXT_PUBLIC_BETA !== "false"
- utente loggato = demo@synapsy.app

Gli hook sono chiamati sempre in cima
→ nessun warning ESLint / React.
-------------------------------------------------- */
