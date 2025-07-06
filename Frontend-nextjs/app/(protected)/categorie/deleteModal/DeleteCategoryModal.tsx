"use client";

// ============================================
// DeleteCategoryModal.tsx
// Modale di conferma eliminazione categoria
// ============================================

import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Category } from "@/types";
import { useCategories } from "@/context/contexts/CategoriesContext";

type Props = {
    category: Category | null;
    onClose: () => void;
    categories: Category[];
};

export default function DeleteCategoryModal({ category, onClose, categories }: Props) {
    const [mode, setMode] = useState<"deleteAll" | "move">("move");
    const [targetCategoryId, setTargetCategoryId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);

    // Hook context CRUD + moveAndDelete
    const { moveAndDelete, remove, refresh } = useCategories();

    // Solo categorie compatibili per spostamento (stesso tipo e non la corrente)
    const availableCategories = categories.filter((c) => c.id !== category?.id && c.type === category?.type);

    // ========================
    // Gestione conferma eliminazione
    // ========================
    const handleDelete = async () => {
        if (!category) return;
        setLoading(true);

        try {
            if (mode === "move" && targetCategoryId) {
                // Sposta tutto e poi elimina categoria
                await moveAndDelete(category.id, targetCategoryId, () => {
                    onClose();
                    refresh();
                });
            } else if (mode === "deleteAll") {
                // Solo elimina categoria (servirebbe anche un endpoint backend per cancellare tutte le transazioni/ricorrenze collegate)
                await remove(category.id, () => {
                    onClose();
                    refresh();
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // ========================
    // Render modale
    // ========================
    return category ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl min-w-[350px] relative">
                {/* Chiudi */}
                <button
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    onClick={onClose}
                    disabled={loading}
                >
                    <X size={22} />
                </button>
                {/* Titolo e icona */}
                <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="text-yellow-500" size={28} />
                    <h2 className="text-lg font-bold">Elimina categoria</h2>
                </div>
                {/* Messaggio */}
                <p className="mb-4">
                    Vuoi eliminare la categoria <b>{category.name}</b>?<br />
                    <span className="text-sm text-zinc-500">
                        Scegli cosa fare delle transazioni e ricorrenze collegate:
                    </span>
                </p>
                {/* Scelta azione */}
                <div className="space-y-3 mb-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={mode === "deleteAll"}
                            onChange={() => setMode("deleteAll")}
                            disabled={loading}
                        />
                        <span>
                            Elimina <b>TUTTE</b> le transazioni/ricorrenze collegate{" "}
                            <span className="text-red-500 font-bold">(sconsigliato)</span>
                        </span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={mode === "move"}
                            onChange={() => setMode("move")}
                            disabled={loading}
                        />
                        <span>
                            Sposta TUTTE su un’altra categoria:
                            <select
                                className="ml-2 px-2 py-1 rounded border"
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
                {/* Azioni */}
                <div className="flex gap-2 justify-end">
                    <button className="px-3 py-2 rounded bg-zinc-200" onClick={onClose} disabled={loading}>
                        Annulla
                    </button>
                    <button
                        className="px-3 py-2 rounded bg-red-600 text-white font-semibold"
                        disabled={loading || (mode === "move" && !targetCategoryId)}
                        onClick={handleDelete}
                    >
                        {loading ? "Eliminazione..." : "Conferma"}
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}
