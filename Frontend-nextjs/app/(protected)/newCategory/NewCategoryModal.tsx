"use client";

// ======================================================
// NewCategoryModal.tsx — Modale categoria uniforme
// ======================================================

import { useEffect, useState } from "react";
import Dialog from "@/app/components/ui/Dialog";
import ModalLayout from "@/app/components/ui/ModalLayout";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import { Category, CategoryBase, NewCategoryModalProps } from "@/types";
import { CATEGORY_COLORS, CATEGORY_ICONS, getIconComponent, type CategoryIconName } from "@/utils/categoryOptions";

export default function NewCategoryModal({ open, onClose, categoryToEdit, onSave }: NewCategoryModalProps) {
    // Stato form
    const [name, setName] = useState("");
    const [type, setType] = useState<"entrata" | "spesa">("entrata");
    const [color, setColor] = useState<string>(CATEGORY_COLORS[0].value);
    const [icon, setIcon] = useState<CategoryIconName>(CATEGORY_ICONS[0].value);
    const [loading, setLoading] = useState(false);

    // Helpers
    const getColorName = (value: string) => CATEGORY_COLORS.find((c) => c.value === value)?.name || value;
    const getIconName = (value: CategoryIconName) => CATEGORY_ICONS.find((i) => i.value === value)?.name || value;

    // Popola form se edit
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

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ name, type, color, icon });
        } finally {
            setLoading(false);
        }
    };

    // Colore UI in base al tipo selezionato
    const typeAccent = type === "entrata" ? "hsl(var(--c-success))" : "hsl(var(--c-danger))";

    const typeAccentSoft = type === "entrata" ? "hsl(var(--c-success) / 0.12)" : "hsl(var(--c-danger) / 0.12)";

    const typeAccentBorder = type === "entrata" ? "hsl(var(--c-success) / 0.35)" : "hsl(var(--c-danger) / 0.35)";

    // =========================
    // Render
    // =========================
    return (
        <Dialog open={open} onClose={onClose}>
            <ModalLayout
                title={
                    <span
                        className="
                            font-mono
                            text-sm
                            font-bold
                            uppercase
                            tracking-[0.14em]
                        "
                        style={{
                            color: typeAccent,
                            textShadow: `0 0 12px ${typeAccent}`,
                        }}
                    >
                        {categoryToEdit ? "Modifica categoria" : "Nuova categoria"}
                    </span>
                }
                onClose={onClose}
                footer={
                    <div className="flex gap-2 w-full">
                        {/* Bottone Annulla */}
                        <button
                            type="button"
                            className="
                                w-1/2
                                rounded-xl
                                border border-white/10
                                bg-white/5
                                py-2
                                font-mono
                                text-[11px]
                                uppercase
                                tracking-[0.08em]
                                text-foreground/60
                                transition-all duration-200
                                hover:bg-white/10
                                hover:text-foreground
                                active:scale-95
                                focus:ring-2 focus:ring-primary/40
                            "
                            onClick={onClose}
                            disabled={loading}
                        >
                            Annulla
                        </button>
                        {/* Bottone Salva/Crea */}
                        <button
                            type="submit"
                            form="category-form"
                            className="
                                w-1/2
                                rounded-xl
                                border
                                py-2
                                font-mono
                                text-[11px]
                                uppercase
                                tracking-[0.08em]
                                transition-all duration-200
                                active:scale-95
                                focus:ring-2
                            "
                            style={{
                                background: typeAccentSoft,
                                borderColor: typeAccentBorder,
                                color: typeAccent,
                                boxShadow: `0 0 16px ${type === "entrata" ? "hsl(var(--c-success) / 0.20)" : "hsl(var(--c-danger) / 0.20)"}`,
                            }}
                            disabled={loading}
                        >
                            {categoryToEdit ? "Salva modifiche" : "Crea categoria"}
                        </button>
                    </div>
                }
            >
                <form id="category-form" className="space-y-4 font-mono" onSubmit={handleSubmit} autoComplete="off">
                    {" "}
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
                    {/* ===== Nome ===== */}
                    <div>
                        <label
                            className="
                                block mb-1
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-foreground/45
                            "
                        >
                            Nome
                        </label>{" "}
                        <input
                            className="
                              mt-1 block w-full
                              rounded-xl
                              border
                              bg-black/20
                              px-3 py-2
                              font-mono
                              text-sm
                              text-foreground
                              placeholder:text-foreground/30
                              transition-all duration-200
                              focus:ring-2
                              outline-none
                          "
                            style={{
                                borderColor: typeAccentBorder,
                                boxShadow: `0 0 0 1px ${typeAccentBorder}`,
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                            maxLength={50}
                            placeholder="Nome categoria..."
                        />
                    </div>
                    {/* ===== Tipo ===== */}
                    <div>
                        <label
                            className="
                            block mb-1
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-foreground/45
                        "
                        >
                            Tipo
                        </label>{" "}
                        <select
                            className="
                                mt-1 block w-full
                                rounded-xl
                                border
                                bg-black/20
                                px-3 py-2
                                font-mono
                                text-sm
                                text-foreground
                                transition-all duration-200
                                focus:ring-2
                                outline-none
                            "
                            style={{
                                borderColor: typeAccentBorder,
                                boxShadow: `0 0 0 1px ${typeAccentBorder}`,
                            }}
                            value={type}
                            onChange={(e) => setType(e.target.value as "entrata" | "spesa")}
                        >
                            <option value="entrata">Entrata</option>
                            <option value="spesa">Spesa</option>
                        </select>
                    </div>
                    {/* ===== Colore ===== */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Colore</label>
                        <div
                            className="flex gap-2 overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600"
                            style={{ WebkitOverflowScrolling: "touch" }}
                        >
                            {CATEGORY_COLORS.map((col, i) => (
                                <button
                                    type="button"
                                    key={`${col.value}-${i}`}
                                    title={col.name}
                                    className={`w-8 h-8 rounded-xl border-2 transition-all duration-200 shrink-0 active:scale-95                                        ${
                                        color === col.value
                                            ? "ring-2 border-transparent shadow-[0_0_14px_currentColor]"
                                            : "border-white/15"
                                    }
                                    `}
                                    style={{
                                        background: col.value,
                                        color: typeAccent,
                                        boxShadow: color === col.value ? `0 0 14px ${typeAccent}` : undefined,
                                    }}
                                    onClick={() => setColor(col.value)}
                                    aria-label={`Scegli il colore ${col.name}`}
                                    tabIndex={0}
                                >
                                    <title>{col.name}</title>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* ===== Icona ===== */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Icona</label>
                        <div className="flex flex-wrap gap-2 py-1">
                            {CATEGORY_ICONS.map((iconObj, i) => {
                                const Icon = getIconComponent(iconObj.value);
                                const selected = icon === iconObj.value;

                                return (
                                    <button
                                        type="button"
                                        key={`${iconObj.value}-${i}`}
                                        title={iconObj.name}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 active:scale-95 ${
                                            selected ? "ring-2 border-transparent" : "border-white/10 bg-black/20"
                                        }`}
                                        style={{
                                            borderColor: selected ? typeAccent : undefined,
                                            background: selected ? typeAccentSoft : undefined,
                                            boxShadow: selected ? `0 0 14px ${typeAccent}` : undefined,
                                        }}
                                        onClick={() => setIcon(iconObj.value)}
                                        aria-label={`Scegli l'icona ${iconObj.name}`}
                                    >
                                        <Icon size={22} style={{ color: selected ? color : "inherit" }} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {/* ===== Preview ===== */}
                    <div
                        className="
                            flex items-center gap-3 mt-2
                            rounded-2xl
                            border
                            bg-black/20
                            px-3 py-2
                            backdrop-blur-sm
                        "
                        style={{
                            borderColor: typeAccentBorder,
                            boxShadow: `0 0 16px ${type === "entrata" ? "hsl(var(--c-success) / 0.12)" : "hsl(var(--c-danger) / 0.12)"}`,
                        }}
                    >
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
                        <span className="font-mono text-sm font-bold truncate max-w-[140px] text-foreground/80">
                            {name || "Nome Categoria"}
                        </span>{" "}
                        <span
                            className={`font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-1 rounded-lg border                            ${
                                type === "entrata"
                                    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                                    : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
                            }
                            `}
                        >
                            {type === "entrata" ? "Entrata" : "Spesa"}
                        </span>
                    </div>
                </form>
            </ModalLayout>
        </Dialog>
    );
}
