"use client";

import { useNewTransaction } from "@/context/contexts/NewTransactionContext";
import { BarChart2, CalendarCheck, Repeat, FolderOpen } from "lucide-react";
import NewTransactionButton from "../newTransaction/NewTransactionButton";
import NewRicorrenzaButton from "../newRicorrenza/NewRicorrenzaButton";

export default function HomePage() {
    const { open } = useNewTransaction();
    // Dati fittizi da sostituire con query API / hooks
    const stats = [
        { label: "Transazioni", value: 42, icon: <BarChart2 size={24} /> },
        { label: "Ricorrenti", value: 5, icon: <Repeat size={24} /> },
        { label: "Categorie", value: 8, icon: <FolderOpen size={24} /> },
        { label: "Prossimo pagamento", value: "15/06/2025", icon: <CalendarCheck size={24} /> },
    ];

    return (
        <div className="space-y-6">
            {/* Titolo e descrizione */}
            <h1 className="text-2xl font-bold">🏠 Dash</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Benvenuto su Synapsi! Qui trovi un riepilogo rapido delle tue finanze.
            </p>

            {/* Griglia di statistiche */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <NewTransactionButton />
                <NewRicorrenzaButton />
                {stats.map(({ label, value, icon }) => (
                    <div
                        key={label}
                        className="flex flex-col items-center justify-center py-4 rounded-lg bg-white/20 dark:bg-zinc-800 shadow"
                    >
                        {icon}
                        <span className="mt-2 text-xl font-semibold">{value}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
