"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

export type Theme = "light" | "dark" | "emerald" | "solarized";

export type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme, persist?: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
    const { user, update } = useUser();
    const [theme, setThemeState] = useState<Theme>("dark");

    // Inizializza tema da localStorage o user
    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = localStorage.getItem("theme") as Theme | null;
        const initial = user?.theme as Theme | undefined;
        setThemeState(initial || stored || "dark");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.theme]); // si aggiorna se cambia il profilo

    // Applica classe e data-theme su <html>
    useEffect(() => {
        document.documentElement.className = theme;
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // SetTheme: anteprima (persist === false) o salvataggio (persist === true, default)
    const setTheme = (newTheme: Theme, persist = true) => {
        setThemeState(newTheme);
        document.documentElement.className = newTheme;
        document.documentElement.setAttribute("data-theme", newTheme);
        if (persist) {
            localStorage.setItem("theme", newTheme);
            // aggiorna backend
            update({ theme: newTheme });
        }
    };

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useThemeContext deve essere usato dentro ThemeContextProvider");
    return ctx;
}
