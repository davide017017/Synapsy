"use client";

// ╔══════════════════════════════════════════════╗
// ║            Sidebar Component                ║
// ╚══════════════════════════════════════════════╝

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    BarChart,
    CalendarCheck,
    Folder,
    User,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    ListOrdered,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useThemeContext } from "@/context/ThemeContext";
import { useState, useEffect } from "react";

import BetaBadge from "@/app/components/BetaBadge";
import LegalLinks from "@/app/components/legal/LegalLinks";
import { themeMeta } from "@/lib/themeUtils";

// ────────────────────────────────
// Configurazione navigazione
// ────────────────────────────────
const navItems = [
    { href: "/", label: "Home", icon: <Home size={18} /> },
    { href: "/panoramica", label: "Panoramica", icon: <BarChart size={18} /> },
    { href: "/transazioni", label: "Transazioni", icon: <ListOrdered size={18} /> },
    { href: "/ricorrenti", label: "Ricorrenti", icon: <CalendarCheck size={18} /> },
    { href: "/categorie", label: "Categorie", icon: <Folder size={18} /> },
    { href: "/profilo", label: "Profilo", icon: <User size={18} /> },
];

// ────────────────────────────────
// Temi custom opzionali
// ────────────────────────────────
const extraThemes = ["emerald", "solarized"];

// ╔══════════════════════════════════════════════╗
// ║             Sidebar principale              ║
// ╚══════════════════════════════════════════════╝
export default function Sidebar() {
    // ========== Stato sidebar ==========
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [isOpenMobile, setIsOpenMobile] = useState(false);

    // ─────────── LISTENER: chiusura da header ───────────
    useEffect(() => {
      const handleCloseSidebar = () => setIsOpenMobile(false);

      window.addEventListener("closeSidebarMobile", handleCloseSidebar);
      return () => window.removeEventListener("closeSidebarMobile", handleCloseSidebar);
    }, []);

    const pathname = usePathname();

    // ========== Gestione temi ==========
    const { theme, setTheme } = useThemeContext();
    const isDark = theme === "dark";

    // ========== Helper ==========
    const toggleMobile = () => {
      const next = !isOpenMobile;

      // se la sto aprendo → dico all'header di chiudere il suo menu
      if (next) {
        window.dispatchEvent(new Event("closeHeaderUserMenu"));
      }

      setIsOpenMobile(next);
    };

    // ────────────────────────────────
    //           RENDER
    // ────────────────────────────────
    return (
        <>
            {/* ========== Burger mobile ========== */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-full bg-primary text-white shadow-lg"
                onClick={toggleMobile}
            >
                {isOpenMobile ? <X size={20} /> : <Menu size={20} />}
            </button>
            {/* 🔹 OVERLAY MOBILE: click fuori chiude la sidebar */}
            {isOpenMobile && (
                <div
                    className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpenMobile(false)}
                />
            )}

            {/* ========== Collapse desktop ========== */}
            <button
                onClick={toggleSidebar}
                className={`hidden md:flex fixed top-4 z-50 p-1.5 rounded-full bg-primary text-white shadow-md hover:bg-primary/80 transition ${
                    isCollapsed ? "left-3" : "left-56"
                }`}
            >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* ════════════════════════════════════
                Pannello Sidebar principale
            ════════════════════════════════════ */}
            <aside
                className={`fixed top-0 left-0 h-full z-40 w-56 bg-black/60 backdrop-blur-md border-r border-white/10 text-white
                    transform transition-transform duration-300
                    ${isOpenMobile ? "block" : "hidden"} md:block
                    ${isCollapsed ? "-translate-x-full md:-translate-x-56" : "translate-x-0"}`}
            >
                {/* ----------- Logo ----------- */}
                <Link
                    href="/"
                    className="flex items-center justify-center p-4 border-b border-white/10 hover:opacity-90"
                    onClick={() => setIsOpenMobile(false)}
                >
                    <span className="ml-2 text-xl font-bold text-primary">Synapsi</span>
                    <BetaBadge inline className="ml-1" />
                </Link>

                {/* ----------- Navigazione ----------- */}
                <nav className="p-2 space-y-1">
                    {navItems.map(({ href, label, icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setIsOpenMobile(false)}
                                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition ${
                                    active
                                        ? "bg-[hsl(var(--c-primary))] text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                {icon}
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* ════════════════════════════════════
                    Selettore temi (light/dark/custom)
                ════════════════════════════════════ */}
                <div className="p-4 border-t border-white/10 grid grid-cols-2 gap-2">
                    {["light", "dark", ...extraThemes].map((t) => {
                        const isActive = theme === t;
                        const label = themeMeta[t as keyof typeof themeMeta].label;
                        const icon = t === "light" ? <Sun size={18} /> : t === "dark" ? <Moon size={18} /> : null;

                        return (
                            <button
                                key={t}
                                onClick={() => setTheme(t as any)}
                                className={`flex items-center justify-center gap-2 py-2 rounded font-medium transition
                                    ${isActive ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                            >
                                {icon}
                                {label}
                            </button>
                        );
                    })}
                </div>
                <LegalLinks className="p-4 border-t border-white/10 text-center" />
            </aside>
        </>
    );
}
