"use client";

interface Props {
    checked: boolean;
    onToggle: () => void;
}

export default function RememberMeSwitch({ checked, onToggle }: Props) {
    return (
        <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
            {/* interruttore */}
            <div
                className={`relative w-10 h-6 transition rounded-full ${checked ? "bg-primary" : "bg-gray-400"}`}
                onClick={onToggle}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        checked ? "translate-x-4" : ""
                    }`}
                />
            </div>

            {/* etichetta */}
            <span className="text-white">Ricorda la mia e-mail</span>
            {/* oppure:  Ricordami (solo e-mail) */}
        </label>
    );
}

