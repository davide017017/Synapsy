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
import { useRenderTimer } from "@/app/(protected)/home/utils/useRenderTimer"; // Debug per vedere quanto tempo ci mette a renderizzare
import { formatDataIt, isThisWeek, isThisMonth, isThisYear } from "@/utils/date";

// ======================================================================
// Componente principale
// ======================================================================
export default function TransazioniCard() {
    useRenderTimer("TransazioniCard"); // Debug per vedere quanto tempo ci mette a renderizzare
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
            <DashboardCard icon={<BarChart2 size={20} />} title="Transazioni" value="-" href="/transazioni">
                {error}
            </DashboardCard>
        );

    // ======================================================================
    // Render principale
    // ======================================================================
    return (
        <DashboardCard icon={<BarChart2 size={20} />} title="Transazioni" value={totali.totale} href="/transazioni">
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
