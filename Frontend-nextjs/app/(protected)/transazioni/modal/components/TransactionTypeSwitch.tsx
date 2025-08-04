// ================================
// Switch Entrata/Spesa
// ================================
import { FC } from "react";
import type { TransactionTypeSwitchProps } from "@/types/transazioni/modal";

const TransactionTypeSwitch: FC<TransactionTypeSwitchProps> = ({ selectedType, setSelectedType, disabled }) => (
    <div className="flex justify-center mb-4 gap-2">
        <button
            type="button"
            className={`px-4 py-2 rounded-l-xl font-bold text-lg border-2 border-green-500 ${
                selectedType === "entrata" ? "bg-green-600 text-white" : "bg-bg-elevate text-text"
            } transition`}
            onClick={() => setSelectedType("entrata")}
            disabled={disabled}
        >
            Entrata
        </button>
        <button
            type="button"
            className={`px-4 py-2 rounded-r-xl font-bold text-lg border-2 border-red-500 ${
                selectedType === "spesa" ? "bg-red-600 text-white" : "bg-bg-elevate text-text"
            } transition`}
            onClick={() => setSelectedType("spesa")}
            disabled={disabled}
        >
            Spesa
        </button>
    </div>
);

export default TransactionTypeSwitch;

