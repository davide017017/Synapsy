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
export default function CardCategories({
    categories,
    onEdit,
    onDelete,
    txCountByCategory,
    onViewTransactions,
}: CardCategoriesProps) {
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
                relative
                min-h-[68px]
                rounded-2xl
                border
                border-white/10
                border-l-4
                bg-black/35
                backdrop-blur-xl
                p-2.5
                flex flex-col justify-between
                overflow-hidden
                transition-all duration-200
                hover:bg-primary/5
                hover:border-primary/20
                active:scale-[0.98]
            "
            style={{
                borderLeftColor: accent,
                color: `hsl(var(--c-category-div-text))`,
                boxShadow: `0 0 18px ${accent}22, 0 12px 28px rgba(0,0,0,0.24)`,
            }}
        >
            {/* Icona grande di sfondo */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-xl">
                <div
                    className="
                      absolute
                      -bottom-2 -right-2
                      text-[58px]
                      opacity-[0.10]
                      blur-[0.2px]
                  "
                    style={{ color: accent }}
                >
                    <Icon />
                </div>
            </div>

            {/* Nome + contatore tx */}
            <div className="z-10 mb-1">
                <div
                    ref={nameRef}
                    className={`
                        font-mono
                        text-[12px]
                        font-bold
                        uppercase
                        tracking-[0.06em]
                        leading-tight
                        truncate
                        drop-shadow-[0_0_10px_rgba(0,0,0,0.45)]
                        ${showTooltip ? "cursor-help" : ""}
                    `}
                    style={{ color: accent }}
                    title={showTooltip ? cat.name : ""}
                >
                    {cat.name}
                </div>
                {txCount > 0 && (
                    <button
                        type="button"
                        onClick={() => onViewTransactions?.(cat)}
                        className="
                            flex items-center gap-1
                            w-fit
                            mt-1
                            px-2 py-0.5
                            rounded-lg
                            border
                            font-mono
                            text-[10px]
                            font-bold
                            transition-all duration-200
                            hover:shadow-[0_0_12px_currentColor]
                            active:scale-95
                        "
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
                    className="
                        p-1.5
                        rounded-xl
                        border border-primary/25
                        bg-primary/10
                        text-primary
                        transition-all duration-200
                        hover:bg-primary/15
                        hover:shadow-[0_0_12px_hsl(var(--c-primary)/0.20)]
                        active:scale-95
                    "
                    onClick={() => onEdit(cat)}
                    title="Modifica"
                    aria-label="Modifica categoria"
                >
                    <Pencil size={14} />
                </button>

                <button
                    className="
                        p-1.5
                        rounded-xl
                        border border-red-400/25
                        bg-red-500/10
                        text-red-400/85
                        transition-all duration-200
                        hover:bg-red-500/15
                        hover:text-red-300
                        hover:shadow-[0_0_12px_rgba(248,113,113,0.22)]
                        active:scale-95
                    "
                    onClick={() => onDelete(cat)}
                    title="Elimina"
                    aria-label="Elimina categoria"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </li>
    );
}
