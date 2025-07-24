import { X } from "lucide-react";
import { Category } from "@/types/types/category";
import type { CategoryFieldProps } from "@/types/transazioni/modal/components/field";

export default function CategoryField({ value, categories, onChange, original, showError }: CategoryFieldProps) {
    const isModified = value !== original;
    return (
        <div className="flex flex-col items-center w-full relative">
            <span className="font-semibold text-text mb-1">Categoria</span>
            <select
                value={value || ""}
                onChange={(e) => {
                    const id = Number(e.target.value);
                    const cat = categories.find((c) => c.id === id);
                    onChange(id, cat);
                }}
                className={`w-full rounded-2xl py-3 px-4 border-green-400 shadow-[0_2px_10px_rgba(0,0,0,0.14)] text-base bg-bg-elevate transition ${
                    isModified ? "ring-2 ring-yellow-400" : ""
                }`}
                required
            >
                <option value="">Seleziona</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>
            {isModified && (
                <button
                    type="button"
                    className="absolute top-8 right-2 p-1 rounded-full bg-yellow-100 hover:bg-yellow-300 shadow transition"
                    title="Resetta valore"
                    onClick={() => onChange(original ?? 0, categories.find((cat) => cat.id === original))}
                    aria-label="Resetta categoria"
                >
                    <X size={16} className="text-yellow-600" />
                </button>
            )}
            {showError && <div className="text-red-500 text-xs mt-2 w-full text-center">Seleziona una categoria.</div>}
        </div>
    );
}
