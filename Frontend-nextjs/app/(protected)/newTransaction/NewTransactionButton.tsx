"use client";

/* ╔═════════════════════════════════════════════════════════╗
 * ║   NewTransactionButton — Bottone aggiunta transazione  ║
 * ╚═════════════════════════════════════════════════════════╝ */

import { PlusCircle } from "lucide-react";
import { useTransactions } from "@/context/contexts/TransactionsContext";

// ============================
// Tipi Props
// ============================
type Props = {
    label?: string;
};

// ============================
// Bottone per aprire la modale
// ============================
export default function NewTransactionButton({ label = "Nuova Transazione" }: Props) {
    const { openModal } = useTransactions();

    return (
        <button
            type="button"
            className="
                inline-flex items-center gap-2
                px-3 py-1.5 rounded-xl
                bg-primary-dark text-bg
                hover:opacity-90
                text-sm font-medium
                transition shadow-lg
                active:scale-95
            "
            // Apri la modale per nuova transazione
            onClick={() => openModal()}
        >
            <PlusCircle size={16} />
            {label}
        </button>
    );
}
