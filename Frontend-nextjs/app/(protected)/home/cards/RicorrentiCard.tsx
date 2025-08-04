import { useMemo } from "react";
import { Repeat } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { useRicorrenze } from "@/context/contexts/RicorrenzeContext";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useRenderTimer } from "@/app/(protected)/home/utils/useRenderTimer";

// ===============================
// Utility
// ===============================
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
function formatDataIt(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

// ===============================
// Componente principale
// ===============================
export default function RicorrentiCard() {
    useRenderTimer("RicorrentiCard");
    const { ricorrenze, loading } = useRicorrenze();

    const attive = useMemo(() => ricorrenze.filter((r) => !!r.is_active), [ricorrenze]);

    // Calcolo statistiche
    const totali = useMemo(() => {
        const totale = attive.length;
        const settimana = attive.filter((r) => isThisWeek(r.prossima)).length;
        const mese = attive.filter((r) => isThisMonth(r.prossima)).length;
        const anno = attive.filter((r) => isThisYear(r.prossima)).length;
        // Ricorrenza con prossima più vecchia
        const piuVecchia = attive.length
            ? [...attive].sort((a, b) => new Date(a.prossima).getTime() - new Date(b.prossima).getTime())[0]
            : null;
        return { totale, settimana, mese, anno, piuVecchia };
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
            <br />
            <span>
                <b>Quest’anno:</b> {totali.anno}
            </span>
            <hr className="my-2 border-t border-dashed border-zinc-400 dark:border-zinc-600" />
            {totali.piuVecchia && (
                <span>
                    <b>Ricorrenza attiva più vecchia:</b> {totali.piuVecchia.nome} —{" "}
                    {formatDataIt(totali.piuVecchia.prossima)}
                </span>
            )}
        </DashboardCard>
    );
}
