import { useMemo } from "react";
// ============================
// RicorrentiCard.tsx
// Card riepilogo ricorrenze, cliccabile
// ============================

import { Repeat } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { useRicorrenze } from "@/context/contexts/RicorrenzeContext";
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

export default function RicorrentiCard() {
    const { ricorrenze, loading } = useRicorrenze();

    const attive = useMemo(() => ricorrenze.filter((r) => !!r.is_active), [ricorrenze]);

    // Calcolo statistiche su quelle attive
    const totali = useMemo(() => {
        const totale = attive.length;
        const settimana = attive.filter((r) => isThisWeek(r.prossima)).length;
        const mese = attive.filter((r) => isThisMonth(r.prossima)).length;
        return { totale, settimana, mese };
    }, [attive]);

    if (loading)
        return (
            <LoadingSpinnerCard icon={<Repeat size={20} />} title="Ricorrenti" message="Caricamento ricorrenze..." />
        );

    return (
        <DashboardCard icon={<Repeat size={20} />} title="Ricorrenti" value={totali.totale} href="/ricorrenti">
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
