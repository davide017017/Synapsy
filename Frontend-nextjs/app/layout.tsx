// app/providers.tsx
// ─────────────────────────────────────────────────────────────
// Client wrapper: NextAuth + Theme + User + Toaster (SONNER)
// ─────────────────────────────────────────────────────────────
"use client";

import type { ReactNode } from "react"; // <-- usa il tipo, niente import runtime
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserContext";
import { ThemeContextProvider } from "@/context/ThemeContext";

export default function Providers({ children }: { children: ReactNode }) {
    // -- tutti i context client-only qui dentro --
    return (
        <>
            {/* Toaster globale */}
            <Toaster
                position="top-center"
                theme="light"
                richColors
                closeButton
                expand
                duration={6000}
                visibleToasts={4}
                className="font-semibold text-base tracking-wide"
                toastOptions={{
                    style: {
                        borderRadius: "1.2rem",
                        boxShadow: "0 8px 32px 0 rgba(50,90,120,0.14)",
                        border: "1.5px solid hsl(var(--c-border,220,15%,70%))",
                        fontSize: "1rem",
                        letterSpacing: "0.01em",
                        maxWidth: "380px",
                        minWidth: "280px",
                        padding: "0.8rem 1rem",
                    },
                }}
            />

            {/* Gerarchia provider */}
            <SessionProvider>
                <UserProvider>
                    <ThemeContextProvider>{children}</ThemeContextProvider>
                </UserProvider>
            </SessionProvider>
        </>
    );
}
