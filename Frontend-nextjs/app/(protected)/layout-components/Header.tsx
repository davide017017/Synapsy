"use client";

// ╔══════════════════════════════════════════════════╗
// ║             Header Component                    ║
// ╚══════════════════════════════════════════════════╝

import { useState, useEffect } from "react";

import { signOut } from "next-auth/react";
import { LogOut, UserCircle, Menu } from "lucide-react";
import BetaBadge from "@/app/components/BetaBadge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import getAvatarUrl from "@/utils/avatar";

// ────────────────────────────────────────────────
// Header principale
// ────────────────────────────────────────────────
export default function Header() {
    // ─────────── USER & ROUTER ───────────
    const { user } = useUser();
    const router = useRouter();

    // ─────────── USERNAME & AVATAR ───────────
    const username = user?.username;
    const avatarUrl = user ? getAvatarUrl(user) : undefined;

    // ─────────── STATE: menu mobile ───────────
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ─────────── LISTENER: chiusura da sidebar ───────────
    useEffect(() => {
        const handleCloseHeaderMenu = () => setIsMobileMenuOpen(false);

        window.addEventListener("closeHeaderUserMenu", handleCloseHeaderMenu);
        return () => window.removeEventListener("closeHeaderUserMenu", handleCloseHeaderMenu);
    }, []);

    // ─────────── LOGOUT HANDLER ───────────
    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    // ─────────── TOGGLE: menu utente mobile ───────────
    const handleToggleUserMenu = () => {
        const next = !isMobileMenuOpen;

        // se lo sto aprendo → dico alla sidebar di chiudersi
        if (next) {
            window.dispatchEvent(new Event("closeSidebarMobile"));
        }

        setIsMobileMenuOpen(next);
    };

    // ────────────────────────────────────────────────
    // RENDER
    // ────────────────────────────────────────────────
    return (
        <>
            {/* OVERLAY FULLSCREEN: chiude cliccando fuori (solo mobile) */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-x-0 top-12 bottom-0 z-10 sm:hidden backdrop-blur-sm bg-black/10"
                />
            )}

            <header
                className="
                    relative z-30
                    flex items-center
                    px-4 py-2
                    border-b border-primary/20
                    bg-black/65
                    backdrop-blur-xl
                    shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                "
                style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
            >
                {/* LOGO CENTRALE */}
                <Link
                    href="/"
                    className="
                        absolute left-1/2 -translate-x-1/2
                        flex items-center gap-1
                        rounded-xl
                        px-2 py-1
                        hover:bg-primary/5
                        transition-colors
                    "
                    aria-label="Homepage"
                >
                    <Image
                        src="/images/icon_1024x1024.webp"
                        alt="Synapsi logo"
                        width={32}
                        height={32}
                        priority
                        className="
                          h-8 w-auto
                          drop-shadow-[0_0_12px_hsl(var(--c-primary)/0.35)]
                      "
                    />
                    <BetaBadge inline />
                </Link>

                {/* DESKTOP: UTENTE + LOGOUT (da sm in su) */}
                <div className="hidden sm:flex items-center gap-4 ml-auto">
                    {username && (
                        <Link
                            href="/profilo"
                            className="
                                flex items-center gap-2
                                px-3 py-1.5
                                rounded-xl
                                bg-white/5 hover:bg-primary/10
                                border border-white/10 hover:border-primary/35
                                text-white/70 hover:text-primary
                                font-mono text-xs tracking-[0.08em]
                                max-w-[12rem] truncate
                                shadow-[0_0_16px_hsl(var(--c-primary)/0.08)]
                                transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-primary/50
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
                        className="
                          flex items-center gap-2
                          px-3 py-1.5
                          rounded-xl
                          bg-white/5 hover:bg-red-500/10
                          border border-white/10 hover:border-red-400/40
                          text-white/55 hover:text-red-400
                          font-mono text-xs tracking-[0.08em]
                          shadow-[0_0_16px_rgba(0,0,0,0.18)]
                          transition-all duration-200
                          active:scale-95
                          focus:outline-none focus:ring-2 focus:ring-red-400/50
                      "
                    >
                        <span className="text-sm">Logout</span>
                        <LogOut size={16} />
                    </button>
                </div>

                {/* MOBILE: ICON BUTTON + MENU COMPATTO (solo sotto sm) */}
                <div className="flex sm:hidden items-center ml-auto relative">
                    <button
                        type="button"
                        onClick={handleToggleUserMenu}
                        className="
                            flex items-center gap-2
                            px-2.5 py-1.5
                            rounded-xl
                            bg-black/50
                            border border-primary/30
                            text-primary
                            shadow-[0_0_18px_hsl(var(--c-primary)/0.20)]
                            backdrop-blur-md
                            transition-all duration-200
                            hover:bg-primary/10
                            active:scale-95
                            focus:outline-none focus:ring-2 focus:ring-primary/50
                        "
                        aria-label="Menu utente"
                    >
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt="Avatar utente"
                                width={24}
                                height={24}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <UserCircle size={20} className="text-primary" />
                        )}
                        <Menu size={18} className="text-primary/80" />
                    </button>

                    {/* Dropdown mobile */}
                    {isMobileMenuOpen && (
                        <div
                            className="
                                absolute right-0 top-[160%] z-50
                                w-44
                                overflow-hidden
                                rounded-2xl
                                bg-black/75
                                border border-primary/20
                                shadow-[0_18px_50px_rgba(0,0,0,0.45)]
                                backdrop-blur-xl
                            "
                        >
                            {username && (
                                <Link
                                    href="/profilo"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="
                                        flex items-center gap-2
                                        px-3 py-2.5
                                        font-mono text-xs tracking-[0.06em]
                                        text-white/65 hover:text-primary
                                        hover:bg-primary/10
                                        transition-colors
                                    "
                                >
                                    <UserCircle size={16} className="text-primary" />
                                    <span className="truncate">{username}</span>
                                </Link>
                            )}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                  w-full flex items-center gap-2
                                  px-3 py-2.5
                                  font-mono text-xs tracking-[0.06em]
                                  text-red-400/80 hover:text-red-300
                                  hover:bg-red-500/10
                                  transition-colors
                              "
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}

// ────────────────────────────────────────────────
// DESCRIZIONE FILE
// ────────────────────────────────────────────────
// Questo componente gestisce l'header principale di Synapsi.
// - Mostra logo centrale con badge "Beta".
// - Su schermi grandi (≥ sm) mostra nome utente + pulsante Logout a destra.
// - Su schermi piccoli (< sm) compatta tutto in un icon button che apre
//   un piccolo menu con link al profilo e Logout, con overlay cliccabile
//   che chiude il menu cliccando fuori.
