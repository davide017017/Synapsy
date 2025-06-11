"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { SidebarContextType } from "@/types";

// ─────────────────────────────────────────────
// Context per gestire apertura/chiusura sidebar
// ─────────────────────────────────────────────

// 1. Creazione del context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// 2. Provider che gestisce lo stato della sidebar
export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    return <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>{children}</SidebarContext.Provider>;
}

// 3. Hook personalizzato per accedere al context
export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar deve essere usato dentro <SidebarProvider>");
    }
    return context;
}
