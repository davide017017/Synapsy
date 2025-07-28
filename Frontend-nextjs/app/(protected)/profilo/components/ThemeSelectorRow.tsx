"use client";
import { useState, useRef, useEffect } from "react";
import { useThemeContext } from "@/context/contexts/ThemeContext";
import { themeMeta, availableThemes } from "@/lib/themeUtils";

interface ThemeSelectorRowProps {
    value: string;
    editing: boolean | undefined;
    onEdit: () => void;
    onSave: (val: string) => void;
    onCancel: () => void;
}

export default function ThemeSelectorRow({ value, editing, onEdit, onSave, onCancel }: ThemeSelectorRowProps) {
    const { theme } = useThemeContext();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Gestione chiusura con ESC e click fuori
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                onCancel();
                buttonRef.current?.focus();
            }
        };
        const handleClick = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node) &&
                !buttonRef.current?.contains(e.target as Node)
            ) {
                setOpen(false);
                onCancel();
            }
        };
        document.addEventListener("keydown", handleKey);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.removeEventListener("mousedown", handleClick);
        };
    }, [open, onCancel]);

    // Cambia subito tema al click su opzione
    const handleSelect = (t: string) => {
        // Delega al parent l'applicazione del tema
        onSave(t);
        setOpen(false);
        buttonRef.current?.focus();
    };

    // UI: riga profilo (se non editing)
    if (!editing) {
        return (
            <div className="flex items-center px-3 py-3 gap-4 group border-b border-primary/10">
                <div className="w-28 font-medium text-sm text-muted-foreground">Tema</div>
                <div className="flex-1 capitalize">{themeMeta[value as keyof typeof themeMeta].label}</div>
                <div>
                    <button
                        className="opacity-70 group-hover:opacity-100 px-2 py-1 rounded font-semibold text-xs transition"
                        style={{
                            background: "hsl(var(--c-secondary, 220 15% 48%))",
                            color: "hsl(var(--c-bg, 44 81% 94%))",
                        }}
                        onClick={onEdit}
                    >
                        Modifica
                    </button>
                </div>
            </div>
        );
    }

    // UI: selettore a tendina, responsive e accessibile
    return (
        <div
            ref={containerRef}
            className="flex items-center px-3 py-3 gap-4 border-b border-primary/10"
        >
            <div className="w-28 font-medium text-sm text-muted-foreground">Tema</div>
            <div className="flex-1 relative">
                <button
                    ref={buttonRef}
                    type="button"
                    className="w-36 flex items-center justify-between px-3 py-2 rounded-xl border border-primary/30 shadow bg-bg-elevate font-semibold capitalize transition hover:ring-2 hover:ring-primary/40"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-haspopup="listbox"
                >
                    <span>{themeMeta[theme as keyof typeof themeMeta].label}</span>
                    <svg width="18" height="18" className="ml-2 opacity-60" viewBox="0 0 20 20">
                        <path d="M5.8 8l4.2 4.2L14.2 8" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </button>
                {open && (
                    <ul
                        className="absolute z-50 mt-2 w-full bg-bg-elevate border border-primary/20 rounded-xl shadow-lg animate-fade-in overflow-hidden"
                        role="listbox"
                    >
                        {availableThemes.map((t) => (
                            <li key={t}>
                                <button
                                    type="button"
                                    className={`w-full flex items-center gap-2 text-left px-4 py-2 capitalize transition hover:bg-primary/10 ${
                                        theme === t ? "font-bold text-primary" : ""
                                    }`}
                                    onClick={() => handleSelect(t)}
                                    aria-selected={theme === t}
                                >
                                    {/* --- Preview colore circolare --- */}
                                    <span
                                        className="inline-block w-4 h-4 rounded-full border border-primary/30"
                                        style={{ background: themeMeta[t].color }}
                                    />
                                    {themeMeta[t].label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <button
                    className="ml-2 px-2 py-1 rounded font-semibold shadow text-xs transition bg-primary text-bg"
                    onClick={() => {
                        setOpen(false);
                        onCancel();
                    }}
                >
                    Chiudi
                </button>
            </div>
        </div>
    );
}
