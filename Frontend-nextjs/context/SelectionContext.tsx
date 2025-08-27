"use client";

/* ╔══════════════════════════════════════════════════════════╗
 * ║ SelectionContext — Multi-selezione globale               ║
 * ║ Gestisce modalità selezione e lista di ID selezionati    ║
 * ╚══════════════════════════════════════════════════════════╝ */

import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useCallback } from "react";

// ============================
// Tipi del context
// ============================
type SelectionContextType = {
    isSelectionMode: boolean;
    setIsSelectionMode: (v: boolean) => void;
    selectedIds: number[];
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;

    // helper opzionali
    toggleId: (id: number) => void;
    clear: () => void;
};

// ============================
// Creazione del context
// ============================
const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

// ============================
// Provider
// ============================
export function SelectionProvider({ children }: { children: ReactNode }) {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleId = useCallback((id: number) => {
        setSelectedIds((curr) => (curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]));
    }, []);

    const clear = useCallback(() => setSelectedIds([]), []);

    return (
        <SelectionContext.Provider
            value={{ isSelectionMode, setIsSelectionMode, selectedIds, setSelectedIds, toggleId, clear }}
        >
            {children}
        </SelectionContext.Provider>
    );
}

// ============================
// Hook custom
// ============================
export function useSelection() {
    const ctx = useContext(SelectionContext);
    if (!ctx) throw new Error("useSelection deve essere usato dentro <SelectionProvider>");
    return ctx;
}
