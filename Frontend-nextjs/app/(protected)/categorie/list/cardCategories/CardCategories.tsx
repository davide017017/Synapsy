"use client";

// ======================================================
// CardCategories.tsx — Visualizza categorie a card
// ======================================================

import { Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types";
import { getIconComponent } from "@/utils/iconMap";
import React, { useRef, useEffect, useState } from "react";

// ============================
// Props principali
// ============================
type Props = {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
};

// ============================
// Componente principale
// ============================
export default function CardCategories({ categories, onEdit, onDelete }: Props) {
    if (!categories.length) return <div className="text-zinc-500 text-sm my-4">Nessuna categoria</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-6">
            {categories.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}

// ============================
// Card Singola (con tooltip + ripple)
// ============================
type CardProps = {
    cat: Category;
    onEdit: (cat: Category) => void;
    onDelete: (cat: Category) => void;
};

function CategoryCard({ cat, onEdit, onDelete }: CardProps) {
    const Icon = getIconComponent(cat.icon);

    // --- Tooltip se nome troncato ---
    const nameRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const el = nameRef.current;
        if (el) setShowTooltip(el.scrollWidth > el.clientWidth);
    }, [cat.name]);

    // --- Ripple hover effect (sfumatura + shadow) ---
    const borderColor = cat.color ? "" : cat.type === "entrata" ? "border-green-400" : "border-red-400";
    const focusRing = cat.color
        ? "focus:ring-2 focus:ring-offset-2"
        : cat.type === "entrata"
        ? "focus:ring-green-300"
        : "focus:ring-red-300";

    return (
        <div
            className={`
                rounded-2xl p-2 border-4 flex flex-col items-center justify-between 
                ${focusRing} focus:outline-none focus:ring-offset-2
                min-h-[150px] shadow transition
                ${borderColor}
                shadow-black
                shadow-lg
                hover:shadow-xl 
                group
            `}
            style={{
                borderColor: cat.color,
                background: cat.color ? `linear-gradient(135deg, rgba(0,0,0,0.80) 0%, ${cat.color}44 100%)` : undefined,
            }}
        >
            {/* ----------- 1. Icona + tipo ----------- */}
            <div className="flex items-center gap-2 mb-2">
                <span
                    className="rounded-full p-2 transition-all"
                    style={{
                        background: (cat.color || "#e5e7eb") + "33",
                        color: cat.color || undefined,
                        fontSize: 32,
                    }}
                >
                    <Icon size={28} />
                </span>
                <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition-colors
            ${
                cat.type === "entrata"
                    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                    : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
            }
        `}
                >
                    {cat.type === "entrata" ? "Entrata" : "Spesa"}
                </span>
            </div>

            {/* ----------- 2. Nome categoria (tooltip su overflow) ----------- */}
            <div className="w-full flex justify-center mb-1">
                <div
                    ref={nameRef}
                    className="font-semibold text-lg text-center truncate max-w-[160px] cursor-help"
                    title={showTooltip ? cat.name : undefined}
                >
                    {cat.name}
                </div>
            </div>

            {/* ----------- 3. Bottoni azione ----------- */}
            <div className="flex gap-2 justify-center mt-auto">
                <RippleButton
                    className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                    onClick={() => onEdit(cat)}
                    title="Modifica"
                >
                    <Pencil size={18} />
                </RippleButton>
                <RippleButton
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 text-red-500 transition"
                    onClick={() => onDelete(cat)}
                    title="Elimina"
                >
                    <Trash2 size={18} />
                </RippleButton>
            </div>
        </div>
    );
}

// ============================
// Ripple Button effetto soft
// ============================
type RippleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

function RippleButton({ children, className, ...props }: RippleButtonProps) {
    // Effetto ripple (CSS only, molto leggero)
    return (
        <button
            {...props}
            className={`relative overflow-hidden outline-none focus:ring-2 ${className}`}
            style={{ WebkitTapHighlightColor: "transparent" }}
        >
            {children}
            {/* Sfumatura ripple on focus */}
            <span
                className="absolute inset-0 pointer-events-none opacity-0 group-focus:opacity-60 group-active:opacity-70 rounded-full transition duration-300"
                style={{
                    background: "radial-gradient(circle, rgba(100,200,255,0.2) 40%, transparent 80%)",
                }}
            />
        </button>
    );
}

// ======================================================
