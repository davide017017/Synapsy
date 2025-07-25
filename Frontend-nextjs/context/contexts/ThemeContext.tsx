"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
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
    const { setTheme: setNextTheme } = useTheme();
    const { user, update } = useUser();

    const [theme, setThemeState] = useState("dark");

    // Inizializza tema da profilo o localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = localStorage.getItem("theme");
        const initial = user?.theme || stored || "dark";
        setThemeState(initial);
        setNextTheme(initial);
    }, [user?.theme, setNextTheme]);

    // Sincronizza tra tab
    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === "theme" && e.newValue) {
                setThemeState(e.newValue);
                setNextTheme(e.newValue);
            }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, [setNextTheme]);

    const handleSetTheme = (t: string, persist = true) => {
        setThemeState(t);
        setNextTheme(t);
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
