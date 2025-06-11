"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/context/contexts/AuthContext";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────
// Header con bottone di logout
// ─────────────────────────────────────────────

export default function Header() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <header className="flex items-center justify-end px-4 py-2 border-b border-white/10 bg-black/50 backdrop-blur-sm text-white">
            <button
                onClick={handleLogout}
                className="p-2 rounded bg-white/10 text-white hover:text-red-400 transition flex items-center gap-1"
            >
                <span className="text-sm">Logout</span>
                <LogOut size={16} />
            </button>
        </header>
    );
}
