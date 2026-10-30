"use client";

// ╔══════════════════════════════════════════════════════╗
// ║ ListaProssimiPagamenti.tsx — gruppi 7 / 7-30 giorni ║
// ║ Header gruppo: titolo + bilancio a destra           ║
// ║ Righe dense condivise (RigaRicorrenza)              ║
// ╚══════════════════════════════════════════════════════╝

import type { ListaProssimiPagamentiProps, SectionOccorrenzeProps } from "@/types/ricorrenti/liste";
import RigaRicorrenza from "./RigaRicorrenza";
import { eur } from "@/utils/formatCurrency";

// ============================
// Helper: Colore pill bilancio
// ============================
function getBilancioUtility(bilancio: number) {
    if (bilancio > 0)
        return "text-[hsl(var(--c-total-positive-text))] bg-[hsl(var(--c-total-positive-bg))] border-[hsl(var(--c-total-positive-border))]";
    if (bilancio < 0)
        return "text-[hsl(var(--c-total-negative-text))] bg-[hsl(var(--c-total-negative-bg))] border-[hsl(var(--c-total-negative-border))]";
    return "text-[hsl(var(--c-total-neutral-text))] bg-[hsl(var(--c-total-neutral-bg))] border-[hsl(var(--c-total-neutral-border))]";
}

// ===========================================================
// Componente principale
// ===========================================================
export default function ListaProssimiPagamenti({
    filtro,
    occorrenze7,
    occorrenze30,
    bilancio7,
    bilancio30,
    onEdit,
    onDelete,
}: ListaProssimiPagamentiProps) {
    return (
        <div className="rounded-xl border border-primary/15 bg-black/20 backdrop-blur-sm">
            {filtro !== "mese" && (
                <SectionOccorrenze
                    title="7 giorni"
                    occorrenze={occorrenze7}
                    bilancio={bilancio7}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
            {filtro !== "settimana" && (
                <SectionOccorrenze
                    title="7-30 giorni"
                    occorrenze={occorrenze30}
                    bilancio={bilancio30}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
}

// ===========================================================
// SectionOccorrenze — header gruppo + righe
// ===========================================================
function SectionOccorrenze({ title, occorrenze, bilancio, onEdit, onDelete }: SectionOccorrenzeProps) {
    return (
        <section>
            <div className="flex h-7 items-center justify-between gap-2 border-b border-primary/10 bg-white/5 px-2">
                <h3 className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    {title}
                    <span className="ml-1.5 font-normal text-foreground/40">· {occorrenze.length}</span>
                </h3>
                <span
                    className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none tabular-nums ${getBilancioUtility(bilancio)}`}
                >
                    {bilancio >= 0 ? "+" : "–"}
                    {eur(Math.abs(bilancio))}
                </span>
            </div>
            <ul>
                {occorrenze.length === 0 ? (
                    <li className="py-2 text-center font-mono text-[10px] uppercase tracking-[0.10em] text-foreground/35">
                        Nessun pagamento.
                    </li>
                ) : (
                    occorrenze.map(({ ricorrenza: r, data }, i) => (
                        <RigaRicorrenza
                            key={r.id + "-" + data + "-" + i}
                            r={r}
                            data={data}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </ul>
        </section>
    );
}
