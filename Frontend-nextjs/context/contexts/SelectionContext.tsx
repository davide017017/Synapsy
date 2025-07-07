"use client";

// ╔══════════════════════════════════════════════════════════╗
// ║     SelectionContext — Multi-selezione globale          ║
// ║     Gestisce la modalità selezione e gli ID scelti      ║
// ╚══════════════════════════════════════════════════════════╝

import React, { createContext, useContext, useState } from "react";

// ============================
// Tipi del context
// ============================
type SelectionContextType = {
    isSelectionMode: boolean; // Modalità selezione attiva
    setIsSelectionMode: (v: boolean) => void; // Cambia modalità selezione
    selectedIds: number[]; // Id selezionati
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>; // Modifica selezione
};

// ============================
// Creazione del context
// ============================
const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

// ============================
// Provider: espone stato globale selezione
// ============================
export function SelectionProvider({ children }: { children: React.ReactNode }) {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    return (
        <SelectionContext.Provider value={{ isSelectionMode, setIsSelectionMode, selectedIds, setSelectedIds }}>
            {children}
        </SelectionContext.Provider>
    );
}

// ============================
// Hook custom per accedere al context
// ============================
export function useSelection() {
    const ctx = useContext(SelectionContext);
    if (!ctx) throw new Error("useSelection deve essere usato dentro <SelectionProvider>");
    return ctx;
}

// ===============================================================
