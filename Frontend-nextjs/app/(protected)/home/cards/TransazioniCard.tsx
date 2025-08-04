import { useEffect, useState, useMemo } from "react";
// ============================
// TransazioniCard.tsx
// Card riepilogo transazioni, cliccabile per dettaglio
// ============================
import { BarChart2 } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { fetchTransactions } from "@/lib/api/transactionsApi";
import { Transaction } from "@/types/models/transaction";
import { useSession } from "next-auth/react";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useRenderTimer } from "@/app/(protected)/home/utils/useRenderTimer"; // Debug per vedere quanto tempo ci mette a rtenderizzare

// ======================================================================
// Utility: Formatta la data in italiano leggibile (es: 23 luglio 2024)
// ======================================================================
function formatDataIt(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

// ======================================================================
// Utility date per settimana, mese e anno
// ======================================================================
function isThisWeek(dateStr: string) {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    const date = new Date(dateStr);
    return date >= start && date < end;
}

function isThisMonth(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function isThisYear(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    return date.getFullYear() === now.getFullYear();
}

// ======================================================================
// Componente principale
// ======================================================================
export default function TransazioniCard() {
    useRenderTimer("TransazioniCard"); // Debug per vedere quanto tempo ci mette a rtenderizzare
    const { data: session } = useSession();
    const token = session?.accessToken;

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetchTransactions(token)
            .then(setTransactions)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [token]);

    // ======================================================================
    // Calcolo totali e prima transazione
    // ======================================================================
    const totali = useMemo(() => {
        const totale = transactions.length;
        const settimana = transactions.filter((t) => isThisWeek(t.date)).length;
        const mese = transactions.filter((t) => isThisMonth(t.date)).length;
        const anno = transactions.filter((t) => isThisYear(t.date)).length;
        // Prima transazione per data crescente
        const prima = transactions.length
            ? [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
            : null;
        return { totale, settimana, mese, anno, prima };
    }, [transactions]);

    if (!token) return null;

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
            <DashboardCard icon={<BarChart2 size={20} />} title="Transazioni" value="-" href="/panoramica">
                {error}
            </DashboardCard>
        );

    // ======================================================================
    // Render principale
    // ======================================================================
    return (
        <DashboardCard icon={<BarChart2 size={20} />} title="Transazioni" value={totali.totale} href="/panoramica">
            <span>
                <b>Questa settimana:</b> {totali.settimana}
            </span>
            <br />
            <span>
                <b>Questo mese:</b> {totali.mese}
            </span>
            <br />
            <span>
                <b>Quest’anno:</b> {totali.anno}
            </span>
            {/* ======================= */}
            {/* Linea divisoria elegante */}
            {/* ======================= */}
            <hr className="my-2 border-t border-dashed border-zinc-400 dark:border-zinc-600" />

            {totali.prima && (
                <span>
                    <b>Prima transazione:</b> {formatDataIt(totali.prima.date)}
                    {/* Se vuoi mostrare anche la descrizione: */}
                    {/*  — {totali.prima.description} */}
                </span>
            )}
        </DashboardCard>
    );
}
