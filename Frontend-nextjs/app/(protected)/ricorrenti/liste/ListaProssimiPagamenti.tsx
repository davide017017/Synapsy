"use client";

// =======================================================
// ListaProssimiPagamenti.tsx
// Planner avanzato: tutte le occorrenze future entro 7/30 giorni
// (Colori utility Tailwind, pill frequenza a destra, lista compatta e leggibile!)
// =======================================================

import { Ricorrenza } from "@/types/types/ricorrenza";

// ===================== TIPI & COSTANTI =====================
type Props = { pagamenti: Ricorrenza[] };

const freqToDays: Record<string, number> = {
    Giornaliero: 1,
    giornaliero: 1,
    daily: 1,
    DAILY: 1,
    Settimanale: 7,
    settimanale: 7,
    weekly: 7,
    Weekly: 7,
    Mensile: 30,
    mensile: 30,
    monthly: 30,
    Monthly: 30,
    Bimestrale: 61,
    bimestrale: 61,
    Trimestrale: 92,
    trimestrale: 92,
    Semestrale: 183,
    semestrale: 183,
    Annuale: 365,
    annuale: 365,
    annually: 365,
    Annually: 365,
};

const freqToIt: Record<string, string> = {
    Giornaliero: "Giornaliera",
    giornaliero: "Giornaliera",
    daily: "Giornaliera",
    DAILY: "Giornaliera",
    Settimanale: "Settimanale",
    settimanale: "Settimanale",
    weekly: "Settimanale",
    Weekly: "Settimanale",
    Mensile: "Mensile",
    mensile: "Mensile",
    monthly: "Mensile",
    Monthly: "Mensile",
    Bimestrale: "Bimestrale",
    bimestrale: "Bimestrale",
    Trimestrale: "Trimestrale",
    trimestrale: "Trimestrale",
    Semestrale: "Semestrale",
    semestrale: "Semestrale",
    Annuale: "Annuale",
    annuale: "Annuale",
    annually: "Annuale",
    Annually: "Annuale",
};

const freqPillUtility: Record<string, string> = {
    Giornaliera:
        "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/60 dark:text-green-100 dark:border-green-700",
    Settimanale:
        "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/60 dark:text-blue-100 dark:border-blue-700",
    Mensile:
        "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/60 dark:text-amber-100 dark:border-amber-700",
    Bimestrale: "bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900/60 dark:text-cyan-100 dark:border-cyan-700",
    Trimestrale:
        "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/60 dark:text-violet-100 dark:border-violet-700",
    Semestrale: "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/60 dark:text-pink-100 dark:border-pink-700",
    Annuale:
        "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/60 dark:text-orange-100 dark:border-orange-700",
};

// ========================= UTILS =========================

// --------- Espande occorrenze tra due date ---------
function expandOccurrences(r: Ricorrenza, from: Date, to: Date) {
    const step = freqToDays[r.frequenza] ?? 30;
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
    const freqIt = freqToIt[frequenza] ?? frequenza;
    const pillClass =
        freqPillUtility[freqIt] ??
        "bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700/50 dark:text-gray-100 dark:border-gray-600";
    return { label: freqIt, className: pillClass };
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
