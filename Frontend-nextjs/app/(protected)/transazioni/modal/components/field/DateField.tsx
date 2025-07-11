import { X } from "lucide-react";
type Props = {
    value: string;
    onChange: (v: string) => void;
    isModified: boolean;
};

export default function DateField({ value, onChange, isModified }: Props) {
    return (
        <div className="flex flex-col items-center w-full sm:w-1/2 relative">
            <span className="font-semibold text-text mb-1">Data</span>
            <input
                type="date"
                value={value.slice(0, 10)}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full text-center rounded-2xl py-3 px-4 border-green-400 shadow-[0_2px_10px_rgba(0,0,0,0.14)] text-lg font-semibold bg-bg-elevate transition
                    ${isModified ? "ring-2 ring-yellow-400" : ""}
                `}
                required
            />
            {isModified && (
                <button
                    type="button"
                    className="absolute top-8 right-2 p-1 rounded-full bg-yellow-100 hover:bg-yellow-300 shadow transition"
                    title="Resetta valore"
                    // Reset via onChange() se vuoi
                >
                    <X size={16} className="text-yellow-600" />
                </button>
            )}
        </div>
    );
}
