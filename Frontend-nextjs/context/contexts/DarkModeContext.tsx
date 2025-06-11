"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { DarkModeContextType } from "@/types";

// ─────────────────────────────────────────────
// Context per gestione del tema dark/light globale
// ─────────────────────────────────────────────

// 1. Creazione del context
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// 2. Provider che gestisce lo stato del tema
export function DarkModeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    const toggleDarkMode = () => setIsDark((prev) => !prev);

    return <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
}

// 3. Hook personalizzato per accedere al context
export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("useDarkMode deve essere usato dentro <DarkModeProvider>");
    }
    return context;
}
