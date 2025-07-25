"use client";

// ╔══════════════════════════════════════════════════╗
// ║             Header Component                    ║
// ╚══════════════════════════════════════════════════╝

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/contexts/UserContext";

// ==================================================
// Header principale
// ==================================================
export default function Header() {
    // ─────────── USER & ROUTER ───────────
    const { user } = useUser();
    const router = useRouter();

    // ─────────── USERNAME ───────────
    const username = user?.username;

    // ─────────── LOGOUT HANDLER ───────────
    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    // ==================================================
    // RENDER
    // ==================================================
    return (
        <header className="relative flex items-center px-4 py-2 border-b border-white/10 bg-black/50 backdrop-blur-sm text-white">
            {/* LOGO CENTRALE */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center" aria-label="Homepage">
                <Image
                    src="/images/icon_1024x1024.png"
                    alt="Synapsi logo"
                    width={32}
                    height={32}
                    priority
                    className="h-8 w-auto"
                />
            </Link>

            {/* UTENTE + LOGOUT (a destra) */}
            <div className="flex items-center gap-4 ml-auto">
                {username && (
                    <span className="text-sm font-medium truncate max-w-[10rem]" title={username}>
                        {username}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 p-2 rounded bg-white/10 text-white hover:text-red-400 transition"
                >
                    <span className="text-sm">Logout</span>
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
}
