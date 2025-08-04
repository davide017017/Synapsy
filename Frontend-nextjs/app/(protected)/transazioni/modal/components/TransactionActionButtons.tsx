// ================================
// TransactionActionButtons.tsx
// ================================
import { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import type { TransactionActionButtonsProps } from "@/types/transazioni/modal";

export default function TransactionActionButtons({
    onSave,
    onClose,
    onDelete,
    loading,
    isSaveDisabled,
    saveTooltipMessage,
}: TransactionActionButtonsProps) {
    const [showSaveTooltip, setShowSaveTooltip] = useState(false);

    return (
        <div className="flex flex-row gap-3 mt-10 justify-center w-full">
            <div className="relative flex-1 flex items-center justify-center">
                <button
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 
                        rounded-xl font-bold shadow-lg text-base transition
                        ${
                            isSaveDisabled
                                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                        }
                        focus:outline-none focus:ring-4 focus:ring-green-300`}
                    onClick={onSave}
                    disabled={isSaveDisabled || loading === "save"}
                    onMouseEnter={() => isSaveDisabled && setShowSaveTooltip(true)}
                    onMouseLeave={() => setShowSaveTooltip(false)}
                    tabIndex={0}
                    aria-label="Salva"
                    type="button"
                >
                    <Check size={22} />
                    <span className="hidden sm:inline">Salva</span>
                </button>
                {isSaveDisabled && showSaveTooltip && saveTooltipMessage && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-900 border border-yellow-400 rounded-xl px-3 py-1 text-xs shadow-xl z-50">
                        {saveTooltipMessage}
                    </div>
                )}
            </div>
            <button
                className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl font-bold shadow-lg text-base
                    bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-100 hover:bg-red-100 dark:hover:bg-zinc-900
                    transition focus:outline-none focus:ring-4 focus:ring-red-300 active:scale-95"
                onClick={onClose}
                disabled={loading !== null}
                aria-label="Esci"
            >
                <X size={22} />
                <span className="hidden sm:inline">Esci</span>
            </button>
            {onDelete && (
                <button
                    className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl font-bold shadow-lg text-base
                        bg-red-600 text-white hover:bg-red-700 active:scale-95
                        transition focus:outline-none focus:ring-4 focus:ring-red-600"
                    onClick={onDelete}
                    disabled={loading !== null}
                    aria-label="Elimina"
                >
                    <Trash2 size={20} />
                    <span className="hidden sm:inline">Elimina</span>
                </button>
            )}
        </div>
    );
}

