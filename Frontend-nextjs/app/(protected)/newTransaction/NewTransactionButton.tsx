"use client";

// =========================================
// NewTransactionButton.tsx
// Bottone globale per creare una nuova transazione
// =========================================

import { PlusCircle } from "lucide-react";
import { useNewTransaction } from "@/context/contexts/NewTransactionContext";
import { Transaction } from "@/types";

type Props = {
    label?: string;
    onSuccess?: (newTx: Transaction) => void;
};

export default function NewTransactionButton({ label = "Nuova Transazione", onSuccess }: Props) {
    const { open } = useNewTransaction();

    return (
        <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-dark text-bg hover:opacity-90 text-sm font-medium transition shadow-lg active:scale-95"
            onClick={() => open(onSuccess)}
        >
            <PlusCircle size={16} />
            {label}
        </button>
    );
}
