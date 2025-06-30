"use client";
// ============================
// CardAggiungiRicorrenza.tsx
// Card: bottone per aggiungere una nuova ricorrenza
// ============================

import { Plus } from "lucide-react";

// -------------------------------------
// Props tipizzate
// -------------------------------------
type Props = {
    onAdd?: () => void; // Callback opzionale per l'aggiunta
};

// -------------------------------------
// Componente principale
// -------------------------------------
export default function CardAggiungiRicorrenza({ onAdd }: Props) {
    return (
        <div className="rounded-2xl border border-bg-elevate bg-bg-elevate/70 p-4 flex items-center justify-center shadow-md min-h-[108px]">
            {/* ----------- Pulsante aggiungi ----------- */}
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
                onClick={onAdd}
            >
                <Plus className="w-5 h-5" />
                Aggiungi ricorrenza
            </button>
        </div>
    );
}

// ============================
// END CardAggiungiRicorrenza.tsx
// ============================
