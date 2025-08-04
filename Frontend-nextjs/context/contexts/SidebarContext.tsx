"use client";

/* ╔═══════════════════════════════════════════════════════╗
 * ║      SidebarContext — Stato apertura/chiusura        ║
 * ╚═══════════════════════════════════════════════════════╝ */

import { createContext, useContext, useState, ReactNode } from "react";
import type { SidebarContextType } from "@/types";

// ════════════════════════════════════════════════════════
// 1. Creazione del context
// ════════════════════════════════════════════════════════
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// ════════════════════════════════════════════════════════
// 2. Provider — gestisce stato sidebar
// ════════════════════════════════════════════════════════
export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    return <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>{children}</SidebarContext.Provider>;
}

// ════════════════════════════════════════════════════════
// 3. Hook custom per usare il context
// ════════════════════════════════════════════════════════
export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar deve essere usato dentro <SidebarProvider>");
    }
    return context;
}

// ════════════════════════════════════════════════════════

