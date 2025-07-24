"use client";

// ============================
// CardCategories.tsx — Card visualizzazione categorie (tema custom property)
// ============================

import { Category } from "@/types";
import type { CardCategoriesProps, CategoryCardProps } from "@/types";
import { getIconComponent } from "@/utils/iconMap";
import { Pencil, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function CardCategories({ categories, onEdit, onDelete }: CardCategoriesProps) {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {categories.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </ul>
    );
}

function CategoryCard({ cat, onEdit, onDelete }: CategoryCardProps) {
    const Icon = getIconComponent(cat.icon);

    const nameRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const el = nameRef.current;
        if (el) setShowTooltip(el.scrollWidth > el.clientWidth);
    }, [cat.name]);

    // Colore accent (bordi, glow): resta dinamico, ma bg/text sono da custom property
    const accent = cat.color || (cat.type === "entrata" ? "#16f5c7" : "#fd518d");

    return (
        <li
            className={`
                relative rounded-2xl p-4 min-h-[140px] flex flex-col justify-between
                shadow-lg hover:shadow-2xl border-l-8 transition-all
            `}
            style={{
                borderLeftColor: accent,
                background: `hsl(var(--c-category-div-bg))`,
                color: `hsl(var(--c-category-div-text))`,
                boxShadow: `0 0 6px 0 ${accent}99, 0 4px 16px 0 #0006`,
            }}
        >
            {/* Icona di sfondo */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute bottom-1 right-1 opacity-20 text-[110px]" style={{ color: accent }}>
                    <Icon />
                </div>
            </div>

            {/* Etichetta tipo */}
            <div className="flex items-center gap-2 mb-2 z-10">
                <span
                    className={`
                        inline-block px-3 py-1 rounded-full text-xs font-semibold border
                        shadow shadow-black/40 bg-opacity-30
                    `}
                    style={{
                        backgroundColor: accent + "22",
                        color: "hsl(var(--c-category-div-text))",
                        borderColor: accent,
                    }}
                >
                    {cat.type === "entrata" ? "Entrata" : "Spesa"}
                </span>
            </div>

            {/* Nome categoria */}
            <div className="w-full flex justify-left mb-2 z-10">
                <div
                    ref={nameRef}
                    className={`
                        font-semibold text-lg text-left truncate max-w-[170px]
                        ${showTooltip ? "cursor-help" : ""}
                    `}
                    style={{
                        color: "hsl(var(--c-category-div-text))",
                    }}
                    title={showTooltip ? cat.name : ""}
                >
                    {cat.name}
                </div>
            </div>

            {/* Bottoni */}
            <div className="flex gap-2 justify-left mt-auto z-10">
                <button
                    className="p-2 rounded-full bg-transparent hover:bg-blue-600/80 hover:text-white text-blue-500 transition"
                    onClick={() => onEdit(cat)}
                    title="Modifica"
                >
                    <Pencil size={18} />
                </button>
                <button
                    className="p-2 rounded-full bg-transparent hover:bg-red-700/80 hover:text-white text-red-500 transition"
                    onClick={() => onDelete(cat)}
                    title="Elimina"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </li>
    );
}

// ===================== END CardCategories =====================
