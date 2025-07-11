// ================================
// SelectionToolbar.tsx
// Toolbar per la selezione multipla con modale conferma "Elimina selezionati"
// ================================

"use client";
import { useState } from "react";
import { useSelection } from "@/context/contexts/SelectionContext";
import { MousePointerSquareDashed, XCircle, Trash2, AlertTriangle } from "lucide-react";

type Props = {
    onDeleteSelected: (ids: number[]) => void;
};

export default function SelectionToolbar({ onDeleteSelected }: Props) {
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
        <div className="flex items-center gap-3 mb-2">
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
                title={isSelectionMode ? "Annulla selezione multipla" : "Attiva selezione multipla"}
            >
                {isSelectionMode ? (
                    <>
                        <XCircle size={18} className="text-yellow-900" />
                        Annulla selezione
                    </>
                ) : (
                    <>
                        <MousePointerSquareDashed size={18} className="text-primary" />
                        Seleziona più
                    </>
                )}
            </button>

            {/* ─── Bottone Elimina con modale conferma ─── */}
            {isSelectionMode && selectedIds.length > 0 && (
                <>
                    <button
                        className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-400
                            bg-red-100 text-red-800 hover:bg-red-200 font-medium shadow-sm text-sm
                            transition-all duration-100 active:scale-95
                            focus:outline-none focus:ring-2 focus:ring-red-400
                        `}
                        onClick={() => setShowConfirmModal(true)}
                        title={`Elimina ${selectedIds.length} selezionat${selectedIds.length === 1 ? "a" : "i"}`}
                    >
                        <Trash2 size={17} className="text-red-700" />
                        Elimina&nbsp;
                        <span className="font-semibold">{selectedIds.length}</span>
                    </button>

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
