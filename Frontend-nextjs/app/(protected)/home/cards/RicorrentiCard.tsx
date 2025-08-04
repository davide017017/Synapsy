import { useMemo } from "react";
import { Repeat } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { useRicorrenze } from "@/context/contexts/RicorrenzeContext";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useRenderTimer } from "@/app/(protected)/home/utils/useRenderTimer";
import { formatDataIt, isThisWeek, isThisMonth, isThisYear } from "@/utils/date";

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
        // Basata su "prossima" in assenza della data di creazione effettiva
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
