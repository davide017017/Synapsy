"use client";

// =======================================================
// RicorrentiPage.tsx
// Dashboard Ricorrenze (layout tabella densa) — usa context globale Ricorrenze
// Header → barra riepilogo → tab → lista → footer sticky
// =======================================================

import { useMemo, useState } from "react";
import { useRicorrenze } from "@/context/RicorrenzeContext";
import { useSidebar } from "@/context/SidebarContext";
import { Ricorrenza } from "@/types/models/ricorrenza";
import type { FiltroRicorrenti } from "@/types/ricorrenti/liste";
import CardTotaliAnnui from "./card/CardTotaliAnnui";
import ListaRicorrenzePerFrequenza from "./liste/ListaRicorrenzePerFrequenza";
import ListaProssimiPagamenti from "./liste/ListaProssimiPagamenti";
import RicorrentiPageSkeleton from "./skeleton/RicorrentiPageSkeleton";
import { freqToIt, normalizzaFrequenza, occorrenzePerFinestra, riepilogoTotali } from "./utils/ricorrenza-utils";
import { Repeat } from "lucide-react";
import NewRicorrenzaButton from "../newRicorrenza/NewRicorrenzaButton";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import { eur } from "@/utils/formatCurrency";

const TABS: { id: FiltroRicorrenti; label: string }[] = [
    { id: "tutti", label: "Tutti" },
    { id: "settimana", label: "7 giorni" },
    { id: "mese", label: "Dal 7 al 30" },
    { id: "frequenza", label: "Per freq." },
];

// Mini-card footer: testo + bordo dalla palette bilancio (--c-total-*), sfondo trasparente
function bilancioPillClass(val: number) {
    if (val > 0) return "text-[hsl(var(--c-total-positive-text))] border-[hsl(var(--c-total-positive-border))]";
    if (val < 0) return "text-[hsl(var(--c-total-negative-text))] border-[hsl(var(--c-total-negative-border))]";
    return "text-[hsl(var(--c-total-neutral-text))] border-[hsl(var(--c-total-neutral-border))]";
}

function firmato(val: number) {
    return `${val >= 0 ? "+" : "–"}${eur(Math.abs(val))}`;
}

// =======================================================
// COMPONENTE PRINCIPALE
// =======================================================
export default function RicorrentiPage() {
    // ----- UI State -----
    const [filtro, setFiltro] = useState<FiltroRicorrenti>("tutti");
    const [toDelete, setToDelete] = useState<Ricorrenza | null>(null);
    const [deleting, setDeleting] = useState(false);

    // ----- Dati dal context -----
    const { ricorrenze, loading, refresh, openModal, remove } = useRicorrenze();
    const { isCollapsed } = useSidebar();

    // ----- Occorrenze 7 / 7-30 giorni (stesse per lista e footer) -----
    const { occorrenze7, occorrenze30, bilancio7, bilancio30 } = useMemo(
        () => occorrenzePerFinestra(ricorrenze),
        [ricorrenze],
    );
    const { bilancioMensile } = useMemo(() => riepilogoTotali(ricorrenze), [ricorrenze]);


    // =======================================================
    // CALLBACK AZIONI
    // =======================================================
    const handleEdit = (ricorrenza: Ricorrenza) => {
        openModal(ricorrenza, refresh);
    };

    async function handleConfirmDelete() {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await remove(toDelete.id);
        } finally {
            setDeleting(false);
            setToDelete(null);
        }
    }

    // =======================================================
    // RENDER
    // =======================================================
    if (loading) return <RicorrentiPageSkeleton />;

    return (
        <div className="mx-auto max-w-3xl space-y-2 font-mono">
            {/* ───────── Header ───────── */}
            <div className="relative flex items-center justify-between overflow-hidden rounded-xl border border-primary/20 bg-black/55 px-3 py-1.5 backdrop-blur-xl animate-fade-in">
                <Repeat
                    className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-[hsl(var(--c-secondary))] opacity-5"
                    style={{ filter: "blur(2px)" }}
                />
                <h1 className="relative flex items-center gap-2 text-lg font-extrabold uppercase tracking-[0.14em] text-primary drop-shadow-[0_0_14px_hsl(var(--c-primary)/0.35)]">
                    <Repeat className="h-5 w-5" />
                    <span>Ricorrenti</span>
                </h1>
                <div className="relative">
                    <NewRicorrenzaButton />
                </div>
            </div>

            {/* ───────── Riepilogo (barra espandibile) ───────── */}
            <CardTotaliAnnui ricorrenze={ricorrenze} />

            {/* ───────── Tab filtro ───────── */}
            <div role="tablist" className="grid grid-cols-4 gap-0.5 rounded-xl border border-white/10 bg-white/5 p-0.5">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={filtro === tab.id}
                        onClick={() => setFiltro(tab.id)}
                        className={`h-7 truncate rounded-lg border px-1 text-[10px] uppercase tracking-[0.06em] transition-all duration-200 active:scale-95 ${
                            filtro === tab.id
                                ? "border-primary/35 bg-primary/15 text-primary shadow-[0_0_14px_hsl(var(--c-primary)/0.18)]"
                                : "border-transparent text-foreground/45 hover:bg-primary/10 hover:text-primary"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ───────── Lista (pb-20 → ultima riga non finisce sotto il footer fixed) ───────── */}
            <div className="pb-20">
                {filtro === "frequenza" ? (
                    <ListaRicorrenzePerFrequenza ricorrenze={ricorrenze} onEdit={handleEdit} onDelete={setToDelete} />
                ) : (
                    <ListaProssimiPagamenti
                        filtro={filtro}
                        occorrenze7={occorrenze7}
                        occorrenze30={occorrenze30}
                        bilancio7={bilancio7}
                        bilancio30={bilancio30}
                        onEdit={handleEdit}
                        onDelete={setToDelete}
                    />
                )}
            </div>

            {/* ───────── Footer fixed ─────────
                Mobile: bottom-[88px] = sopra BottomNav (bottom-4 + h-16 = 80px) + 8px
                Desktop: wrapper allineato all'area contenuto (sidebar md:pl-56 + p-4 main) */}
            <div
                className={`pointer-events-none fixed inset-x-4 bottom-[88px] z-20 md:bottom-4 ${isCollapsed ? "md:left-4" : "md:left-60"}`}
            >
                {/* SX: mini-card Settimana — DX: mini-card Saldo prominente (resta visibile se il + copre il centro) */}
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 font-mono">
                    <div
                        className={`pointer-events-auto shrink-0 rounded-lg border bg-transparent px-2 py-1 leading-tight backdrop-blur-sm shadow-[0_0_12px_rgba(0,0,0,0.16)] ${bilancioPillClass(bilancio7)}`}
                    >
                        <span className="block text-[8px] uppercase tracking-[0.12em] opacity-70">Settimana</span>
                        <span className="block text-[10px] text-muted-foreground">prossimi 7 gg</span>
                        <span className="block text-[11px] font-bold tabular-nums">{firmato(bilancio7)}</span>
                    </div>
                    <div
                        className={`pointer-events-auto shrink-0 rounded-xl border bg-transparent px-3 py-1 text-right leading-tight backdrop-blur-sm shadow-[0_0_14px_rgba(0,0,0,0.18)] ${bilancioPillClass(bilancioMensile)}`}
                    >
                        <span className="block text-[9px] uppercase tracking-[0.14em] opacity-70">Saldo</span>
                        <span className="block text-[10px] text-muted-foreground">netto/mese</span>
                        <span className="block text-base font-extrabold tabular-nums">{firmato(bilancioMensile)}</span>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={!!toDelete}
                type="delete"
                title="Vuoi davvero eliminare questa ricorrenza?"
                highlight={
                    toDelete && (
                        <div className="flex flex-col items-center">
                            <span className="italic">{toDelete.nome}</span>
                            {toDelete.importo && <span>{eur(toDelete.importo)}</span>}
                            {toDelete.categoria && <span>{toDelete.categoria}</span>}
                            {toDelete.frequenza && (
                                <span className="text-xs">{freqToIt[normalizzaFrequenza(toDelete.frequenza)]}</span>
                            )}
                        </div>
                    )
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => setToDelete(null)}
                loading={deleting}
            />
        </div>
    );
}
// =======================================================
// END RicorrentiPage.tsx
// =======================================================
