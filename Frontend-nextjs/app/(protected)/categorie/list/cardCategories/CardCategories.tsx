"use client";

// ============================
// CardCategories.tsx — Card visualizzazione categorie (tema custom property)
// ============================

import { Category } from "@/types";
import type { CardCategoriesProps, CategoryCardProps } from "@/types";
import { getIconComponent } from "@/utils/categoryOptions";
import { Pencil, Trash2, ChartNoAxesCombined } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// ============================
// Lista cards (grid responsive)
// ============================
export default function CardCategories({ categories, onEdit, onDelete, txCountByCategory, onViewTransactions }: CardCategoriesProps) {
    return (
        <ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-2">
            {categories.map((cat) => (
                <CategoryCard
                    key={cat.id}
                    cat={cat}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    txCount={txCountByCategory?.[cat.id] ?? 0}
                    onViewTransactions={onViewTransactions}
                />
            ))}
        </ul>
    );
}

// ============================
// Singola card categoria
// ============================
function CategoryCard({ cat, onEdit, onDelete, txCount = 0, onViewTransactions }: CategoryCardProps) {
    const Icon = getIconComponent(cat.icon);

    const nameRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const el = nameRef.current;
        if (el) setShowTooltip(el.scrollWidth > el.clientWidth);
    }, [cat.name]);

    const accent = cat.color || (cat.type === "entrata" ? "#16f5c7" : "#fd518d");

    return (
        <li
            className="
                relative rounded-xl p-2 min-h-[56px]
                flex flex-col justify-between
                shadow-md hover:shadow-xl border-l-4 transition-all
            "
            style={{
                borderLeftColor: accent,
                background: `hsl(var(--c-category-div-bg))`,
                color: `hsl(var(--c-category-div-text))`,
                boxShadow: `0 0 5px 0 ${accent}88, 0 2px 10px 0 #0004`,
            }}
        >
            {/* Icona grande di sfondo */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-xl">
                <div className="absolute bottom-0 right-0 opacity-15 text-[50px]" style={{ color: accent }}>
                    <Icon />
                </div>
            </div>

            {/* Nome + contatore tx */}
            <div className="z-10 mb-1">
                <div
                    ref={nameRef}
                    className={`font-semibold text-sm leading-tight truncate ${showTooltip ? "cursor-help" : ""}`}
                    style={{ color: cat.color, filter: "brightness(1.8) saturate(0.6)" }}
                    title={showTooltip ? cat.name : ""}
                >
                    {cat.name}
                </div>
                {txCount > 0 && (
                    <button
                        type="button"
                        onClick={() => onViewTransactions?.(cat)}
                        className="flex items-center gap-0.5 text-xs rounded-full px-2 py-0.5 mt-0.5 border transition hover:opacity-80 cursor-pointer"
                        style={{
                            backgroundColor: `${accent}33`,
                            borderColor: `${accent}66`,
                            color: accent,
                        }}
                        title="Vedi transazioni"
                    >
                        <ChartNoAxesCombined size={10} />
                        <span>{txCount}</span>
                    </button>
                )}
            </div>

            {/* Bottoni azioni */}
            <div className="flex gap-1 mt-auto z-10">
                <button
                    className="p-1.5 rounded-full bg-transparent hover:bg-blue-600/80 hover:text-white text-blue-500 transition"
                    onClick={() => onEdit(cat)}
                    title="Modifica"
                >
                    <Pencil size={14} />
                </button>
                <button
                    className="p-1.5 rounded-full bg-transparent hover:bg-red-700/80 hover:text-white text-red-500 transition"
                    onClick={() => onDelete(cat)}
                    title="Elimina"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </li>
    );
}
