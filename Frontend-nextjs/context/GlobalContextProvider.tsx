"use client";

import { ReactNode } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";

// ─────────────────────────────────────────────
// Wrapper unico per tutti i context globali
// ─────────────────────────────────────────────
export default function GlobalContextProvider({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <DarkModeProvider>
                <SidebarProvider>{children}</SidebarProvider>
            </DarkModeProvider>
        </AuthProvider>
    );
}

// ─────────────────────────────────────────────
// Named exports dei context hook
// ─────────────────────────────────────────────
export { useAuth, useSidebar };
