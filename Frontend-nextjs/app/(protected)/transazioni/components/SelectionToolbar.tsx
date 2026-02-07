// ================================
// SelectionToolbar.tsx
// Toolbar per la selezione multipla con modale conferma "Elimina selezionati"
// ================================

"use client";
import { useState } from "react";
import type { SelectionToolbarProps } from "@/types/transazioni/list";
import { useSelection } from "@/context/SelectionContext";
import { MousePointerSquareDashed, XCircle, Trash2, AlertTriangle } from "lucide-react";

export default function SelectionToolbar({ onDeleteSelected, selectedPreview = [] }: SelectionToolbarProps) {
    const { isSelectionMode, setIsSelectionMode, setSelectedIds, selectedIds } = useSelection();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Gestione eliminazione multipla
    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDeleteSelected(selectedIds);
            setSelectedIds([]);
            setIsSelectionMode(false);
        } catch (err) {
            // Eventuale errore/feedback
        } finally {
            setLoading(false);
            setShowConfirmModal(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            {/* ─── Toggle selezione multipla ─── */}
            <button
                className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium shadow-sm
        transition-all duration-100 ease-in
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary
        ${
            isSelectionMode
                ? "bg-yellow-100 border-yellow-400 text-yellow-900 hover:bg-yellow-200"
                : "bg-bg-elevate border-border text-primary hover:bg-primary/80 hover:text-white"
        }
    `}
                onClick={() => {
                    setIsSelectionMode(!isSelectionMode);
                    setSelectedIds([]);
                }}
            >
                {/* ICONA → sempre visibile */}
                {isSelectionMode ? <XCircle size={18} /> : <MousePointerSquareDashed size={18} />}

                {/* TESTO → solo desktop */}
                <span className="hidden md:inline">{isSelectionMode ? "Annulla selezione" : "Seleziona più"}</span>
            </button>

            {/* ─── Bottone Elimina con modale conferma ─── */}
            {isSelectionMode && selectedIds.length > 0 && (
                <>
                    <div className="relative group">
                        <button
                            className="
                                flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-400
                                bg-red-100 text-red-800 hover:bg-red-200 font-medium shadow-sm text-sm
                                transition-all duration-100 active:scale-95
                            "
                            onClick={() => setShowConfirmModal(true)}
                        >
                            <Trash2 size={17} />
                            Elimina&nbsp;
                            <span className="font-semibold">{selectedIds.length}</span>
                        </button>

                        {/* ===== TOOLTIP PREVIEW ===== */}
                        <div
                            className="
                                pointer-events-none
                                absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2
                                w-72 max-h-56 overflow-y-auto
                                rounded-xl border border-border
                                bg-bg-elevate shadow-xl
                                opacity-0 scale-95
                                group-hover:opacity-100 group-hover:scale-100
                                transition-all duration-150
                            "
                        >
                            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
                                Stai per eliminare
                            </div>

                            <ul className="px-3 py-2 space-y-2 text-sm">
                                {selectedPreview.map((t) => (
                                    <li key={t.id} className="flex justify-between gap-2">
                                        <div className="truncate">
                                            {t.description}
                                            <div className="text-[11px] text-muted-foreground">
                                                {new Date(t.date).toLocaleDateString("it-IT")}
                                            </div>
                                        </div>
                                        <div className="font-semibold tabular-nums">
                                            {t.amount.toLocaleString("it-IT", {
                                                style: "currency",
                                                currency: "EUR",
                                            })}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ========== MODALE CONFERMA ELIMINA ========== */}
                    {showConfirmModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-xs w-full flex flex-col items-center border border-red-300 shadow-xl">
                                <AlertTriangle className="text-red-600 mb-2" size={36} />
                                <div className="text-lg font-bold text-red-700 dark:text-red-400 mb-4 text-center">
                                    Confermi di voler eliminare
                                    <br />
                                    <span className="font-semibold">{selectedIds.length}</span> transazione
                                    {selectedIds.length > 1 ? "i" : "e"} selezionat
                                    {selectedIds.length > 1 ? "e" : "a"}?
                                </div>

                                <div className="w-full mt-3 max-h-48 overflow-y-auto rounded-lg border border-border bg-bg-elevate/60">
                                    <ul className="divide-y divide-border text-sm">
                                        {selectedPreview.map((t) => (
                                            <li key={t.id} className="px-3 py-2 flex justify-between gap-2">
                                                <div className="truncate">
                                                    {t.description}
                                                    <div className="text-[11px] text-muted-foreground">
                                                        {new Date(t.date).toLocaleDateString("it-IT")}
                                                    </div>
                                                </div>
                                                <div className="font-semibold tabular-nums">
                                                    {t.amount.toLocaleString("it-IT", {
                                                        style: "currency",
                                                        currency: "EUR",
                                                    })}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex gap-4 mt-2">
                                    <button
                                        className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        Sì, elimina
                                    </button>
                                    <button
                                        className="px-6 py-2 rounded-xl bg-gray-300 dark:bg-zinc-700 text-gray-800 dark:text-gray-100 font-semibold hover:bg-gray-400 dark:hover:bg-zinc-800"
                                        onClick={() => setShowConfirmModal(false)}
                                        disabled={loading}
                                    >
                                        Annulla
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
