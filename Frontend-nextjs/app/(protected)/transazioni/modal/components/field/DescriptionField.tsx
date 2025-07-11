import { X } from "lucide-react";
type Props = {
    value: string;
    onChange: (v: string) => void;
    isModified: boolean;
    showError?: boolean;
};

export default function DescriptionField({ value, onChange, isModified, showError }: Props) {
    return (
        <div className="flex flex-col items-center w-full relative">
            <span className="font-semibold text-text mb-1">Descrizione</span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-2xl py-3 px-4 border-green-400 shadow-[0_2px_10px_rgba(0,0,0,0.14)] text-base bg-bg-elevate transition
                    ${isModified ? "ring-2 ring-yellow-400" : ""}
                `}
                required
            />
            {isModified && (
                <button
                    type="button"
                    className="absolute top-8 right-2 p-1 rounded-full bg-yellow-100 hover:bg-yellow-300 shadow transition"
                    title="Resetta valore"
                    // Reset via onChange("") se vuoi
                >
                    <X size={16} className="text-yellow-600" />
                </button>
            )}
            {showError && (
                <div className="text-red-500 text-xs mt-1 w-full text-center">La descrizione è obbligatoria.</div>
            )}
        </div>
    );
}
