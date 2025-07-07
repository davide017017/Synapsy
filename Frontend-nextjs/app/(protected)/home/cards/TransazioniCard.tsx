import { useEffect, useState, useMemo } from "react";
// ============================
// TransazioniCard.tsx
// Card riepilogo transazioni, cliccabile per dettaglio
// ============================

import { BarChart2 } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { fetchTransactions } from "@/lib/api/transactionsApi";
import { Transaction } from "@/types/types/transaction";
import { useSession } from "next-auth/react";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";

// --------- Utility date per settimana/mese ---------
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

// --------- Componente principale ---------
export default function TransazioniCard() {
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

    const totali = useMemo(() => {
        const totale = transactions.length;
        const settimana = transactions.filter((t) => isThisWeek(t.date)).length;
        const mese = transactions.filter((t) => isThisMonth(t.date)).length;
        return { totale, settimana, mese };
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
            <DashboardCard
                icon={<BarChart2 size={20} />}
                title="Transazioni"
                value="-"
                href="/panoramica" // <- qui la rendi cliccabile!
            >
                {error}
            </DashboardCard>
        );

    return (
        <DashboardCard
            icon={<BarChart2 size={20} />}
            title="Transazioni"
            value={totali.totale}
            href="/panoramica" // <- cliccabile!
        >
            <span>
                <b>Questa settimana:</b> {totali.settimana}
            </span>
            <br />
            <span>
                <b>Questo mese:</b> {totali.mese}
            </span>
        </DashboardCard>
    );
}
