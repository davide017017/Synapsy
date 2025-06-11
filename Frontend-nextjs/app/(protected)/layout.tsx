"use client";

// ───────────────────────────────────────────────────────────
// Layout protetto: sidebar, header, contenuto, protezione auth
// ───────────────────────────────────────────────────────────

import { useAuth, useSidebar } from "@/context/GlobalContextProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./layout-components/Sidebar";
import Header from "./layout-components/Header";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const { isCollapsed } = useSidebar();
    const router = useRouter();

    // ────────────────────────────────────────
    // Redirect se non autenticato
    // ────────────────────────────────────────
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading]);

    // ────────────────────────────────────────
    // Loading screen durante verifica auth
    // ────────────────────────────────────────
    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center h-screen text-xl text-gray-500">
                🔐 Verifica accesso in corso...
            </div>
        );
    }

    // ────────────────────────────────────────
    // Layout principale con sidebar + header
    // ────────────────────────────────────────
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? "md:pl-0" : "md:pl-56"}`}>
                <Header />
                <main className="flex-1 p-4">{children}</main>
            </div>
        </div>
    );
}
