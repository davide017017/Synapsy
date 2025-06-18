"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { DarkModeContextType } from "@/types";

/* ╔════════════  Context  ════════════╗ */
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

/* ╔════════════  Provider  ═══════════╗ */
export function DarkModeProvider({ children }: { children: ReactNode }) {
    /* 1️⃣  Stato iniziale: localStorage → prefers-color-scheme */
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === "undefined") return false; // SSR fallback
        const saved = localStorage.getItem("theme");
        if (saved === "dark" || saved === "light") return saved === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    /* 2️⃣  Aggiorna <html class="dark"> e salva */
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    const toggleDarkMode = () => setIsDark((prev) => !prev);

    return <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
}

/* ╔════════════  Hook  ═══════════════╗ */
export function useDarkMode() {
    const ctx = useContext(DarkModeContext);
    if (!ctx) {
        throw new Error("useDarkMode deve essere usato dentro <DarkModeProvider>");
    }
    return ctx;
}
