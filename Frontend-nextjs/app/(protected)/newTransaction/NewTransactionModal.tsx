"use client";

import Dialog from "@/app/components/ui/Dialog";
import NewTransactionForm from "./NewTransactionForm";
import { useTransactions } from "@/context/contexts/TransactionsContext";
import { useState } from "react";

export default function NewTransactionModal() {
    const { isOpen, closeModal, transactionToEdit, create, update } = useTransactions();
    const [loading, setLoading] = useState(false);

    // Handler: salva (crea o aggiorna)
    const handleSave = async (data: any) => {
        setLoading(true);
        try {
            if (transactionToEdit) await update(transactionToEdit.id, data);
            else await create(data);
        } finally {
            setLoading(false);
        }
    };

    // Per evitare errore TS sulle funzioni opzionali
    const safeClose = closeModal ?? (() => {});

    return (
        <Dialog
            open={isOpen}
            onClose={safeClose}
            title={transactionToEdit ? "Modifica Transazione" : "Aggiungi Transazione"}
        >
            {/* Spinner sopra la modale */}
            {loading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50 rounded-2xl">
                    <span className="text-4xl animate-bounce mb-3">💸</span>
                    <span className="text-white font-semibold text-lg text-center">
                        {transactionToEdit ? "Sto salvando la tua modifica…" : "Sto creando la nuova transazione!"}
                        <br />
                        <span className="text-sm text-zinc-300 flex items-center gap-1">
                            {transactionToEdit?.description
                                ? `"${transactionToEdit.description}"`
                                : "Un attimo di pazienza!"}
                            <span className="ml-2 flex space-x-1">
                                <span className="dot-pulse bg-zinc-300 rounded-full w-2 h-2 inline-block"></span>
                                <span className="dot-pulse bg-zinc-300 rounded-full w-2 h-2 inline-block"></span>
                                <span className="dot-pulse bg-zinc-300 rounded-full w-2 h-2 inline-block"></span>
                            </span>
                        </span>

                        <style jsx>{`
                            .dot-pulse {
                                animation: dotPulse 1.2s infinite;
                            }
                            .dot-pulse:nth-child(2) {
                                animation-delay: 0.2s;
                            }
                            .dot-pulse:nth-child(3) {
                                animation-delay: 0.4s;
                            }
                            @keyframes dotPulse {
                                0%,
                                80%,
                                100% {
                                    opacity: 0.2;
                                    transform: scale(1);
                                }
                                40% {
                                    opacity: 1;
                                    transform: scale(1.2);
                                }
                            }
                        `}</style>
                    </span>
                </div>
            )}

            {/* Il form */}
            <div className={loading ? "pointer-events-none opacity-50" : ""}>
                <NewTransactionForm
                    onSave={handleSave}
                    transaction={transactionToEdit ?? undefined}
                    disabled={loading}
                />
            </div>
        </Dialog>
    );
}
