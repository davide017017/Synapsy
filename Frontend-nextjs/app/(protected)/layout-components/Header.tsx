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

            <header className="relative z-30 flex items-center px-4 py-2 border-b border-white/10 bg-black/50 backdrop-blur-sm">
                {/* LOGO CENTRALE */}
                <Link
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 flex items-center"
                    aria-label="Homepage"
                >
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

                {/* DESKTOP: UTENTE + LOGOUT (da sm in su) */}
                <div className="hidden sm:flex items-center gap-4 ml-auto">
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

                {/* MOBILE: ICON BUTTON + MENU COMPATTO (solo sotto sm) */}
                <div className="flex sm:hidden items-center ml-auto relative">
                    <button
                          type="button"
                          onClick={handleToggleUserMenu}
                          className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                        <Menu size={18} className="text-white/80" />
                    </button>

                    {/* Dropdown mobile */}
                    {isMobileMenuOpen && (
                        <div
                            className="
                                absolute right-0 top-[160%] z-50
                                w-40 rounded-xl bg-black/90
                                border border-white/10 shadow-lg
                                backdrop-blur-md
                            "
                        >
                            {username && (
                                <Link
                                    href="/profilo"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="
                                        flex items-center gap-2 px-3 py-2 text-sm 
                                        text-white hover:bg-white/10
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
                                    w-full flex items-center gap-2 px-3 py-2 text-sm 
                                    text-red-400 hover:bg-red-500/10
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
