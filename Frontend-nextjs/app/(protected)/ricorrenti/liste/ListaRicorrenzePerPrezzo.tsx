"use client";

// ============================
// ListaRicorrenzePerPrezzo.tsx
// Lista ordinata delle ricorrenze per prezzo (dashboard ricorrenze)
// ============================

import { Ricorrenza } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

// --------------------
// Props tipizzate
// --------------------
type Props = {
    ricorrenze: Ricorrenza[];
};

// --------------------
// Componente principale
// --------------------
export default function ListaRicorrenzePerPrezzo({ ricorrenze }: Props) {
    return (
        <div>
            {/* ====== Titolo ====== */}
            <h2 className="font-semibold text-lg mb-2 text-primary border-b border-primary/30 pb-1">
                💸 Ricorrenze per prezzo
            </h2>

            {/* ====== Lista ricorrenze ====== */}
            <ul className="space-y-2">
                {ricorrenze.map((r) => (
                    <li
                        key={r.id}
                        className="flex items-center justify-between rounded-xl border border-bg-elevate bg-bg-elevate/70 p-3 shadow-sm hover:shadow transition"
                    >
                        {/* Info ricorrenza */}
                        <div>
                            <div className="font-semibold">{r.nome}</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                {r.categoria} • {r.frequenza}
                            </div>
                            <div className="text-xs text-zinc-400">{r.note || "—"}</div>
                        </div>
                        {/* Azioni */}
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-base text-green-700 dark:text-green-400">
                                € {r.importo.toFixed(2)}
                            </span>
                            <button className="p-2 rounded hover:bg-primary/10 text-primary transition">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded hover:bg-red-100 text-red-600 transition">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ============================
// END LISTA RICORRENZE PER PREZZO
// ============================
