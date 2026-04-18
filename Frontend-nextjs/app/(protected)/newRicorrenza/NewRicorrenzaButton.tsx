"use client";

// =========================================
// NewRicorrenzaButton.tsx
// Bottone globale per creare una nuova ricorrenza
// =========================================

import { PlusCircle } from "lucide-react";
import { useRicorrenze } from "@/context/RicorrenzeContext";
import type { NewRicorrenzaButtonProps } from "@/types";

export default function NewRicorrenzaButton({ label = "Ricorrenza", onSuccess }: NewRicorrenzaButtonProps) {
    const { openModal } = useRicorrenze();
    return (
        <button
            type="button"
            className="inline-flex items-center gap-2 px-2 py-1.5 rounded-xl bg-primary-dark text-bg hover:opacity-90 text-sm font-medium transition shadow-lg active:scale-95"
            onClick={() => openModal(undefined, onSuccess)}
        >
            <PlusCircle size={16} />
            {label}
        </button>
    );
}
