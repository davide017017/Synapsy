import { CalendarCheck } from "lucide-react";
// ============================
// ProssimoPagamentoCard.tsx
// Card prossimo pagamento ricorrente, cliccabile
// ============================

import DashboardCard from "./DashboardCard";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useRicorrenze } from "@/context/contexts/RicorrenzeContext";
import { useRenderTimer } from "@/app/(protected)/home/utils/useRenderTimer"; // Debug per vedere quanto tempo ci mette a rtenderizzare

export default function ProssimoPagamentoCard() {
    useRenderTimer("TransazioniCard"); // Debug per vedere quanto tempo ci mette a rtenderizzare
    const { ricorrenze, loading } = useRicorrenze();

    if (loading)
        return (
            <LoadingSpinnerCard
                icon={<CalendarCheck size={20} />}
                title="Prossimo pagamento"
                message="Caricamento prossimo pagamento..."
            />
        );

    // Filtro: solo attive e con prossima >= oggi
    const oggi = new Date();
    const future = ricorrenze
        .filter((r) => !!r.is_active && new Date(r.prossima) >= oggi)
        .sort((a, b) => new Date(a.prossima).getTime() - new Date(b.prossima).getTime());

    const prossimo = future[0];

    if (!prossimo) {
        return (
            <DashboardCard icon={<CalendarCheck size={20} />} title="Prossimo pagamento" value="—" href="/ricorrenti">
                <span className="text-xs text-gray-400">Nessuna ricorrenza imminente</span>
            </DashboardCard>
        );
    }

    // Formatto la data
    const data = new Date(prossimo.prossima).toLocaleDateString("it-IT");
    const importo = Math.abs(prossimo.importo).toFixed(2);
    const nome = prossimo.nome || "—";

    // Stile colore importo e simbolo
    const isSpesa = prossimo.type === "spesa";
    const importoClass = isSpesa ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400";
    const simbolo = isSpesa ? "−" : "+";

    return (
        <DashboardCard icon={<CalendarCheck size={20} />} title="Prossimo pagamento" value={data} href="/ricorrenti">
            <b>{nome}</b>
            <br />
            Importo:{" "}
            <span className={`font-semibold ${importoClass}`}>
                {simbolo} € {importo}
            </span>
        </DashboardCard>
    );
}

