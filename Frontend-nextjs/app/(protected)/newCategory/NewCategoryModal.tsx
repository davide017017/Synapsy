"use client";

// ======================================================
// NewCategoryModal.tsx — Modale categoria uniforme
// ======================================================

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Category, CategoryBase } from "@/types";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/utils/categoryOptions";
import { getIconComponent } from "@/utils/iconMap";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";

// ============================
// Props
// ============================
type Props = {
    open: boolean;
    onClose: () => void;
    categoryToEdit?: Category | null;
    onSave: (data: CategoryBase) => Promise<void>;
};

export default function NewCategoryModal({ open, onClose, categoryToEdit, onSave }: Props) {
    // ===== State =====
    const [name, setName] = useState("");
    const [type, setType] = useState<"entrata" | "spesa">("entrata");
    const [color, setColor] = useState<string>(CATEGORY_COLORS[0].value);
    const [icon, setIcon] = useState<string>(CATEGORY_ICONS[0].value);
    const [loading, setLoading] = useState(false);
    const getColorName = (value: string) => CATEGORY_COLORS.find((c) => c.value === value)?.name || value;
    const getIconName = (value: string) => CATEGORY_ICONS.find((i) => i.value === value)?.name || value;

    // ===== Popola form se edit =====
    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name);
            setType(categoryToEdit.type);
            setColor(categoryToEdit.color || CATEGORY_COLORS[0].value);
            setIcon(categoryToEdit.icon || CATEGORY_ICONS[0].value);
        } else {
            setName("");
            setType("entrata");
            setColor(CATEGORY_COLORS[0].value);
            setIcon(CATEGORY_ICONS[0].value);
        }
    }, [categoryToEdit, open]);

    // ===== Blocca scroll pagina sotto =====
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // ===== Non rendere se non aperta =====
    if (!open) return null;

    // ===== Submit con loading =====
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ name, type, color, icon });
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // Render
    // ============================
    return (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
            <div className="relative bg-bg rounded-2xl p-6 shadow-2xl border border-bg-elevate w-full max-w-2xl">
                {/* ===== Overlay loading ===== */}
                <LoadingOverlay
                    show={loading}
                    icon="🏷️"
                    message={categoryToEdit ? "Salvataggio categoria…" : "Creazione categoria…"}
                    subMessage={
                        <>
                            {`• Nome: "${name}"`}
                            <br />
                            {`• Tipo: ${type === "entrata" ? "Entrata" : "Spesa"}`}
                            <br />
                            {`• Colore: ${getColorName(color)}`}
                            <br />
                            {`• Icona: ${getIconName(icon)}`}
                        </>
                    }
                />

                {/* ===== Chiudi ===== */}
                <button
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    onClick={onClose}
                    title="Chiudi"
                    tabIndex={0}
                    type="button"
                >
                    <X size={22} />
                </button>

                {/* ===== Titolo ===== */}
                <h2 className="text-lg font-bold mb-3">{categoryToEdit ? "Modifica categoria" : "Nuova categoria"}</h2>

                {/* ===== Form ===== */}
                <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome</label>
                        <input
                            className="mt-1 block w-full rounded-xl border border-bg-elevate bg-bg px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/40 transition placeholder:text-zinc-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                            maxLength={50}
                            placeholder="Nome categoria..."
                        />
                    </div>
                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipo</label>
                        <select
                            className="mt-1 block w-full rounded-xl border border-bg-elevate bg-bg px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
                            value={type}
                            onChange={(e) => setType(e.target.value as "entrata" | "spesa")}
                        >
                            <option value="entrata">Entrata</option>
                            <option value="spesa">Spesa</option>
                        </select>
                    </div>
                    {/* Colore */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Colore</label>
                        <div
                            className="flex gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600"
                            style={{ WebkitOverflowScrolling: "touch" }}
                        >
                            {CATEGORY_COLORS.map((col) => (
                                <button
                                    type="button"
                                    key={col.value}
                                    title={col.name}
                                    className={`w-8 h-8 rounded-full border-2 transition-all shrink-0
                                        ${
                                            color === col.value
                                                ? "ring-2 ring-offset-2 ring-primary border-primary"
                                                : "border-zinc-300 dark:border-zinc-700"
                                        }
                                    `}
                                    style={{ background: col.value }}
                                    onClick={() => setColor(col.value)}
                                    aria-label={`Scegli il colore ${col.name}`}
                                    tabIndex={0}
                                >
                                    <title>{col.name}</title>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Icona */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Icona</label>
                        <div className="flex flex-wrap gap-2 py-1">
                            {CATEGORY_ICONS.map((iconObj) => {
                                const Icon = getIconComponent(iconObj.value);
                                const selected = icon === iconObj.value;
                                return (
                                    <button
                                        type="button"
                                        key={iconObj.value}
                                        title={iconObj.name}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition
                                            ${
                                                selected
                                                    ? "ring-2 ring-primary border-primary bg-primary/10"
                                                    : "border-zinc-300 dark:border-zinc-700 bg-bg-elevate"
                                            }
                                        `}
                                        onClick={() => setIcon(iconObj.value)}
                                        aria-label={`Scegli l'icona ${iconObj.name}`}
                                        tabIndex={0}
                                    >
                                        <Icon size={22} style={{ color: selected ? color : "inherit" }} />
                                        <title>{iconObj.name}</title>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {/* Preview */}
                    <div className="flex items-center gap-3 mt-2">
                        <span
                            className="rounded-full p-2 border"
                            style={{
                                background: color + "22",
                                color,
                                borderColor: color,
                                fontSize: 32,
                            }}
                        >
                            {(() => {
                                const PreviewIcon = getIconComponent(icon);
                                return <PreviewIcon size={28} />;
                            })()}
                        </span>
                        <span className="font-semibold truncate max-w-[140px]">{name || "Nome Categoria"}</span>
                        <span
                            className={`text-xs px-2 py-1 rounded-full
                            ${
                                type === "entrata"
                                    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                                    : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
                            }
                            `}
                        >
                            {type === "entrata" ? "Entrata" : "Spesa"}
                        </span>
                    </div>
                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-primary text-white rounded-xl py-2 font-semibold mt-2 shadow focus:ring-2 focus:ring-primary/40 transition"
                        disabled={loading}
                    >
                        {categoryToEdit ? "Salva modifiche" : "Crea categoria"}
                    </button>
                </form>
            </div>
        </div>
    );
}
