"use client";

// ============================
// RicorrenzeContext.tsx
// Context globale per gestire stato ricorrenze + filtri
// ============================

import { createContext, useContext, useState, ReactNode } from "react";
import { Ricorrenza } from "@/types";
import { mockRicorrenze } from "../mockRicorrenze";

// ----------------------------
// Tipizzazione valori context
// ----------------------------
type RicorrenzeContextType = {
    ricorrenze: Ricorrenza[];
    setRicorrenze: (r: Ricorrenza[]) => void;
    filtroScadenze: "tutti" | "settimana" | "mese";
    setFiltroScadenze: (v: "tutti" | "settimana" | "mese") => void;
    // ...aggiungi altre azioni/mutazioni qui
};

// ----------------------------
// Context + custom hook
// ----------------------------
const RicorrenzeContext = createContext<RicorrenzeContextType | undefined>(undefined);

export function useRicorrenze() {
    const ctx = useContext(RicorrenzeContext);
    if (!ctx) throw new Error("useRicorrenze deve essere usato dentro RicorrenzeProvider");
    return ctx;
}

// ----------------------------
// Provider: avvolgi qui l'app o la sezione
// ----------------------------
export function RicorrenzeProvider({ children }: { children: ReactNode }) {
    // --- Stato globale ricorrenze e filtro scadenze ---
    const [ricorrenze, setRicorrenze] = useState<Ricorrenza[]>(mockRicorrenze);
    const [filtroScadenze, setFiltroScadenze] = useState<"tutti" | "settimana" | "mese">("tutti");

    // --- Puoi aggiungere qui add/edit/delete ---

    return (
        <RicorrenzeContext.Provider value={{ ricorrenze, setRicorrenze, filtroScadenze, setFiltroScadenze }}>
            {children}
        </RicorrenzeContext.Provider>
    );
}

// ============================
// END RicorrenzeContext.tsx
// ============================
