// app/(protected)/home/cards/TransazioniCard.tsx
// --------------------------------------------------
// CTA in footer senza <Link> (card già cliccabile)
// --------------------------------------------------

"use client";

import { useMemo } from "react";
import { BarChart2, ArrowRight } from "lucide-react";
import DashboardCard from "./DashboardCard";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useTransactions } from "@/context/TransactionsContext";
import { useRenderTimer } from "@/app/(protected)/home/utils/useRenderTimer";
import { isThisWeek, isThisMonth, isThisYear } from "@/utils/date";

export default function TransazioniCard() {
    useRenderTimer("TransazioniCard");
    const { transactions, loading, error } = useTransactions();

    const { totale, settimana, mese, anno, prima } = useMemo(() => {
        const totale = transactions.length;
        const settimana = transactions.filter((t) => isThisWeek(t.date)).length;
        const mese = transactions.filter((t) => isThisMonth(t.date)).length;
        const anno = transactions.filter((t) => isThisYear(t.date)).length;
        const prima = transactions.length
            ? [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
            : null;
        return { totale, settimana, mese, anno, prima };
    }, [transactions]);

    if (loading)
        return (
            <LoadingSpinnerCard
                icon={<BarChart2 size={20} />}
                title="Transazioni"
                message="Caricamento transazioni..."
            />
        );
    if (error)
        return (
            <DashboardCard icon={<BarChart2 size={20} />} title="Transazioni">
                <p className="text-red-500 text-sm">{error}</p>
            </DashboardCard>
        );

    return (
        <DashboardCard
            icon={<BarChart2 size={20} />}
            title="Transazioni"
            href="/transazioni"
            footer={
                <span className="group inline-flex items-center gap-1 text-primary font-medium">
                    {totale} movimenti • clicca per aprire
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
            }
        >
            <ul className="space-y-1 text-sm">
                <li>
                    Totali: <b>{totale}</b>
                </li>
                <li>
                    Questa settimana: <b>{settimana}</b>
                </li>
                <li>
                    Questo mese: <b>{mese}</b>
                </li>
                <li>
                    Quest&rsquo;anno: <b>{anno}</b>
                </li>

                <hr className="my-2 border-t border-dashed border-zinc-400 dark:border-zinc-600" />
                {prima && <li className="text-xs text-zinc-500">Prima transazione: {prima.date}</li>}
            </ul>
        </DashboardCard>
    );
}

// --------------------------------------------------
// Descrizione file:
// Footer con CTA descrittiva (no <Link>) per evitare anchor annidati
// visto che l’intera card è già cliccabile via href.
// --------------------------------------------------
