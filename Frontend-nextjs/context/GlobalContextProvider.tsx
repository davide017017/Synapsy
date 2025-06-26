// context/GlobalContextProvider.tsx
"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import { NewTransactionProvider } from "./contexts/NewTransactionContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";

export default function GlobalContextProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <DarkModeProvider>
                <CategoriesProvider>
                    <NewTransactionProvider>
                        <SidebarProvider>{children}</SidebarProvider>
                    </NewTransactionProvider>
                </CategoriesProvider>
            </DarkModeProvider>
        </SessionProvider>
    );
}

export { useSidebar };
