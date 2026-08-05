// app/(protected)/home/cards/ProssimiPagamentiCard.tsx
// ======================================================================
// Card: lista compatta dei prossimi pagamenti/incassi.
// Unisce ricorrenze + spese/entrate manuali con data futura (endpoint
// /api/v1/financialoverview/upcoming). Fetch diretto (no context),
// stesso pattern di autenticazione usato dai *Context esistenti.
// ======================================================================

"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CalendarCheck, ArrowRight, Repeat } from "lucide-react";
import DashboardCard from "./DashboardCard";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { fetchUpcomingPayments, UpcomingEntry } from "@/lib/api/upcomingApi";
import { parseYMD } from "@/lib/finance";
import { eur } from "@/utils/formatCurrency";

const LIMIT = 8;

// ── Formattazione date (parseYMD, no shift di fuso) ────────
function formatFull(dateStr: string): string {
    return parseYMD(dateStr).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
}
function formatShort(dateStr: string): string {
    return parseYMD(dateStr).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
}

// ── Helpers stile per tipo (spesa/entrata) ─────────────────
function importoClass(type: UpcomingEntry["type"]): string {
    return type === "spesa" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400";
}
function simbolo(type: UpcomingEntry["type"]): string {
    return type === "spesa" ? "−" : "+";
}

// ===============================
// Componente principale
// ===============================
export default function ProssimiPagamentiCard() {
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;

    const [entries, setEntries] = useState<UpcomingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        const controller = new AbortController();

        setLoading(true);
        setError(null);

        fetchUpcomingPayments(token, 30, LIMIT, controller.signal)
            .then(setEntries)
            .catch((e: any) => {
                if (e?.name === "AbortError") return;
                if (e?.message === "Unauthorized") {
                    signOut({ callbackUrl: "/login" });
                    return;
                }
                setError(e?.message || "Errore caricamento prossimi pagamenti");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [token]);

    // ── Loading ────────────────────────────────────────
    if (loading) {
        return (
            <LoadingSpinnerCard
                icon={<CalendarCheck size={20} />}
                title="Prossimi pagamenti"
                message="Caricamento prossimi pagamenti..."
            />
        );
    }

    // ── Error ──────────────────────────────────────────
    if (error) {
        return (
            <DashboardCard icon={<CalendarCheck size={20} />} title="Prossimi pagamenti">
                <p className="text-red-500 text-sm">{error}</p>
            </DashboardCard>
        );
    }

    // ── Empty state ─────────────────────────────────────
    if (entries.length === 0) {
        return (
            <DashboardCard
                icon={<CalendarCheck size={20} />}
                title="Prossimi pagamenti"
                value="—"
                href="/ricorrenti"
                footer={
                    <span className="group inline-flex items-center gap-1 text-primary font-medium">
                        Nessun pagamento imminente • crea o modifica
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                }
            >
                <span className="text-xs text-gray-400">
                    Aggiungi una ricorrenza o una spesa/entrata futura per vederla qui
                </span>
            </DashboardCard>
        );
    }

    // ── Dati formattati (primo elemento + resto compatto) ──
    const [primo, ...resto] = entries;

    // ── Render ─────────────────────────────────────────
    return (
        <DashboardCard
            icon={<CalendarCheck size={20} />}
            title="Prossimi pagamenti"
            value={formatFull(primo.date)}
            href="/ricorrenti"
            footer={
                <span className="group inline-flex items-center gap-1 text-primary font-medium">
                    Dettagli e gestione
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
            }
        >
            {/* Primo elemento: descrizione + importo (data già nel value grande) */}
            <div className="flex items-center gap-1">
                <b className="truncate" title={primo.description}>
                    {primo.description || "—"}
                </b>
                {primo.source === "ricorrenza" && (
                    <Repeat size={12} className="text-primary shrink-0" aria-label="Ricorrente" />
                )}
            </div>
            <div className={`font-semibold ${importoClass(primo.type)}`}>
                {simbolo(primo.type)} {eur(primo.amount)}
            </div>
            {primo.category_name && <div className="opacity-70">{primo.category_name}</div>}

            {/* Resto della lista: righe compatte */}
            {resto.length > 0 && (
                <ul className="mt-2 space-y-1">
                    {resto.map((e) => (
                        <li key={`${e.source}-${e.type}-${e.id}`}>
                            <UpcomingRow entry={e} />
                        </li>
                    ))}
                </ul>
            )}
        </DashboardCard>
    );
}

// ===============================
// Riga compatta (elementi dal 2° in poi)
// Ispirata a RicorrenzaItem.tsx: bordo sinistro colorato,
// data breve, descrizione troncata, importo colorato.
// ===============================
function UpcomingRow({ entry }: { entry: UpcomingEntry }) {
    const borderClass = entry.type === "spesa" ? "border-l-red-400/70" : "border-l-emerald-400/70";

    return (
        <div
            className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-md border-l-4 ${borderClass} bg-black/[.02] dark:bg-white/[.04]`}
        >
            <span className="shrink-0 font-mono text-[10px] text-gray-400">{formatShort(entry.date)}</span>
            <span className="truncate flex-1" title={entry.description}>
                {entry.description || "—"}
            </span>
            {entry.source === "ricorrenza" && (
                <Repeat size={11} className="shrink-0 text-primary" aria-label="Ricorrente" />
            )}
            <span className={`shrink-0 font-semibold ${importoClass(entry.type)}`}>
                {simbolo(entry.type)} {eur(entry.amount)}
            </span>
        </div>
    );
}

// ----------------------------------------------------------------------
// Descrizione file:
// Lista compatta dei prossimi pagamenti/incassi (ricorrenze + spese/
// entrate manuali future). Primo elemento in evidenza (stile `value`
// grande di DashboardCard), resto in righe compatte con bordo colorato.
// ----------------------------------------------------------------------
