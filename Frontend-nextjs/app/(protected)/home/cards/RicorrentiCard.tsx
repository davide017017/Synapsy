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
import { useRenderTimer } from "@/app/(protected)/home/utils/useRenderTimer";
import { formatDataIt, isThisWeek, isThisMonth, isThisYear } from "@/utils/date";

// ===============================
// Componente principale
// ===============================
export default function RicorrentiCard() {
    useRenderTimer("RicorrentiCard");
    const { ricorrenze, loading } = useRicorrenze();

    // ── Solo ricorrenze attive ─────────────────────────
    const attive = useMemo(() => ricorrenze.filter((r) => r.is_active), [ricorrenze]);

    // ── KPI veloci ─────────────────────────────────────
    const { totale, settimana, mese, anno, piuVecchia } = useMemo(() => {
        const totale = attive.length;
        const settimana = attive.filter((r) => isThisWeek(r.prossima)).length;
        const mese = attive.filter((r) => isThisMonth(r.prossima)).length;
        const anno = attive.filter((r) => isThisYear(r.prossima)).length;

        const piuVecchia = attive.length
            ? [...attive].sort((a, b) => new Date(a.prossima).getTime() - new Date(b.prossima).getTime())[0]
            : null;

        return { totale, settimana, mese, anno, piuVecchia };
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
                    {totale} attive • clicca per gestirle
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
            }
        >
            <ul className="space-y-1 text-sm">
                <li>
                    Questa settimana: <b>{settimana}</b>
                </li>
                <li>
                    Questo mese: <b>{mese}</b>
                </li>
                <li>
                    Quest’anno: <b>{anno}</b>
                </li>
                <hr className="my-2 border-t border-dashed border-zinc-400 dark:border-zinc-600" />
                {piuVecchia && (
                    <li className="text-xs text-zinc-500">
                        Attiva più vecchia: <b>{piuVecchia.nome}</b> — {formatDataIt(piuVecchia.prossima)}
                    </li>
                )}
            </ul>
        </DashboardCard>
    );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Card KPI ricorrenze. Usa RicorrenzeContext, mostra conteggi e una CTA
// descrittiva nel footer (card intera cliccabile).
// ----------------------------------------------------------------------
