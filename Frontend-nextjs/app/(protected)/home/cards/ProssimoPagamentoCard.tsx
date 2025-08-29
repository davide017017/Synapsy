// app/(protected)/home/cards/ProssimoPagamentoCard.tsx
// ======================================================================
// Card: prossimo pagamento ricorrente. Legge da RicorrenzeContext.
// ======================================================================

"use client";

import { CalendarCheck, ArrowRight } from "lucide-react";
import DashboardCard from "./DashboardCard";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useRicorrenze } from "@/context/RicorrenzeContext";
import { useRenderTimer } from "@/app/(protected)/home/utils/useRenderTimer";
import { formatDataIt } from "@/utils/date";
import { eur } from "@/utils/formatCurrency";

// ===============================
// Componente principale
// ===============================
export default function ProssimoPagamentoCard() {
    useRenderTimer("ProssimoPagamentoCard");
    const { ricorrenze, loading } = useRicorrenze();

    // ── Loading ────────────────────────────────────────
    if (loading) {
        return (
            <LoadingSpinnerCard
                icon={<CalendarCheck size={20} />}
                title="Prossimo pagamento"
                message="Caricamento prossimo pagamento..."
            />
        );
    }

    // ── Filtro: attive con prossima >= oggi ────────────
    const oggi = new Date();
    const future = ricorrenze
        .filter((r) => r.is_active && new Date(r.prossima) >= oggi)
        .sort((a, b) => new Date(a.prossima).getTime() - new Date(b.prossima).getTime());

    const prossimo = future[0];

    // ── Empty state ─────────────────────────────────────
    if (!prossimo) {
        return (
            <DashboardCard
                icon={<CalendarCheck size={20} />}
                title="Prossimo pagamento"
                value="—"
                href="/ricorrenti"
                footer={
                    <span className="group inline-flex items-center gap-1 text-primary font-medium">
                        Nessuna ricorrenza imminente • crea o modifica
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                }
            >
                <span className="text-xs text-gray-400">Aggiungi una ricorrenza per vederla qui</span>
            </DashboardCard>
        );
    }

    // ── Dati formattati ─────────────────────────────────
    const data = formatDataIt(prossimo.prossima);
    const isSpesa = prossimo.type === "spesa";
    const importoAbs = Math.abs(Number(prossimo.importo) || 0);
    const importoTxt = eur(importoAbs);
    const importoClass = isSpesa ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400";
    const simbolo = isSpesa ? "−" : "+";
    const nome = prossimo.nome || "—";

    // ── Render ─────────────────────────────────────────
    return (
        <DashboardCard
            icon={<CalendarCheck size={20} />}
            title="Prossimo pagamento"
            value={data}
            href="/ricorrenti"
            footer={
                <span className="group inline-flex items-center gap-1 text-primary font-medium">
                    Dettagli e gestione
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
            }
        >
            <b>{nome}</b>
            <br />
            Importo:{" "}
            <span className={`font-semibold ${importoClass}`}>
                {simbolo} {importoTxt}
            </span>
        </DashboardCard>
    );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Card che mostra il prossimo pagamento ricorrente (se presente).
// Footer con CTA descrittiva; formattazione € e data coerenti.
// ----------------------------------------------------------------------
