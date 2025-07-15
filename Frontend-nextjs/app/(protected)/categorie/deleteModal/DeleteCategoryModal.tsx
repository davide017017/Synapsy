"use client";
// ==========================================================
// DeleteCategoryModal.tsx — Modale uniforme stile alert
// ==========================================================
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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
export default function DeleteCategoryModal({ category, onClose, categories, onDelete }: Props) {
    // --- Stato ---
    const [mode, setMode] = useState<"deleteAll" | "move">("move");
    const [targetCategoryId, setTargetCategoryId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);

    const { moveAndDelete, remove, refresh } = useCategories();

    // --- Filtra categorie disponibili per spostamento ---
    const availableCategories = categories.filter((c) => c.id !== category?.id && c.type === category?.type);
    const typeLabel = category?.type === "entrata" ? "Entrata" : "Spesa";

    // --- Funzione elimina/muovi ---
    const handleDelete = async () => {
        if (!category) return;
        setLoading(true);
        try {
            if (mode === "move" && targetCategoryId) {
                await onDelete("move", targetCategoryId);
            } else if (mode === "deleteAll") {
                await onDelete("deleteAll");
            }
            onClose();
        } finally {
            setLoading(false);
        }
    };

    // --- Render ---
    if (!category) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div
                className={`
                    relative overflow-hidden rounded-3xl shadow-2xl
                    p-8 max-w-xs w-full flex flex-col items-center
                    bg-[rgb(239,68,68)] border-red-700 border-2
                    transition-all
                `}
                style={{
                    boxShadow: "0 12px 48px 0 rgba(220,60,80,0.27), 0 2px 20px 0 rgba(40,40,60,0.13)",
                }}
            >
                {/* Icona watermark */}
                <AlertTriangle
                    size={190}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none select-none"
                    style={{ color: "#fff", filter: "blur(1.5px)" }}
                    aria-hidden
                />
                {/* Icona in primo piano */}
                <div className="z-10 mb-2">
                    <AlertTriangle className="text-white drop-shadow" size={48} />
                </div>
                {/* Titolo */}
                <div className="text-xl font-bold text-center z-10 mb-2 text-white drop-shadow">Elimina categoria</div>
                {/* Messaggio principale */}
                <p className="mb-3 z-10 text-base text-center text-white">
                    Vuoi eliminare la categoria <span className="font-bold">{category.name}</span>?
                    <br />
                    <span className="text-sm text-white/80 font-normal">
                        Scegli cosa fare delle transazioni e ricorrenze collegate:
                    </span>
                </p>
                {/* Opzioni */}
                <div className="z-10 space-y-3 mb-3 w-full">
                    {/* Elimina tutto */}
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={mode === "deleteAll"}
                            onChange={() => setMode("deleteAll")}
                            disabled={loading}
                            className="accent-red-600"
                        />
                        <span className="text-white">
                            Elimina <b>TUTTE</b> le transazioni/ricorrenze collegate{" "}
                            <span className="text-red-300 font-bold">(sconsigliato)</span>
                        </span>
                    </label>
                    {/* Sposta su altra categoria */}
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={mode === "move"}
                            onChange={() => setMode("move")}
                            disabled={loading}
                            className="accent-white"
                        />
                        <span className="text-white">
                            Sposta tutte su un’altra categoria di tipo <b>{typeLabel}</b>:
                            <select
                                className="ml-2 px-2 py-1 rounded border min-w-[120px] bg-white text-zinc-800 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition"
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
                {/* Messaggio warning extra */}
                {mode === "deleteAll" && (
                    <div className="text-xs text-yellow-200 font-semibold mb-2 z-10 text-center">
                        Attenzione: questa azione non è reversibile!
                    </div>
                )}
                {/* Footer: Pulsanti */}
                <div className="z-10 flex gap-4 mt-4 w-full justify-center">
                    <button
                        className="px-6 py-2 rounded-xl font-semibold shadow bg-white text-red-700 hover:bg-red-50 transition disabled:opacity-70"
                        onClick={handleDelete}
                        disabled={loading || (mode === "move" && !targetCategoryId)}
                    >
                        {loading ? "Eliminazione..." : "Conferma"}
                    </button>
                    <button
                        className="px-6 py-2 rounded-xl font-semibold shadow bg-red-100 text-red-900 hover:bg-red-200 transition"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Annulla
                    </button>
                </div>
            </div>
        </div>
    );
}
