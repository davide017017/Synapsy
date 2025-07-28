"use client";

import Dialog from "@/app/components/ui/Dialog";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/types/models/transaction";
import { useTransactions } from "@/context/contexts/TransactionsContext";

export type DayTransactionsModalProps = {
    open: boolean;
    onClose: () => void;
    date: Date;
    transactions: Transaction[];
};

export default function DayTransactionsModal({ open, onClose, date, transactions }: DayTransactionsModalProps) {
    const { openModal, remove } = useTransactions();

    const entrate = transactions.filter((t) => t.category?.type === "entrata");
    const spese = transactions.filter((t) => t.category?.type === "spesa");
    const somma = (arr: Transaction[]) => arr.reduce((tot, t) => tot + (typeof t.amount === "string" ? parseFloat(t.amount as any) : t.amount), 0);
    const totalEntrate = somma(entrate);
    const totalSpese = somma(spese);

    const isoDate = date.toISOString().split("T")[0];
    const label = date.toLocaleDateString("it-IT", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="w-full max-w-md p-4 bg-bg rounded-2xl text-text border border-bg-elevate shadow-lg">
                <h2 className="text-center text-lg font-bold mb-2 capitalize">{label}</h2>
                <div className="flex justify-center gap-4 text-sm mb-4 font-medium">
                    <span className="text-primary">+{totalEntrate.toFixed(2)}€</span>
                    <span className="text-orange-400">-{totalSpese.toFixed(2)}€</span>
                    <span className="font-semibold">{(totalEntrate - totalSpese).toFixed(2)}€</span>
                </div>
                <ul className="max-h-[50vh] overflow-y-auto space-y-2">
                    {transactions.map((t) => (
                        <li key={t.id} className="flex items-center justify-between gap-2 p-2 bg-bg-elevate rounded-xl border border-bg-soft">
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">{t.description}</div>
                                {t.category && <div className="text-xs text-text-secondary">{t.category.name}</div>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-sm font-semibold ${t.category?.type === "entrata" ? "text-primary" : "text-orange-500"}`}>{t.amount.toFixed(2)}€</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        openModal(t);
                                    }}
                                    className="p-1 hover:text-primary"
                                    title="Modifica"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => remove(t.id)}
                                    className="p-1 hover:text-danger"
                                    title="Elimina"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </li>
                    ))}
                    {transactions.length === 0 && (
                        <li className="text-center text-sm text-text-secondary py-6">Nessuna transazione</li>
                    )}
                </ul>
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            openModal(null, isoDate);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary-dark text-bg rounded-xl shadow hover:opacity-90 transition text-sm font-medium"
                    >
                        <PlusCircle size={16} /> Nuova transazione
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
