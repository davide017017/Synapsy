"use client";

// =======================================================
// ListaRicorrenzePerFrequenza.tsx
// Lista ricorrenze raggruppate per frequenza (modulare, pulito)
// =======================================================

import { Ricorrenza } from "@/types/types/ricorrenza";
import { useState } from "react";
import { normalizzaFrequenza } from "../utils/ricorrenza-utils";
import RicorrenzaGroup from "./ListaRicorrenzeComponents/RicorrenzaGroup";
import ConfirmDialog from "./ListaRicorrenzeComponents/ConfirmDialog";

// ============================
// COSTANTI FREQUENZE E LABEL
// ============================
export const FREQUENZE_ORDER = ["daily", "weekly", "monthly", "annually"] as const;
export const FREQUENZE_LABEL: Record<string, string> = {
    daily: "Giornaliero",
    weekly: "Settimanale",
    monthly: "Mensile",
    annually: "Annuale",
};

// ============================
// Props tipizzate
// ============================
type Props = {
    ricorrenze: Ricorrenza[];
    onEdit?: (r: Ricorrenza) => void;
    onDelete?: (r: Ricorrenza) => void;
};

// =======================================================
// COMPONENTE PRINCIPALE
// =======================================================
export default function ListaRicorrenzePerFrequenza({ ricorrenze, onEdit, onDelete }: Props) {
    const [toDelete, setToDelete] = useState<Ricorrenza | null>(null);

    // --------- Raggruppa ricorrenze per frequenza normalizzata ---------
    const gruppi = ricorrenze.reduce<Record<string, Ricorrenza[]>>((acc, r) => {
        const freq = normalizzaFrequenza(r.frequenza);
        if (!acc[freq]) acc[freq] = [];
        acc[freq].push(r);
        return acc;
    }, {});

    // --------- Ordina ogni gruppo per importo decrescente ---------
    FREQUENZE_ORDER.forEach((freq) => {
        if (gruppi[freq]) {
            gruppi[freq].sort((a, b) => b.importo - a.importo);
        }
    });

    // --------- Frequenze effettivamente presenti ---------
    const gruppiPresenti = FREQUENZE_ORDER.filter((freq) => gruppi[freq]?.length);

    // =======================================================
    // RENDER
    // =======================================================
    return (
        <div>
            {/* ---------- Titolo Card ---------- */}
            <h2 className="font-semibold text-lg mb-1 text-primary border-b border-primary/30 pb-1">
                📆 Ricorrenze per frequenza
            </h2>
            {/* ---------- Lista raggruppata ---------- */}
            <ul>
                {gruppiPresenti.length === 0 ? (
                    <li key="empty" className="text-zinc-400 italic px-3 py-8 text-center">
                        Nessuna ricorrenza presente.
                    </li>
                ) : (
                    gruppiPresenti.map((freq, idx) => (
                        <RicorrenzaGroup
                            key={freq}
                            freq={freq}
                            items={gruppi[freq]}
                            showSeparator={idx > 0}
                            onEdit={onEdit}
                            onDelete={(r) => setToDelete(r)}
                        />
                    ))
                )}
            </ul>
            {/* ---------- Dialog conferma eliminazione ---------- */}
            <ConfirmDialog
                open={!!toDelete}
                nome={toDelete?.nome || ""}
                onCancel={() => setToDelete(null)}
                onConfirm={() => {
                    if (toDelete && onDelete) onDelete(toDelete);
                    setToDelete(null);
                }}
            />
        </div>
    );
}

// ============================
// END ListaRicorrenzePerFrequenza.tsx
// ============================
