"use client";

/* ╔═══════════════════════════════════════════════════════╗
 * ║ ThemeContext — Tema utente (persistenza + preview)    ║
 * ╚═══════════════════════════════════════════════════════╝ */

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useUser } from "./UserContext";

export type Theme = "light" | "dark" | "emerald" | "solarized";

export type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme, persist?: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
    const { user, update } = useUser();
    const [theme, setThemeState] = useState<Theme>("dark");

    // Inizializza tema da localStorage o profilo utente
    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = (localStorage.getItem("theme") as Theme | null) ?? undefined;
        const initial = (user?.theme as Theme | undefined) ?? stored ?? "dark";
        setThemeState(initial);
    }, [user?.theme]);

    // Applica classe e data-theme su <html>
    useEffect(() => {
        if (typeof document === "undefined") return;
        document.documentElement.className = theme;
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // setTheme: anteprima (persist === false) o salvataggio (persist === true, default)
    const setTheme = useCallback(
        (newTheme: Theme, persist = true) => {
            setThemeState(newTheme);

            if (typeof document !== "undefined") {
                document.documentElement.className = newTheme;
                document.documentElement.setAttribute("data-theme", newTheme);
            }

            if (persist && typeof window !== "undefined") {
                localStorage.setItem("theme", newTheme);
                // aggiorna backend
                update({ theme: newTheme });
            }
        },
        [update]
    );

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useThemeContext deve essere usato dentro ThemeContextProvider");
    return ctx;
}
