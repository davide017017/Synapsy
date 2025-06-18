// context/GlobalContextProvider.tsx
"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";

export default function GlobalContextProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <DarkModeProvider>
                <SidebarProvider>{children}</SidebarProvider>
            </DarkModeProvider>
        </SessionProvider>
    );
}

export { useSidebar };
