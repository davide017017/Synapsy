// app/(protected)/home/cards/RicorrentiCard.tsx
// ======================================================================
// Card riepilogo ricorrenze: legge dal RicorrenzeContext (no fetch locale)
// ======================================================================

"use client";

import { useMemo } from "react";
import { Repeat, ArrowRight } from "lucide-react";
import DashboardCard from "./DashboardCard";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useRicorrenze } from "@/context/RicorrenzeContext";
import { freqToIt } from "@/app/(protected)/ricorrenti/utils/ricorrenza-utils";
import { eur } from "@/utils/formatCurrency";

// Ordine canonico delle frequenze (stesso ordine/etichette IT di freqToIt)
const ORDINE_FREQUENZE = Object.keys(freqToIt) as (keyof typeof freqToIt)[];

// Forme minuscole singolare/plurale per il conteggio (es. "1 mensile" / "6 mensili").
// Nessun helper di pluralizzazione esiste altrove nel progetto: mapping locale.
const FREQ_LABEL_FORME: Record<keyof typeof freqToIt, { singolare: string; plurale: string }> = {
    daily: { singolare: "giornaliero", plurale: "giornalieri" },
    weekly: { singolare: "settimanale", plurale: "settimanali" },
    monthly: { singolare: "mensile", plurale: "mensili" },
    annually: { singolare: "annuale", plurale: "annuali" },
};

// ===============================
// Componente principale
// ===============================
export default function RicorrentiCard() {
    const { ricorrenze, loading } = useRicorrenze();

    // ── Solo ricorrenze attive ─────────────────────────
    const attive = useMemo(() => ricorrenze.filter((r) => r.is_active), [ricorrenze]);

    // ── KPI veloci ─────────────────────────────────────
    const { totale, righeFrequenza } = useMemo(() => {
        const totale = attive.length;

        // Conteggio + totale importo per frequenza in un solo passaggio su `attive`
        // (calcolaTotaliAnnuiPerFrequenza espone solo il totale, non il conteggio:
        // qui si aggregano insieme per evitare una seconda iterazione sui dati).
        const perFrequenza: Record<string, { count: number; totale: number }> = {};
        attive.forEach((r) => {
            if (!r.frequenza || typeof r.importo !== "number" || Number.isNaN(r.importo)) return;
            const bucket = perFrequenza[r.frequenza] ?? (perFrequenza[r.frequenza] = { count: 0, totale: 0 });
            bucket.count += 1;
            bucket.totale += r.importo;
        });

        // Frequenze note (daily/weekly/monthly/annually) nell'ordine canonico,
        // poi eventuali valori legacy/non mappati (se presenti nei dati) in coda.
        const note = ORDINE_FREQUENZE.filter((f) => perFrequenza[f] !== undefined).map((f) => {
            const { count, totale: totaleFreq } = perFrequenza[f];
            const forme = FREQ_LABEL_FORME[f];
            return {
                frequenza: f as string,
                label: count === 1 ? forme.singolare : forme.plurale,
                count,
                totale: totaleFreq,
            };
        });
        const extra = Object.keys(perFrequenza)
            .filter((f) => !ORDINE_FREQUENZE.includes(f as keyof typeof freqToIt))
            .map((f) => ({ frequenza: f, label: f, count: perFrequenza[f].count, totale: perFrequenza[f].totale }));

        return { totale, righeFrequenza: [...note, ...extra] };
    }, [attive]);

    // ── Loading ────────────────────────────────────────
    if (loading) {
        return (
            <LoadingSpinnerCard icon={<Repeat size={20} />} title="Ricorrenti" message="Caricamento ricorrenze..." />
        );
    }

    // ── Render ─────────────────────────────────────────
    return (
        <DashboardCard
            icon={<Repeat size={20} />}
            title="Ricorrenti"
            value={totale}
            href="/ricorrenti"
            footer={
                <span className="group inline-flex items-center gap-1 text-primary font-medium">
                    Gestisci ricorrenze
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
            }
        >
            <div className="flex flex-col gap-1">
                {righeFrequenza.map(({ frequenza, label, count, totale: importoTotale }) => (
                    <div key={frequenza} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-400">
                            {count} {label}
                        </span>
                        <span className="text-sm font-medium">{eur(importoTotale)}</span>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Card KPI ricorrenze. Usa RicorrenzeContext. Value grande = totale attive;
// corpo = una riga per frequenza attiva, formato "{count} {label sing/plur}"
// a sinistra e "{totale} €" a destra. Ordine canonico riusato da freqToIt
// (ricorrenti/utils/ricorrenza-utils.ts); conteggio+totale per frequenza e
// forme singolare/plurale delle label calcolati/mappati localmente (nessun
// helper equivalente esiste altrove nel progetto). Footer = solo CTA.
// ----------------------------------------------------------------------
