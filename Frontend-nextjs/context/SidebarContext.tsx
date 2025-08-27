"use client";

/* ╔═══════════════════════════════════════════════════════╗
 * ║ SidebarContext — Stato apertura/chiusura              ║
 * ╚═══════════════════════════════════════════════════════╝ */

import type { ReactNode } from "react";
import { createContext, useContext, useState, useCallback } from "react";
import type { SidebarContextType } from "@/types";

// 1) Creazione del context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// 2) Provider
export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleSidebar = useCallback(() => setIsCollapsed((prev) => !prev), []);

    return <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>{children}</SidebarContext.Provider>;
}

// 3) Hook custom
export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebar deve essere usato dentro <SidebarProvider>");
    return context;
}
