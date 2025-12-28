"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ThemeSelectorRow — Selettore tema (safe su value null/unknown)
// - Mostra sempre un label valido (fallback)
// - In editing usa il value della riga, non il theme globale
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useId, useMemo } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { themeMeta, availableThemes } from "@/lib/themeUtils";
import { ThemeSelectorRowProps } from "@/types/profilo/row";

export default function ThemeSelectorRow({
    value,
    editing,
    onEdit,
    onSave,
    onCancel,
    disabled = false,
}: ThemeSelectorRowProps) {
    const { theme } = useThemeContext();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();

    // ─────────────────────────────────────────────────────────
    // Fallback: valore tema "sicuro" per evitare undefined
    // ─────────────────────────────────────────────────────────
    const safeValue = useMemo(() => {
        const v = (value ?? "").toString().trim();
        if (v && themeMeta[v as keyof typeof themeMeta]) return v;
        // fallback 1: tema globale (se valido)
        if (theme && themeMeta[theme as keyof typeof themeMeta]) return theme;
        // fallback 2: primo disponibile
        return availableThemes[0] ?? "dark";
    }, [value, theme]);

    // ─────────────────────────────────────────────────────────
    // Chiusura con ESC / click esterno
    // ─────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────
    // Selezione tema
    // ─────────────────────────────────────────────────────────
    const handleSelect = (t: string) => {
        onSave(t);
        setOpen(false);
        buttonRef.current?.focus();
    };

    // ─────────────────────────────────────────────────────────
    // View compatta (non in editing)
    // ─────────────────────────────────────────────────────────
    if (!editing) {
        return (
            <div className="flex items-center px-3 py-3 gap-4 group border-b border-primary/10">
                <div className="w-28 font-medium text-sm text-muted-foreground">Tema</div>

                <div className="flex-1 capitalize">
                    {themeMeta[safeValue as keyof typeof themeMeta]?.label ?? "Tema"}
                </div>

                <div>
                    <button
                        className="opacity-70 group-hover:opacity-100 px-2 py-1 rounded-xl font-semibold text-xs transition"
                        style={{
                            background: "hsl(var(--c-secondary, 220 15% 48%))",
                            color: "hsl(var(--c-bg, 44 81% 94%))",
                            opacity: disabled ? 0.4 : undefined,
                            pointerEvents: disabled ? "none" : undefined,
                        }}
                        onClick={onEdit}
                        disabled={disabled}
                    >
                        Modifica
                    </button>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────
    // Selettore a tendina (editing) — pattern listbox
    // ─────────────────────────────────────────────────────────
    return (
        <div ref={containerRef} className="flex items-center px-3 py-3 gap-4 border-b border-primary/10">
            <div className="w-28 font-medium text-sm text-muted-foreground">Tema</div>

            <div className="flex-1 relative">
                <button
                    ref={buttonRef}
                    type="button"
                    className="w-36 flex items-center justify-between px-3 py-2 rounded-xl border border-primary/30 shadow bg-bg-elevate font-semibold capitalize transition hover:ring-2 hover:ring-primary/40"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    aria-controls={open ? listboxId : undefined}
                >
                    <span>{themeMeta[safeValue as keyof typeof themeMeta]?.label ?? "Tema"}</span>

                    <svg width="18" height="18" className="ml-2 opacity-60" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M5.8 8l4.2 4.2L14.2 8" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </button>

                {open && (
                    <ul
                        id={listboxId}
                        className="absolute z-50 mt-2 w-full bg-bg-elevate border border-primary/20 rounded-xl shadow-lg animate-fade-in overflow-hidden"
                        role="listbox"
                    >
                        {availableThemes.map((t) => (
                            <li
                                key={t}
                                role="option"
                                aria-selected={safeValue === t}
                                tabIndex={-1}
                                className="focus:outline-none"
                            >
                                <button
                                    type="button"
                                    className={`w-full flex items-center gap-2 text-left px-4 py-2 capitalize transition hover:bg-primary/10 ${
                                        safeValue === t ? "font-bold text-primary" : ""
                                    }`}
                                    onClick={() => handleSelect(t)}
                                >
                                    <span
                                        className="inline-block w-4 h-4 rounded-full border border-primary/30"
                                        style={{ background: themeMeta[t]?.color }}
                                        aria-hidden="true"
                                    />
                                    {themeMeta[t]?.label ?? t}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <button
                    className="ml-2 px-2 py-1 rounded-xl font-semibold shadow text-xs transition bg-primary text-bg"
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

/* ------------------------------------------------------
Descrizione file:
ThemeSelectorRow — riga profilo per selezione tema.
Evita crash quando `value` è null/unknown usando `safeValue`
(fallback su theme globale o primo tema disponibile).
In editing e preview mostra label/colore sempre in modo sicuro.
------------------------------------------------------ */
