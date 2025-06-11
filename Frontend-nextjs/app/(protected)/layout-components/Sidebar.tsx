"use client";

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
} from "lucide-react";
import { useSidebar } from "@/context/contexts/SidebarContext";
import { useDarkMode } from "@/context/contexts/DarkModeContext";
import { useState } from "react";

// ─────────────────────────────────────────────
// Sidebar laterale con toggle, tema, link navigazione
// ─────────────────────────────────────────────

const navItems = [
    { href: "/", label: "Home", icon: <Home size={18} /> },
    { href: "/riepilogo", label: "Panoramica", icon: <BarChart size={18} /> },
    { href: "/ricorrenti", label: "Ricorrenti", icon: <CalendarCheck size={18} /> },
    { href: "/categorie", label: "Categorie", icon: <Folder size={18} /> },
    { href: "/profilo", label: "Profilo", icon: <User size={18} /> },
];

export default function Sidebar() {
    const { isCollapsed, toggleSidebar } = useSidebar();
    const { isDark, toggleDarkMode } = useDarkMode();
    const pathname = usePathname();
    const [isOpenMobile, setIsOpenMobile] = useState(false);

    return (
        <>
            {/* ────────── Mobile menu toggle ────────── */}
            <button
                className="fixed top-4 left-4 z-30 md:hidden p-2 rounded-full bg-primary text-white shadow-lg"
                onClick={() => setIsOpenMobile(!isOpenMobile)}
            >
                {isOpenMobile ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* ────────── Collapse button (desktop) ────────── */}
            <button
                onClick={toggleSidebar}
                className={`hidden md:flex fixed top-4 z-30 p-1.5 rounded-full bg-primary text-white shadow-md hover:bg-primary/80 transition ${
                    isCollapsed ? "left-3" : "left-56"
                }`}
            >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* ────────── Sidebar ────────── */}
            <aside
                className={`fixed top-0 left-0 h-full z-20 w-56 bg-black/60 backdrop-blur-md border-r border-white/10 text-white transform transition-all duration-300
                    ${isOpenMobile ? "block" : "hidden"} md:block
                    ${isCollapsed ? "-translate-x-full md:-translate-x-56" : "translate-x-0"}`}
            >
                {/* ───── Logo / brand ───── */}
                <Link
                    href="/"
                    className="flex items-center justify-center p-4 border-b border-white/10 hover:opacity-90"
                >
                    <span className="ml-2 text-xl font-bold text-primary">Synapsi</span>
                </Link>

                {/* ───── Menu di navigazione ───── */}
                <nav className="p-2 space-y-1">
                    {navItems.map(({ href, label, icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition ${
                                    isActive
                                        ? "bg-primary text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/10"
                                }`}
                                onClick={() => setIsOpenMobile(false)}
                            >
                                {icon}
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* ───── Toggle tema chiaro/scuro ───── */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-white/10 text-white hover:text-yellow-300 transition"
                    >
                        <span>{isDark ? "Tema chiaro" : "Tema scuro"}</span>
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </aside>
        </>
    );
}
