"use client";

// =======================================================
// ListaRicorrenzePerFrequenza.tsx — Lista completa UI soft
// =======================================================

import { useState } from "react";
import RicorrenzaGroup from "./ListaRicorrenzeComponents/RicorrenzaGroup";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { Repeat } from "lucide-react";
import { Ricorrenza } from "@/types/types/ricorrenza";

// ============================
// COSTANTI FREQUENZE & LABEL
// ============================
export const FREQUENZE_ORDER = ["daily", "weekly", "monthly", "annually"] as const;
export const FREQUENZE_LABEL: Record<string, string> = {
    daily: "Giornaliera",
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
    onDelete?: (r: Ricorrenza) => Promise<void> | void;
};

// =======================================================
// COMPONENTE PRINCIPALE
// =======================================================
export default function ListaRicorrenzePerFrequenza({ ricorrenze, onEdit, onDelete }: Props) {
    const [toDelete, setToDelete] = useState<Ricorrenza | null>(null);
    const [loading, setLoading] = useState(false);

    // Raggruppa ricorrenze per frequenza
    const gruppi = ricorrenze.reduce<Record<string, Ricorrenza[]>>((acc, r) => {
        const freq = r.frequenza;
        if (!acc[freq]) acc[freq] = [];
        acc[freq].push(r);
        return acc;
    }, {});

    // Ordina ogni gruppo per importo decrescente
    FREQUENZE_ORDER.forEach((freq) => {
        if (gruppi[freq]) {
            gruppi[freq].sort((a, b) => b.importo - a.importo);
        }
    });

    const gruppiPresenti = FREQUENZE_ORDER.filter((freq) => gruppi[freq]?.length);

    // Conferma eliminazione
    async function handleConfirmDelete() {
        if (!toDelete || !onDelete) return;
        setLoading(true);
        try {
            await onDelete(toDelete);
        } finally {
            setLoading(false);
            setToDelete(null);
        }
    }

    // =============================
    // RENDER
    // =============================
    return (
        <div className="rounded-2xl border border-bg-elevate bg-[hsl(var(--c-bg-elevate),_#fafbfc)] p-4 shadow-xl min-h-[180px]">
            {/* Titolo */}
            <h2 className="font-semibold text-lg mb-2 text-primary flex items-center gap-2">
                <Repeat className="w-5 h-5" /> Ricorrenze per frequenza
            </h2>
            {/* Lista gruppi */}
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
            {/* Dialog conferma eliminazione */}
            <ConfirmDialog
                open={!!toDelete}
                type="delete"
                title="Vuoi davvero eliminare questa ricorrenza?"
                highlight={
                    toDelete && (
                        <div className="flex flex-col items-center">
                            <span className="italic">{toDelete.nome}</span>
                            {toDelete.importo && <span>{toDelete.importo.toFixed(2)}€</span>}
                            {toDelete.categoria && <span>{toDelete.categoria}</span>}
                            {toDelete.frequenza && (
                                <span className="text-xs">
                                    {FREQUENZE_LABEL?.[toDelete.frequenza] ?? toDelete.frequenza}
                                </span>
                            )}
                        </div>
                    )
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => setToDelete(null)}
                loading={loading}
            />
        </div>
    );
}

// ============================
// END ListaRicorrenzePerFrequenza.tsx
// ============================
