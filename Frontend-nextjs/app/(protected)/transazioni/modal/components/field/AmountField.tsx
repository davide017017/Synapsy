import { X } from "lucide-react";
import type { AmountFieldProps } from "@/types/transazioni/modal/components/field";

export default function AmountField({ value, onChange, original, showError }: AmountFieldProps) {
    const isModified = value !== original;
    return (
        <div className="flex flex-col items-center w-full sm:w-1/2 relative">
            <span className="font-semibold text-text mb-1">Importo</span>
            <input
                type="number"
                min={0.01}
                step={0.01}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={`w-full text-center rounded-2xl py-3 px-4 border-green-400 shadow-[0_2px_10px_rgba(0,0,0,0.14)] text-lg font-semibold bg-bg-elevate transition ${
                    isModified ? "ring-2 ring-yellow-400" : ""
                }`}
                required
            />
            {isModified && (
                <button
                    type="button"
                    className="absolute top-8 right-2 p-1 rounded-full bg-yellow-100 hover:bg-yellow-300 shadow transition"
                    title="Resetta valore"
                    onClick={() => onChange(original)}
                    aria-label="Resetta importo"
                >
                    <X size={16} className="text-yellow-600" />
                </button>
            )}
            {showError && (
                <div className="text-red-500 text-xs mt-1 w-full text-center">
                    Importo obbligatorio e maggiore di zero.
                </div>
            )}
        </div>
    );
}

