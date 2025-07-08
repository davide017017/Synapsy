"use client";

// =======================================================
// ListaProssimiPagamenti.tsx
// Planner avanzato: tutte le occorrenze future entro 7/30 giorni
// (Colori utility Tailwind, frequenza normalizzata, lista compatta)
// =======================================================

import { Ricorrenza } from "@/types/types/ricorrenza";
import { normalizzaFrequenza, freqToIt, freqPillUtility, freqToDays } from "../utils/ricorrenza-utils";

// ===================== TIPI & COSTANTI =====================
type Props = { pagamenti: Ricorrenza[] };

// ========================= UTILS =========================

// --------- Espande occorrenze tra due date ---------
function expandOccurrences(r: Ricorrenza, from: Date, to: Date) {
    const freqNorm = normalizzaFrequenza(r.frequenza);
    const step = freqToDays[freqNorm] ?? 30;
    const occs: { ricorrenza: Ricorrenza; data: string }[] = [];
    let current = new Date(r.prossima);

    if (current < from) {
        const diffDays = Math.ceil((from.getTime() - current.getTime()) / (1000 * 3600 * 24));
        const multipli = Math.ceil(diffDays / step);
        current.setDate(current.getDate() + multipli * step);
    }
    while (current <= to) {
        occs.push({ ricorrenza: r, data: current.toISOString().slice(0, 10) });
        current.setDate(current.getDate() + step);
    }
    return occs;
}

// --------- Bilancio totale ---------
function calcolaBilancio(arr: { ricorrenza: Ricorrenza; data: string }[]) {
    return arr.reduce(
        (sum, occ) => sum + (occ.ricorrenza.type === "entrata" ? 1 : -1) * (occ.ricorrenza.importo ?? 0),
        0
    );
}

// --------- Utility per colore bilancio ---------
function getBilancioUtility(bilancio: number) {
    if (bilancio > 0)
        return "text-green-600 bg-green-100 border-green-400 dark:bg-green-800/40 dark:text-green-200 dark:border-green-500";
    if (bilancio < 0)
        return "text-red-600 bg-red-100 border-red-400 dark:bg-red-800/40 dark:text-red-200 dark:border-red-500";
    return "text-gray-700 bg-gray-100 border-gray-300 dark:bg-gray-800/40 dark:text-gray-100 dark:border-gray-600";
}

// --------- Utility righe (contrasto ok in dark) ---------
function getRowUtility(type: string) {
    return type === "entrata"
        ? "bg-green-50 dark:bg-green-900/40 border-green-100 dark:border-green-800"
        : "bg-red-50 dark:bg-red-900/40 border-red-100 dark:border-red-800";
}

// --------- Prende label IT e colore pill ---------
function getFreqPill(frequenza: string) {
    const freqNorm = normalizzaFrequenza(frequenza);
    const freqItLabel = freqToIt[freqNorm] ?? frequenza;
    const pillClass =
        freqPillUtility[freqItLabel] ??
        "bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700/50 dark:text-gray-100 dark:border-gray-600";
    return { label: freqItLabel, className: pillClass };
}

// ==================== COMPONENTE PRINCIPALE ====================
export default function ListaProssimiPagamenti({ pagamenti }: Props) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekTo = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
    const monthTo = new Date(today.getTime() + 29 * 24 * 60 * 60 * 1000);

    let occorrenze7: { ricorrenza: Ricorrenza; data: string }[] = [];
    let occorrenze30: { ricorrenza: Ricorrenza; data: string }[] = [];
    for (const ric of pagamenti) {
        occorrenze7 = occorrenze7.concat(expandOccurrences(ric, today, weekTo));
        occorrenze30 = occorrenze30.concat(
            expandOccurrences(ric, new Date(weekTo.getTime() + 24 * 60 * 60 * 1000), monthTo)
        );
    }
    occorrenze7.sort((a, b) => a.data.localeCompare(b.data));
    occorrenze30.sort((a, b) => a.data.localeCompare(b.data));

    const bilancio7 = calcolaBilancio(occorrenze7);
    const bilancio30 = calcolaBilancio(occorrenze30);

    return (
        <div className="flex flex-col gap-4">
            {/* ======= Prossimi 7 giorni ======= */}
            <SectionOccorrenze title="Prossimi 7 giorni" occorrenze={occorrenze7} bilancio={bilancio7} />
            {/* ======= Prossimi 30 giorni ======= */}
            <SectionOccorrenze title="Prossimi 30 giorni" occorrenze={occorrenze30} bilancio={bilancio30} />
        </div>
    );
}

// =============== SectionOccorrenze: Blocco Lista Singolo ===============
function SectionOccorrenze({
    title,
    occorrenze,
    bilancio,
}: {
    title: string;
    occorrenze: { ricorrenza: Ricorrenza; data: string }[];
    bilancio: number;
}) {
    return (
        <div>
            {/* --- Intestazione --- */}
            <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{title}</h3>
                <span
                    className={`ml-2 px-2 py-0.5 rounded-lg text-xs font-bold border ${getBilancioUtility(bilancio)}`}
                    title="Bilancio entrate - spese"
                >
                    Bilancio: {bilancio >= 0 ? "+" : "–"}€{Math.abs(bilancio).toFixed(2)}
                </span>
            </div>
            {/* --- Lista occorrenze --- */}
            <ul className="divide-y divide-gray-100 dark:divide-gray-700 ">
                {occorrenze.length === 0 ? (
                    <li className="text-gray-400 italic py-2 text-xs">Nessun pagamento.</li>
                ) : (
                    occorrenze.map(({ ricorrenza: r, data }, i) => {
                        const { label, className } = getFreqPill(r.frequenza);
                        return (
                            <li
                                key={r.id + "-" + data + "-" + i}
                                className={`mb-1 rounded-lg flex items-center justify-between px-1 py-1 min-h-[28px] ${getRowUtility(
                                    r.type
                                )}`}
                            >
                                {/* Data e nome (contrasto migliorato) */}
                                <div className="flex items-center min-w-0 gap-2">
                                    <span className="font-mono text-[11px] text-gray-800 dark:text-gray-200 w-12 text-right">
                                        {new Date(data).toLocaleDateString("it-IT", {
                                            day: "2-digit",
                                            month: "2-digit",
                                        })}
                                    </span>
                                    <span className="truncate font-medium text-xs text-gray-800 dark:text-gray-100 max-w-[11rem]">
                                        {r.nome}
                                    </span>
                                </div>
                                {/* Importo e pill allineati a destra */}
                                <div className="flex items-center gap-2 min-w-fit pl-1">
                                    <span
                                        className={`font-mono text-sm font-semibold ${
                                            r.type === "entrata"
                                                ? "text-green-700 dark:text-green-200"
                                                : "text-red-700 dark:text-red-200"
                                        }`}
                                        style={{ minWidth: 60, textAlign: "right" }}
                                    >
                                        {r.type === "entrata" ? "+" : "–"}€{(r.importo ?? 0).toFixed(2)}
                                    </span>
                                    {/* Pill frequenza */}
                                    <span
                                        className={`px-2 py-0.5 rounded-full border text-[10px] font-medium whitespace-nowrap ${className} border border-gray-300 dark:border-gray-600`}
                                        style={{ minWidth: 72, textAlign: "center" }}
                                    >
                                        {label}
                                    </span>
                                </div>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
}

// =================== END ListaProssimiPagamenti.tsx ===================
