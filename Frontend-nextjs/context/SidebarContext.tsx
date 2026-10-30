"use client";

/* ╔═══════════════════════════════════════════════════════╗
 * ║ SidebarContext — Stato apertura/chiusura              ║
 * ║ - isCollapsed: sidebar desktop                        ║
 * ║ - isMobileOpen: menu mobile (letto da layout, ☰, menu)║
 * ╚═══════════════════════════════════════════════════════╝ */

import type { ReactNode } from "react";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { SidebarContextType } from "@/types";

// 1) Creazione del context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// 2) Provider
export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const toggleSidebar = useCallback(() => setIsCollapsed((prev) => !prev), []);

    // Apertura menu mobile → chiude il menu utente dell'header
    const openMobile = useCallback(() => {
        window.dispatchEvent(new Event("closeHeaderUserMenu"));
        setIsMobileOpen(true);
    }, []);
    const closeMobile = useCallback(() => setIsMobileOpen(false), []);

    // ─────────── LISTENER: chiusura da header ───────────
    useEffect(() => {
        window.addEventListener("closeSidebarMobile", closeMobile);
        return () => window.removeEventListener("closeSidebarMobile", closeMobile);
    }, [closeMobile]);

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobileOpen, openMobile, closeMobile }}>
            {children}
        </SidebarContext.Provider>
    );
}

// 3) Hook custom
export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebar deve essere usato dentro <SidebarProvider>");
    return context;
}
