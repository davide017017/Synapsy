// ============================
// TransactionDetailModal.tsx
// Modale dettaglio transazione (view + azioni)
// ============================

import React from "react";
import { Transaction } from "@/types/types/transaction";
import { X } from "lucide-react";

// Puoi tipizzare meglio le callback se vuoi
type Props = {
    transaction: Transaction;
    onClose: () => void;
    onEdit?: (t: Transaction) => void;
    onDelete?: (t: Transaction) => void;
    categories: Category[];
};
type Category = { name: string; id: number; type: string };

export default function TransactionDetailModal({ transaction, onClose, onEdit, onDelete }: Props) {
    if (!transaction) return null;

    // Per visualizzare la data in formato leggibile
    const dateStr = new Date(transaction.date).toLocaleDateString("it-IT");

    return (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
            {/* Modale vero e proprio */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-[90vw] max-w-md relative">
                {/* Close */}
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    onClick={onClose}
                    title="Chiudi"
                >
                    <X size={22} />
                </button>
                {/* Titolo */}
                <h2 className="text-xl font-bold mb-2">Dettaglio transazione</h2>
                {/* Info transazione */}
                <div className="space-y-2">
                    <div>
                        <span className="font-semibold">Importo:</span>{" "}
                        <span className={transaction.category?.type === "entrata" ? "text-green-600" : "text-red-600"}>
                            {transaction.category?.type === "entrata" ? "+" : "-"}
                            {transaction.amount?.toFixed(2)} €
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Descrizione:</span> {transaction.description}
                    </div>
                    <div>
                        <span className="font-semibold">Categoria:</span>{" "}
                        <span className="inline-block px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs">
                            {transaction.category?.name}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Data:</span> {dateStr}
                    </div>
                    {transaction.notes && (
                        <div>
                            <span className="font-semibold">Note:</span> {transaction.notes}
                        </div>
                    )}
                </div>
                {/* Azioni */}
                <div className="flex gap-3 mt-6 justify-end">
                    {onEdit && (
                        <button className="btn btn-sm btn-primary" onClick={() => onEdit(transaction)}>
                            Modifica
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="btn btn-sm btn-error"
                            onClick={() => {
                                if (confirm("Vuoi eliminare questa transazione?")) onDelete(transaction);
                            }}
                        >
                            Elimina
                        </button>
                    )}
                    <button className="btn btn-sm" onClick={onClose}>
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
}
