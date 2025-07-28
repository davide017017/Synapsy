"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

// ==============================
// Tipizzazione
// ==============================
export type ThemeContextType = {
    theme: string;
    setTheme: (theme: string, persist?: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ==============================
// Provider
// ==============================
export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
    const { user, update } = useUser();

    const [theme, setThemeState] = useState("dark");

    // Inizializza tema da profilo utente
    useEffect(() => {
        if (typeof window === "undefined") return;
        const initial = user?.theme || "dark";
        setThemeState(initial);
    }, [user?.theme]);

    // Applica la classe al tag html
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.className = theme;
        }
    }, [theme]);

    const handleSetTheme = (t: string, persist = true) => {
        setThemeState(t);
        if (persist) update({ theme: t });
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useThemeContext deve essere usato dentro <ThemeContextProvider>");
    return ctx;
}
