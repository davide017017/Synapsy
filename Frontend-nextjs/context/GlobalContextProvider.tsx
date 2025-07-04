// context/GlobalContextProvider.tsx
"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import { NewTransactionProvider } from "./contexts/NewTransactionContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import { SelectionProvider } from "./contexts/SelectionContext";
import { RicorrenzeProvider } from "./contexts/RicorrenzeContext";

export default function GlobalContextProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <DarkModeProvider>
                <CategoriesProvider>
                    <NewTransactionProvider>
                        <RicorrenzeProvider>
                            <SelectionProvider>
                                <SidebarProvider>{children}</SidebarProvider>
                            </SelectionProvider>
                        </RicorrenzeProvider>
                    </NewTransactionProvider>
                </CategoriesProvider>
            </DarkModeProvider>
        </SessionProvider>
    );
}

export { useSidebar };
