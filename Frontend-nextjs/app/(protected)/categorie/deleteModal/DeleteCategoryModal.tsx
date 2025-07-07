"use client";

// ============================================
// DeleteCategoryModal.tsx migliorato
// ============================================

import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Category } from "@/types";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { getIconComponent } from "@/utils/iconMap";

type Props = {
    category: Category | null;
    onClose: () => void;
    categories: Category[];
    onDelete: (mode: "deleteAll" | "move", targetCategoryId?: number) => void | Promise<void>;
};

export default function DeleteCategoryModal({ category, onClose, categories }: Props) {
    const [mode, setMode] = useState<"deleteAll" | "move">("move");
    const [targetCategoryId, setTargetCategoryId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);

    const { moveAndDelete, remove, refresh } = useCategories();

    // Solo categorie compatibili per spostamento (stesso tipo e non la corrente)
    const availableCategories = categories.filter((c) => c.id !== category?.id && c.type === category?.type);

    const typeLabel = category?.type === "entrata" ? "Entrata" : "Spesa";

    // === Conferma eliminazione ===
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

    // === Render ===
    return category ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-bg dark:bg-bg rounded-2xl p-6 shadow-2xl min-w-[350px] relative">
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
                            {/* Etichetta chiara */}
                            Sposta TUTTE su un’altra categoria di tipo <b>{typeLabel}</b>:
                            <select
                                className="ml-2 px-2 py-1 rounded border text-sm"
                                value={targetCategoryId ?? ""}
                                onChange={(e) => setTargetCategoryId(Number(e.target.value))}
                                disabled={mode !== "move" || loading}
                                style={{
                                    minWidth: 160,
                                    background: "var(--c-bg)", // Palette globale
                                    color: "var(--c-text)",
                                }}
                            >
                                <option value="">Seleziona…</option>
                                {availableCategories.map((c) => {
                                    const Icon = getIconComponent(c.icon);
                                    return (
                                        <option
                                            key={c.id}
                                            value={c.id}
                                            style={{
                                                background: c.color ? c.color + "22" : undefined,
                                                color: c.color ? c.color : undefined,
                                            }}
                                        >
                                            {/* NB: Icon non visibile nativamente, solo testo */}
                                            {c.name}
                                        </option>
                                    );
                                })}
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
