"use client";

/* ╔═════════════════════════════════════════════════════════╗
 * ║   NewTransactionButton — Bottone aggiunta transazione  ║
 * ╚═════════════════════════════════════════════════════════╝ */

import { PlusCircle } from "lucide-react";
import { useTransactions } from "@/context/TransactionsContext";
import type { NewTransactionButtonProps } from "@/types";

// ============================
// Bottone per aprire la modale
// ============================
export default function NewTransactionButton({ label = "Transazione", compact = false }: NewTransactionButtonProps) {
    const { openModal } = useTransactions();

    return (
        <button
            type="button"
            className={
                compact
                    ? "flex-1 inline-flex items-center justify-center gap-1 h-[30px] px-1 rounded-lg bg-gradient-to-b from-primary to-primary-dark text-bg hover:opacity-90 tracking-[.08em] uppercase text-[9px] font-bold font-mono border border-primary/40 transition shadow-lg active:scale-95"
                    : "inline-flex items-center gap-2 px-2 py-1.5 rounded-md bg-gradient-to-b from-primary to-primary-dark text-bg hover:opacity-90 tracking-wider uppercase text-xs font-mono border border-primary/40 transition shadow-lg active:scale-95"
            }
            // Apri la modale per nuova transazione
            onClick={() => openModal()}
        >
            <PlusCircle size={compact ? 12 : 16} />
            {label}
        </button>
    );
}
