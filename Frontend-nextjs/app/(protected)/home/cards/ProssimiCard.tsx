// app/(protected)/home/cards/ProssimiCard.tsx
// ======================================================================
// Card Home mobile che unisce Ricorrenti + Prossimi pagamenti:
// prossimo pagamento in grande, poi timeline delle voci successive.
// ======================================================================

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { useRicorrenze } from "@/context/RicorrenzeContext";
import { aggregaRicorrenzePerTipoEFrequenza, sommaTotaleAnnua } from "@/app/(protected)/ricorrenti/utils/ricorrenza-utils";
import type { UpcomingEntry } from "@/lib/api/upcomingApi";
import { eur } from "@/utils/formatCurrency";
import { formatShort, importoClass, simbolo } from "./ProssimiPagamentiCard";
import { HOME_CARD, HOME_SERIF, HOME_TITLE } from "../homeStyles";

const TIMELINE_ROWS = 3;

type Props = {
    entries: UpcomingEntry[];
    loading: boolean;
    error: string | null;
};

// ── Nome con ⇄ se ricorrente ───────────────────────────────
function label(entry: UpcomingEntry): string {
    const name = entry.description || "—";
    return entry.source === "ricorrenza" ? `⇄ ${name}` : name;
}

// ===============================
// Componente principale
// ===============================
export default function ProssimiCard({ entries, loading, error }: Props) {
    const { ricorrenze } = useRicorrenze();

    // ── Ricorrenze attive + equivalente mensile ────────
    const { attive, mensile } = useMemo(() => {
        const attive = ricorrenze.filter((r) => r.is_active);
        const agg = aggregaRicorrenzePerTipoEFrequenza(attive);
        const mensile = (sommaTotaleAnnua(agg.spesa) + sommaTotaleAnnua(agg.entrata)) / 12;
        return { attive: attive.length, mensile };
    }, [ricorrenze]);

    const [primo, ...resto] = entries;
    const timeline = resto.slice(0, TIMELINE_ROWS);
    const altri = resto.length - timeline.length;

    return (
        <div className={`${HOME_CARD} flex flex-col gap-1`}>
            {/* Titolo */}
            <Link href="/ricorrenti" className={`flex items-center gap-1.5 ${HOME_TITLE}`}>
                <CalendarCheck size={15} />
                Prossimi
            </Link>

            {/* Sottotitolo ricorrenti */}
            <Link href="/ricorrenti" className="font-mono text-[9px] tracking-[.08em] uppercase text-gray-400">
                ⇄ {attive} ricorrenti · {eur(mensile)}/mese
            </Link>

            {loading ? (
                <span className="text-xs text-gray-400 py-1">Caricamento prossimi pagamenti...</span>
            ) : error ? (
                <span className="text-xs text-red-500 py-1">{error}</span>
            ) : !primo ? (
                <Link href="/ricorrenti" className="text-xs text-gray-400 py-1">
                    Nessun pagamento imminente · <span className="text-primary">crea o modifica →</span>
                </Link>
            ) : (
                <>
                    {/* Prossimo pagamento in grande */}
                    <div className={`flex items-baseline gap-1 min-w-0 ${HOME_SERIF} text-[18px] font-bold ${importoClass(primo.type)}`}>
                        <span className="shrink-0">
                            {simbolo(primo.type)} {eur(primo.amount)} · {formatShort(primo.date)} ·
                        </span>
                        <span className="truncate" title={primo.description}>
                            {label(primo)}
                        </span>
                    </div>

                    {/* Timeline voci successive */}
                    {timeline.length > 0 && (
                        <ul className="flex flex-col">
                            {timeline.map((e) => (
                                <li
                                    key={`${e.source}-${e.type}-${e.id}`}
                                    className="flex items-center gap-2 py-[5px] border-b border-dashed border-gray-200 dark:border-zinc-700 text-[13px]"
                                >
                                    <span className="w-[34px] shrink-0 font-mono text-[10px] text-gray-400">
                                        {formatShort(e.date)}
                                    </span>
                                    <span className={`flex-1 truncate ${HOME_SERIF}`} title={e.description}>
                                        {label(e)}
                                    </span>
                                    <span className={`shrink-0 font-bold ${HOME_SERIF} ${importoClass(e.type)}`}>
                                        {simbolo(e.type)} {eur(e.amount)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Altri → dettagli e gestione */}
                    <Link href="/ricorrenti" className="pt-1 text-[12px] font-medium text-primary">
                        {altri > 0 ? `+${altri} altri →` : "Dettagli e gestione →"}
                    </Link>
                </>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Card "Prossimi" della Home mobile. Dati: entries da useUpcomingPayments
// (passati da HomePage, condivisi col calendario) e ricorrenze attive da
// RicorrenzeContext. Sottotitolo = n° ricorrenze attive + equivalente
// mensile (totale annuo con frequencyAnnualMultiplier / 12). In grande il
// pagamento più vicino (importo · data · nome), poi le 3 voci successive
// e "+N altri →" verso /ricorrenti. Il backend restituisce max 20 voci.
// ----------------------------------------------------------------------
