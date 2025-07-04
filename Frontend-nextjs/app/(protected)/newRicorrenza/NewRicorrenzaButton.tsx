import { useRicorrenze } from "@/context/contexts/RicorrenzeContext";
import { PlusCircle } from "lucide-react";
import { Ricorrenza } from "@/types/types/ricorrenza";

type Props = {
    label?: string;
    onSuccess?: (newRicorrenza: Ricorrenza) => void; // tipizza bene
};

export default function NewRicorrenzaButton({ label = "Nuova Ricorrenza", onSuccess }: Props) {
    const { openModal } = useRicorrenze();
    return (
        <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-dark text-bg hover:opacity-90 text-sm font-medium transition shadow-lg active:scale-95"
            // Chiamata corretta: undefined come primo argomento (per nuova)
            onClick={() => openModal(undefined, onSuccess)}
        >
            <PlusCircle size={16} />
            {label}
        </button>
    );
}
