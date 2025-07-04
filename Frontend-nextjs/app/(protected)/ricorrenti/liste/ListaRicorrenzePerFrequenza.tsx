"use client";

// =======================================================
// ListaRicorrenzePerFrequenza.tsx
// Lista ricorrenze raggruppate per frequenza (ordine fisso inglese normalizzato, label ITA)
// =======================================================

import { Ricorrenza } from "@/types/types/ricorrenza";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { normalizzaFrequenza } from "../utils/ricorrenza-utils";

// ============================
// COSTANTI FREQUENZE E LABEL
// ============================
const FREQUENZE_ORDER = ["daily", "weekly", "monthly", "annually"] as const;
const FREQUENZE_LABEL: Record<string, string> = {
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
// Dialog di Conferma Eliminazione
// =======================================================
function ConfirmDialog({
    open,
    onConfirm,
    onCancel,
    nome,
}: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    nome: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
            <div className="bg-bg-elevate p-6 rounded-xl shadow-xl border flex flex-col items-center gap-3">
                <span className="text-base text-center">
                    Vuoi davvero cancellare
                    <br />
                    <b>{nome}</b>?
                </span>
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    >
                        Sì, elimina
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-1 rounded border border-zinc-300 bg-bg hover:bg-bg-soft transition"
                    >
                        Annulla
                    </button>
                </div>
            </div>
        </div>
    );
}

// =======================================================
// Utility per stile e simbolo importo
// =======================================================
function getTypeStyle(type: "entrata" | "spesa") {
    if (type === "entrata") {
        return {
            symbol: "+",
            valueClass: "text-success",
            bgClass: "bg-success/10 border-success",
        };
    } else {
        return {
            symbol: "–",
            valueClass: "text-danger",
            bgClass: "bg-danger/10 border-danger",
        };
    }
}

// =======================================================
// COMPONENTE PRINCIPALE - Lista ricorrenze per frequenza
// =======================================================
export default function ListaRicorrenzePerFrequenza({ ricorrenze, onEdit, onDelete }: Props) {
    const [toDelete, setToDelete] = useState<Ricorrenza | null>(null);

    // --------- Raggruppa ricorrenze per frequenza normalizzata ---------
    const gruppi = ricorrenze.reduce<Record<string, Ricorrenza[]>>((acc, r) => {
        const freq = normalizzaFrequenza(r.frequenza); // SEMPRE normalizza!
        if (!acc[freq]) acc[freq] = [];
        acc[freq].push(r);
        return acc;
    }, {});
    // Debug:
    // console.log("Gruppi dopo normalizzazione:", gruppi);

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
                        <li key={freq} className="mb-2">
                            {/* --------- Separatore visivo tra gruppi --------- */}
                            {idx > 0 && <div className="my-2 border-t border-dashed border-zinc-400/30" />}

                            {/* --------- Intestazione gruppo --------- */}
                            <div className="flex items-center gap-2 mt-3 mb-1">
                                <span className="px-2 py-1 bg-bg-elevate/90 rounded text-xs font-semibold text-zinc-600 dark:text-zinc-300 tracking-wider border border-zinc-300/40">
                                    {FREQUENZE_LABEL[freq] || freq}
                                </span>
                                <span className="text-zinc-400 text-xs">
                                    {gruppi[freq].length} ricorrenza{gruppi[freq].length !== 1 && "e"}
                                </span>
                            </div>

                            {/* --------- Lista delle ricorrenze del gruppo --------- */}
                            <ul>
                                {gruppi[freq].map((r) => {
                                    const { symbol, valueClass, bgClass } = getTypeStyle(r.type);
                                    return (
                                        <li
                                            key={r.id}
                                            className={`flex items-center justify-between rounded-lg border p-2 shadow-sm text-xs hover:shadow transition mb-1 ${bgClass}`}
                                        >
                                            {/* --- Info ricorrenza --- */}
                                            <div>
                                                <div className="font-semibold">{r.nome}</div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    {r.categoria} •{" "}
                                                    {FREQUENZE_LABEL[normalizzaFrequenza(r.frequenza)] || r.frequenza}
                                                </div>
                                                {r.note && <div className="text-[11px] text-zinc-400">{r.note}</div>}
                                            </div>
                                            {/* --- Importo + Azioni --- */}
                                            <div className="flex items-center gap-2 ml-2">
                                                <span className={`font-mono text-sm ${valueClass}`}>
                                                    {symbol}€{(r.importo ?? 0).toFixed(2)}
                                                </span>
                                                <button
                                                    className="p-1 rounded hover:bg-primary/10 text-primary transition"
                                                    title="Modifica"
                                                    onClick={() => onEdit?.(r)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1 rounded hover:bg-red-100 text-red-600 transition"
                                                    title="Elimina"
                                                    onClick={() => setToDelete(r)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
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
