"use client";

// ╔══════════════════════════════════════════════════╗
// ║             Header Component                    ║
// ╚══════════════════════════════════════════════════╝

import { signOut } from "next-auth/react";
import { LogOut, UserCircle } from "lucide-react";
import BetaBadge from "@/app/components/BetaBadge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import getAvatarUrl from "@/utils/getAvatarUrl";

// ==================================================
// Header principale
// ==================================================
export default function Header() {
    // ─────────── USER & ROUTER ───────────
    const { user } = useUser();
    const router = useRouter();

    // ─────────── USERNAME ───────────
    const username = user?.username;
    const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : undefined;

    // ─────────── LOGOUT HANDLER ───────────
    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    // ==================================================
    // RENDER
    // ==================================================
    return (
        <header className="relative flex items-center px-4 py-2 border-b border-white/10 bg-black/50 backdrop-blur-sm">
            {/* LOGO CENTRALE */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center" aria-label="Homepage">
                <Image
                    src="/images/icon_1024x1024.webp"
                    alt="Synapsi logo"
                    width={32}
                    height={32}
                    priority
                    className="h-8 w-auto"
                />
                <BetaBadge inline />
            </Link>

            {/* UTENTE + LOGOUT (a destra) */}
            <div className="flex items-center gap-4 ml-auto">
                {username && (
                    <Link
                        href="/profilo"
                        className="
                            flex items-center gap-2 px-3 py-1 rounded-full 
                            bg-white/10 hover:bg-primary/20 
                            transition shadow-sm
                            text-sm font-medium max-w-[12rem] truncate
                            ring-1 ring-white/20 hover:ring-primary
                            focus:outline-none focus:ring-2 focus:ring-primary
                        "
                        title="Vai al profilo"
                    >
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt="Avatar utente"
                                width={20}
                                height={20}
                                className="w-5 h-5 rounded-full object-cover"
                            />
                        ) : (
                            <UserCircle size={18} className="text-primary" />
                        )}
                        <span className="truncate">{username}</span>
                    </Link>
                )}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white hover:text-red-400 ring-1 ring-white/20 hover:ring-red-400 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    <span className="text-sm">Logout</span>
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
}
