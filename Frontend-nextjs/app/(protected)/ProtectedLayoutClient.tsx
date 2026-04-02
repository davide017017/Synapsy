"use client";

// ==============================
// IMPORT PRINCIPALI
// ==============================
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./layout-components/Sidebar";
import Header from "./layout-components/Header";
import BottomNav from "./layout-components/BottomNav";
import { useSidebar } from "@/context/SidebarContext";

// ==============================
// LAYOUT PROTETTO CON SIDEBAR E HEADER
// ==============================
export default function ProtectedLayoutClient({ children }: { children: React.ReactNode }) {
    // ───── Gestione sessione auth ─────
    const { status } = useSession();
    const { isCollapsed } = useSidebar();
    const router = useRouter();

    // ───── Redirect se non autenticato ─────
    useEffect(() => {
        if (status === "unauthenticated") router.replace("/login");
    }, [status, router]);

    // ───── Mostra nulla durante il loading (skeleton gestito altrove) ─────
    if (status === "loading" || status === "unauthenticated") return null;

    // ───── Layout principale protetto ─────
    return (
        <div className="flex h-screen">
            {/* ===== SIDEBAR ===== */}
            <Sidebar />
            {/* ===== AREA CONTENUTO ===== */}
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? "md:pl-0" : "md:pl-56"}`}>
                <Header />
                <main className="flex-1 p-4 pb-20 md:pb-4">{children}</main>
            </div>
            {/* ===== BOTTOM NAV (solo mobile) ===== */}
            <BottomNav />
        </div>
    );
}

