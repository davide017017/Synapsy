// ==========================
// YearDropdown.tsx
// ==========================
import React, { useState, useRef } from "react";

type Props = {
    value: number;
    options: number[];
    onChange: (val: number) => void;
};

export default function YearDropdown({ value, options, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Chiudi dropdown se clicchi fuori
    React.useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative inline-block text-left">
            <button
                type="button"
                className="bg-bg border border-primary/40 rounded-lg px-2 py-1 text-base font-semibold focus:ring-2 focus:ring-primary transition flex items-center gap-1"
                onClick={() => setOpen((v) => !v)}
            >
                {value}
                <svg width="18" height="18" viewBox="0 0 20 20" className="inline ml-1">
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </button>
            {open && (
                <div className="absolute left-0 z-10 mt-1 w-28 rounded-md shadow-lg bg-bg border border-primary/20 py-1 max-h-64 overflow-y-auto animate-fade-in">
                    {options.map((year) => (
                        <button
                            key={year}
                            className={`block w-full text-left px-4 py-1 text-base font-medium rounded hover:bg-primary/10 transition ${
                                year === value ? "bg-primary/10 text-primary" : "text-text"
                            }`}
                            onClick={() => {
                                onChange(year);
                                setOpen(false);
                            }}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
