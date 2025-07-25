// context/GlobalContextProvider.tsx
"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import { TransactionsProvider } from "./contexts/TransactionsContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { SelectionProvider } from "./contexts/SelectionContext";
import { RicorrenzeProvider } from "./contexts/RicorrenzeContext";
import { UserProvider } from "./contexts/UserContext";
import { ThemeContextProvider } from "./contexts/ThemeContext";

export default function GlobalContextProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <UserProvider>
                <ThemeProvider
                    attribute="class" // <--- Usa la classe "dark" su <html>
                    defaultTheme="system" // system = usa impostazione sistema
                    enableSystem
                    storageKey="theme" // key in localStorage
                >
                    <ThemeContextProvider>
                        <CategoriesProvider>
                            <TransactionsProvider>
                                <RicorrenzeProvider>
                                    <SelectionProvider>
                                        <SidebarProvider>{children}</SidebarProvider>
                                    </SelectionProvider>
                                </RicorrenzeProvider>
                            </TransactionsProvider>
                        </CategoriesProvider>
                    </ThemeContextProvider>
                </ThemeProvider>
            </UserProvider>
        </SessionProvider>
    );
}
