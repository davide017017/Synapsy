// app/(protected)/newTransaction/NewTransactionButton.tsx
"use client";

import { PlusCircle } from "lucide-react";
import { useNewTransaction } from "@/context/contexts/NewTransactionContext";
import { Transaction } from "@/types";

type Props = {
    /** Testo del bottone */
    label?: string;
    /** Callback da eseguire dopo il create (ottimistic update) */
    onSuccess?: (newTx: Transaction) => void;
};

export default function NewTransactionButton({ label = "Nuova Transazione", onSuccess }: Props) {
    const { open } = useNewTransaction();

    return (
        <button
            onClick={() => open(onSuccess)} // ← passa onSuccess al context
            className="
                    inline-flex items-center gap-2
                    px-3 py-1.5 rounded-xl
                    bg-primary-dark active:bg-primary
                    text-bg hover:opacity-90
                    text-sm font-medium transition
                    shadow-lg shadow-black hover:shadow-md active:scale-95
            "
        >
            <PlusCircle size={16} />
            {label}
        </button>
    );
}
