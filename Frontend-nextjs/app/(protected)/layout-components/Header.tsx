"use client";

// ╔══════════════════════════════════════════════════╗
// ║             Header Component                    ║
// ╚══════════════════════════════════════════════════╝

import { useState, useEffect } from "react";

import { signOut } from "next-auth/react";
import { resetAllProviderCaches } from "@/context/resetCaches";
import { LogOut, UserCircle } from "lucide-react";
import BetaBadge from "@/app/components/BetaBadge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import getAvatarUrl from "@/utils/avatar";
import LogoElectricGlow from "@/app/components/ui/LogoElectricGlow";
import UserMenu, { UserMenuScrim } from "./UserMenu";

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
        await resetAllProviderCaches();
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
            {/* SCRIM menu utente: fuori dall'<header>, sotto di lui (tap chiude) */}
            <UserMenuScrim open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

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
                {/* Centrato nell'area contenuto: sotto la safe area (stesso paddingTop dell'header)
                    e sopra il py-2 inferiore, così resta allineato al bottone menu.
                    pointer-events-none sul box a tutta larghezza: non blocca i bottoni ai lati */}
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex items-center justify-center"
                    style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
                >
                    <div className="pointer-events-auto">
                        <LogoElectricGlow
                            size={38}
                            glowSize={36}
                            spinSpeed="9s"
                            shockMinDelay={1200}
                            shockMaxDelay={3500}
                            shockDuration={600}
                            shockIntensity={1.1}
                            navigateTo="/"
                            clickShockDuration={900}
                            fullscreenBoltCount={18}
                        />
                    </div>
                </div>
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

                {/* MOBILE: BOTTONE AVATAR + MENU "SYNAPSE MINI" (solo sotto sm)
                    Il wrapper NON è relative: il pannello si ancora all'header (top = header + 6px) */}
                <div className="flex sm:hidden items-center ml-auto">
                    <UserMenu
                        open={isMobileMenuOpen}
                        onToggle={handleToggleUserMenu}
                        onClose={() => setIsMobileMenuOpen(false)}
                        username={username}
                        avatarUrl={avatarUrl}
                        onLogout={handleLogout}
                    />
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
// - Su schermi piccoli (< sm) compatta tutto nel bottone avatar che apre
//   UserMenu ("Synapse mini": profilo, sessione, logout a due tap) con
//   scrim cliccabile che chiude il menu.
