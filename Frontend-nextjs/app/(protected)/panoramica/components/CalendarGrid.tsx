// app/(protected)/panoramica/components/CalendarGrid.tsx
"use client";
import { Transaction } from "@/types/types/transaction";

type Props = {
    transactions: Transaction[];
};

export default function CalendarGrid({ transactions }: Props) {
    // Esempio: puoi usare transactions per colorare i giorni
    return (
        <div className="grid grid-cols-7 gap-2">
            {[...Array(30)].map((_, i) => (
                <div key={i} className="h-20 shadow rounded p-1">
                    Giorno {i + 1}
                    {/* esempio: mostra numero transazioni di quel giorno */}
                    <div className="text-xs mt-1 text-gray-500">
                        {transactions.filter((tx) => new Date(tx.date).getDate() === i + 1).length > 0 && (
                            <span>
                                {transactions.filter((tx) => new Date(tx.date).getDate() === i + 1).length} transazioni
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
