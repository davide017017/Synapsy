"use client";

// ==========================================================
// DeleteCategoryModal.tsx — Modale uniforme, semantic utility
// ==========================================================

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Dialog from "@/app/components/ui/Dialog";
import ModalLayout from "@/app/components/ui/ModalLayout";
import { Category } from "@/types";
import { useCategories } from "@/context/contexts/CategoriesContext";

// ============================
// Tipi props
// ============================
type Props = {
    category: Category | null;
    onClose: () => void;
    categories: Category[];
    onDelete: (mode: "deleteAll" | "move", targetCategoryId?: number) => void | Promise<void>;
};

// ============================
// Componente principale
// ============================
export default function DeleteCategoryModal({ category, onClose, categories }: Props) {
    // --- Stato ---
    const [mode, setMode] = useState<"deleteAll" | "move">("move");
    const [targetCategoryId, setTargetCategoryId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);

    const { moveAndDelete, remove, refresh } = useCategories();

    // --- Filtra categorie disponibili per spostamento ---
    const availableCategories = categories.filter((c) => c.id !== category?.id && c.type === category?.type);
    const typeLabel = category?.type === "entrata" ? "Entrata" : "Spesa";

    // ============================
    // Funzione elimina/muovi
    // ============================
    const handleDelete = async () => {
        if (!category) return;
        setLoading(true);
        try {
            if (mode === "move" && targetCategoryId) {
                await moveAndDelete(category.id, targetCategoryId, () => {
                    onClose();
                    refresh();
                });
            } else if (mode === "deleteAll") {
                await remove(category.id, () => {
                    onClose();
                    refresh();
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // Render
    // ============================
    if (!category) return null;
    return (
        <Dialog open={!!category} onClose={onClose}>
            <ModalLayout
                // ---------- Titolo ----------
                title={
                    <span className="flex items-center gap-2 text-yellow-900 dark:text-yellow-400">
                        <AlertTriangle size={22} />
                        Elimina categoria
                    </span>
                }
                onClose={onClose}
                // ---------- Footer ----------
                footer={
                    <>
                        <button
                            className="px-3 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-semibold"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Annulla
                        </button>
                        <button
                            className={`px-3 py-2 rounded font-semibold text-white 
                                ${
                                    loading || (mode === "move" && !targetCategoryId)
                                        ? "bg-red-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700 transition"
                                }`}
                            disabled={loading || (mode === "move" && !targetCategoryId)}
                            onClick={handleDelete}
                        >
                            {loading ? "Eliminazione..." : "Conferma"}
                        </button>
                    </>
                }
            >
                {/* ------------------------------------
                    Messaggio principale
                ------------------------------------ */}
                <p className="mb-4">
                    Vuoi eliminare la categoria <b>{category.name}</b>?<br />
                    <span className="text-sm text-zinc-500">
                        Scegli cosa fare delle transazioni e ricorrenze collegate:
                    </span>
                </p>

                {/* ------------------------------------
                    Opzioni di eliminazione/spostamento
                ------------------------------------ */}
                <div className="space-y-3 mb-4">
                    {/* Elimina tutto */}
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={mode === "deleteAll"}
                            onChange={() => setMode("deleteAll")}
                            disabled={loading}
                            className="accent-red-600"
                        />
                        <span>
                            Elimina <b>TUTTE</b> le transazioni/ricorrenze collegate{" "}
                            <span className="text-red-600 font-bold">(sconsigliato)</span>
                        </span>
                    </label>
                    {/* Sposta su altra categoria */}
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={mode === "move"}
                            onChange={() => setMode("move")}
                            disabled={loading}
                            className="accent-primary"
                        />
                        <span>
                            Sposta TUTTE su un’altra categoria di tipo <b>{typeLabel}</b>:
                            <select
                                className="ml-2 px-2 py-1 rounded border border-bg-elevate text-sm min-w-[140px] bg-bg text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                                value={targetCategoryId ?? ""}
                                onChange={(e) => setTargetCategoryId(Number(e.target.value))}
                                disabled={mode !== "move" || loading}
                            >
                                <option value="">Seleziona…</option>
                                {availableCategories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </span>
                    </label>
                </div>

                {/* ------------------------------------
                    Messaggio warning extra
                ------------------------------------ */}
                {mode === "deleteAll" && (
                    <div className="text-xs text-red-600 font-semibold mb-2">
                        Attenzione: questa azione non è reversibile!
                    </div>
                )}
            </ModalLayout>
        </Dialog>
    );
}
