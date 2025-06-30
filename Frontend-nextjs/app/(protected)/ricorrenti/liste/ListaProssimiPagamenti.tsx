"use client";

// ============================
// ListaProssimiPagamenti.tsx
// Lista filtrabile dei prossimi pagamenti in scadenza
// ============================

import { Ricorrenza } from "@/types";

// --------------------
// Props tipizzate
// --------------------
type Props = {
    pagamenti: Ricorrenza[];
    filtro: "tutti" | "settimana" | "mese";
    setFiltro: (val: "tutti" | "settimana" | "mese") => void;
    totaleSettimana: number;
    totaleMese: number;
};

// --------------------
// Componente principale
// --------------------
export default function ListaProssimiPagamenti({ pagamenti, filtro, setFiltro, totaleSettimana, totaleMese }: Props) {
    return (
        <div>
            {/* ====== Header e filtri ====== */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-lg text-primary border-b border-primary/30 pb-1">
                    📅 Prossimi pagamenti
                </h2>
                <div className="flex gap-1">
                    <button
                        className={`px-2 py-1 rounded text-xs font-semibold transition ${
                            filtro === "tutti"
                                ? "bg-primary text-white"
                                : "bg-bg-elevate text-primary border border-primary"
                        }`}
                        onClick={() => setFiltro("tutti")}
                    >
                        Tutti
                    </button>
                    <button
                        className={`px-2 py-1 rounded text-xs font-semibold transition ${
                            filtro === "settimana"
                                ? "bg-primary text-white"
                                : "bg-bg-elevate text-primary border border-primary"
                        }`}
                        onClick={() => setFiltro("settimana")}
                    >
                        Settimana
                    </button>
                    <button
                        className={`px-2 py-1 rounded text-xs font-semibold transition ${
                            filtro === "mese"
                                ? "bg-primary text-white"
                                : "bg-bg-elevate text-primary border border-primary"
                        }`}
                        onClick={() => setFiltro("mese")}
                    >
                        Mese
                    </button>
                </div>
            </div>

            {/* ====== Lista pagamenti o messaggio vuoto ====== */}
            <ul className="space-y-2">
                {pagamenti.length === 0 ? (
                    <li className="text-zinc-400 italic px-3 py-8">Nessun pagamento in scadenza.</li>
                ) : (
                    pagamenti
                        .sort((a, b) => new Date(a.prossima).getTime() - new Date(b.prossima).getTime())
                        .map((r) => (
                            <li
                                key={r.id}
                                className="flex items-center justify-between rounded-xl border border-bg-elevate bg-bg-elevate/70 p-3 shadow-sm hover:shadow transition"
                            >
                                {/* Info pagamento */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-zinc-400 w-20">
                                            {new Date(r.prossima).toLocaleDateString("it-IT", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit",
                                            })}
                                        </span>
                                        <span className="font-semibold">{r.nome}</span>
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                            ({r.frequenza})
                                        </span>
                                    </div>
                                </div>
                                {/* Importo */}
                                <span className="font-mono text-base text-green-700 dark:text-green-400">
                                    € {r.importo.toFixed(2)}
                                </span>
                            </li>
                        ))
                )}
            </ul>

            {/* ====== Badge totali scadenze ====== */}
            <div className="mt-4 flex flex-col gap-1 items-end">
                <span className="inline-block px-3 py-1 rounded-xl bg-primary/10 text-primary font-semibold text-sm">
                    Scadenze settimana:&nbsp;
                    <span className="font-mono">€ {totaleSettimana.toFixed(2)}</span>
                </span>
                <span className="inline-block px-3 py-1 rounded-xl bg-primary/10 text-primary font-semibold text-sm">
                    Scadenze mese:&nbsp;
                    <span className="font-mono">€ {totaleMese.toFixed(2)}</span>
                </span>
            </div>
        </div>
    );
}

// ============================
// END LISTA PROSSIMI PAGAMENTI
// ============================
