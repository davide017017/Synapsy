"use client";

import Dialog from "@/app/components/ui/Dialog";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/types/models/transaction";
import { useTransactions } from "@/context/contexts/TransactionsContext";
import { Calendar, ArrowUpCircle, ArrowDownCircle, Calculator } from "lucide-react";
import { CATEGORY_ICONS_MAP } from "@/utils/categoryOptions";

export type DayTransactionsModalProps = {
    open: boolean;
    onClose: () => void;
    date: Date;
    transactions: Transaction[];
};

export default function DayTransactionsModal({ open, onClose, date, transactions }: DayTransactionsModalProps) {
    const { openModal, remove } = useTransactions();

    // Suddividi per tipo e calcola totali
    const entrate = transactions.filter((t) => t.category?.type === "entrata");
    const spese = transactions.filter((t) => t.category?.type === "spesa");
    const somma = (arr: Transaction[]) =>
        arr.reduce((tot, t) => tot + (typeof t.amount === "string" ? parseFloat(t.amount as any) : t.amount), 0);
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
            <div className="w-full bg-bg rounded-2xl text-text border border-bg-elevate shadow-lg flex flex-col items-center px-0 py-0">
                {/* ===== Header centrato con tabella totali ===== */}
                <div className="w-full flex flex-col items-center py-6 border-b border-bg-elevate mb-1">
                    {/* Data evidenziata */}
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="text-primary" size={22} />
                        <h2 className="text-2xl font-bold capitalize text-primary text-center tracking-tight">
                            {label}
                        </h2>
                    </div>
                    {/* Tabella totali compatta */}
                    <div className="w-full max-w-[330px] mx-auto">
                        <table className="w-full text-base text-center">
                            <tbody>
                                <tr>
                                    <td className="py-1 px-2">
                                        <div className="flex items-center justify-center gap-1 text-primary">
                                            <ArrowUpCircle size={18} />
                                            <span className="font-semibold">Entrate</span>
                                        </div>
                                    </td>
                                    <td className="py-1 px-2">
                                        <div className="flex items-center justify-center gap-1 text-orange-500">
                                            <ArrowDownCircle size={18} />
                                            <span className="font-semibold">Spese</span>
                                        </div>
                                    </td>
                                    <td className="py-1 px-2">
                                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                            <Calculator size={17} />
                                            <span className="font-semibold">Totale</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="text-lg font-bold">
                                    <td className="text-primary">+{totalEntrate.toFixed(2)}€</td>
                                    <td className="text-orange-500">-{totalSpese.toFixed(2)}€</td>
                                    <td className="text-primary">{(totalEntrate - totalSpese).toFixed(2)}€</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ===== Lista transazioni ===== */}
                <ul className="w-full px-0 py-2 max-h-[44vh] overflow-y-auto flex flex-col items-center">
                    {transactions.length > 0 ? (
                        transactions.map((t) => {
                            // Prendi icona e colore categoria (fallback icona generica)
                            const iconKey = t.category?.icon as keyof typeof CATEGORY_ICONS_MAP;
                            const IconComp = iconKey && CATEGORY_ICONS_MAP[iconKey];

                            const catColor = t.category?.color || "#ccc";
                            return (
                                <li
                                    key={t.id}
                                    className="w-[95%] flex items-center justify-between gap-2 p-2 my-1 bg-bg-elevate rounded-xl border border-bg-soft"
                                >
                                    {/* Icona categoria */}
                                    <div className="flex-shrink-0 mr-2 flex items-center">
                                        {IconComp ? (
                                            <IconComp size={22} color={catColor} className="drop-shadow" />
                                        ) : (
                                            <span className="inline-block w-5 h-5 rounded-full bg-gray-200" />
                                        )}
                                    </div>
                                    {/* Descrizione + categoria */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold truncate">{t.description}</div>
                                        {t.category && (
                                            <div className="text-xs text-text-secondary capitalize">
                                                {t.category.name}
                                            </div>
                                        )}
                                    </div>
                                    {/* Importo + azioni */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <span
                                            className={`text-sm font-semibold ${
                                                t.category?.type === "entrata" ? "text-primary" : "text-orange-500"
                                            }`}
                                        >
                                            {typeof t.amount === "string"
                                                ? parseFloat(t.amount).toFixed(2)
                                                : t.amount.toFixed(2)}
                                            €
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                                openModal(t);
                                            }}
                                            className="p-1 rounded hover:bg-primary/10 text-primary transition"
                                            title="Modifica"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => remove(t.id)}
                                            className="p-1 rounded hover:bg-danger/10 text-danger transition"
                                            title="Elimina"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <li className="w-full text-center text-sm text-text-secondary py-7">Nessuna transazione</li>
                    )}
                </ul>

                {/* ===== Azione: nuova transazione ===== */}
                <div className="w-full flex justify-center border-t border-bg-elevate py-4">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            openModal(null, isoDate);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-bg rounded-xl shadow hover:opacity-90 transition text-base font-semibold active:scale-100"
                    >
                        <PlusCircle size={18} /> Nuova transazione
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
