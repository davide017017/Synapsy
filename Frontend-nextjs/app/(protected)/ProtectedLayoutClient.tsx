"use client";

// ==============================
// IMPORT PRINCIPALI
// ==============================
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Sidebar from "./layout-components/Sidebar";
import MobileMenu, { MobileMenuButton } from "./layout-components/MobileMenu";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Header from "./layout-components/Header";
import BottomNav from "./layout-components/BottomNav";
import { useSidebar } from "@/context/SidebarContext";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useUser } from "@/context/UserContext";
import SplashScreen from "@/app/components/SplashScreen";
import { API } from "@/lib/api/endpoints";

// Animazione Depth (menu mobile)
const DEPTH_MS = 600;
const DEPTH_EASE = "cubic-bezier(.7,0,.2,1)";

// ==============================
// LAYOUT PROTETTO CON SIDEBAR E HEADER
// ==============================
export default function ProtectedLayoutClient({ children }: { children: React.ReactNode }) {
    // ───── Gestione sessione auth ─────
    const { data: session, status } = useSession();
    const { loading: userLoading } = useUser();
    const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();
    const router = useRouter();
    const reducedMotion = usePrefersReducedMotion();

    usePullToRefresh();

    // ───── Menu mobile "Depth": transform solo mentre aperto/in chiusura ─────
    // Un transform cambia il riferimento dei `fixed` interni (BottomNav, footer
    // /ricorrenti): a menu chiuso deve tornare `none`.
    // depthOn resta true dall'apertura fino alla FINE della transizione di chiusura:
    // nel render in cui isMobileOpen passa a false lo stile Depth è ancora attivo,
    // così l'app torna indietro animata (stessi 600ms) invece di scattare.
    // Lo stesso stato decide quando il menu sotto può sparire.
    const appRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [depthOn, setDepthOn] = useState(false);
    const menuVisible = isMobileOpen || depthOn;
    const depth = !reducedMotion && menuVisible;

    useEffect(() => {
        if (isMobileOpen) {
            setDepthOn(true);
            return;
        }
        // fallback se transitionend non arriva (tab in background, ecc.)
        const t = setTimeout(() => setDepthOn(false), DEPTH_MS + 100);
        return () => clearTimeout(t);
    }, [isMobileOpen]);

    const onAppTransitionEnd = (e: React.TransitionEvent) => {
        if (e.target === appRef.current && e.propertyName === "transform" && !isMobileOpen) setDepthOn(false);
    };

    const depthStyle: React.CSSProperties = {
        transform: isMobileOpen ? "translateX(232px) scale(.78) rotateY(-6deg)" : "translateX(0) scale(1) rotateY(0)",
        transformOrigin: "left center",
        borderRadius: isMobileOpen ? 28 : 0,
        boxShadow: isMobileOpen ? "-30px 0 70px rgba(0,0,0,.7)" : "none",
        transition: `transform ${DEPTH_MS}ms ${DEPTH_EASE}, border-radius ${DEPTH_MS}ms ${DEPTH_EASE}, box-shadow ${DEPTH_MS}ms ${DEPTH_EASE}`,
    };

    // ───── Menu aperto: blocca scroll, app inert, segnala al pull-to-refresh ─────
    useEffect(() => {
        const content = contentRef.current;
        const html = document.documentElement;
        if (!isMobileOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        html.dataset.mobileMenu = "open";
        content?.setAttribute("inert", "");
        return () => {
            document.body.style.overflow = prevOverflow;
            delete html.dataset.mobileMenu;
            content?.removeAttribute("inert");
        };
    }, [isMobileOpen]);

    // ───── Redirect se non autenticato ─────
    useEffect(() => {
        if (status === "unauthenticated" || session?.error === "RefreshAccessTokenError") {
            signOut({ callbackUrl: "/login" });
        }
    }, [status, session?.error]);

    // ───── Catch-up ricorrenti (silenzioso, una volta per sessione) ─────
    useEffect(() => {
        if (status !== "authenticated" || userLoading) return;
        if (sessionStorage.getItem("synapsy_catchup_done")) return;

        const token = session?.accessToken as string | undefined;
        if (!token) return;

        fetch(`${API.base}${API.recurringCatchUp}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.ok) sessionStorage.setItem("synapsy_catchup_done", "1");
            })
            .catch((err) => console.warn("Catch-up ricorrenti fallito:", err));
    }, [status, userLoading, session]);

    if (status === "unauthenticated") return null;

    // ───── Splash durante check sessione iniziale ─────
    if (status === "loading") {
        return <SplashScreen />;
    }

    // ───── Layout principale protetto ─────
    return (
        <div className="flex h-screen">
            {/* ===== SIDEBAR (desktop) ===== */}
            <Sidebar />
            {/* ===== MENU MOBILE (sotto l'app) ===== */}
            <MobileMenu reducedMotion={reducedMotion} visible={menuVisible} />

            {/* ===== APP: si sposta in profondità quando il menu è aperto =====
                Il parent (perspective) resta a tutta viewport sopra il menu: pointer-events-none,
                altrimenti intercetta i click sul menu scoperto. L'app riattiva i click per sé. */}
            <div
                className="pointer-events-none relative z-10 flex-1 min-w-0"
                style={depth ? { perspective: "1200px" } : undefined}
            >
                <div
                    ref={appRef}
                    className="pointer-events-auto relative h-full overflow-hidden bg-[hsl(var(--c-bg))]"
                    style={depth ? depthStyle : undefined}
                    onTransitionEnd={onAppTransitionEnd}
                >
                    {/* Contenuto interattivo: inert a menu aperto (l'overlay resta cliccabile) */}
                    <div ref={contentRef} className="contents">
                        {/* ===== AREA CONTENUTO (scroll) ===== */}
                        <div
                            className={`flex flex-col h-full min-w-0 overflow-x-hidden transition-all duration-300 ${isCollapsed ? "md:pl-0" : "md:pl-56"}`}
                        >
                            <Header />
                            <main className="flex-1 overflow-x-hidden p-4 pb-36 md:pb-4">{children}</main>
                        </div>
                        {/* ===== ☰ + BOTTOM NAV (solo mobile, si spostano con l'app) ===== */}
                        <MobileMenuButton />
                        <BottomNav />
                    </div>

                    {/* Overlay sopra l'app spostata: tap chiude */}
                    {!reducedMotion && (
                        <div
                            aria-hidden
                            onClick={closeMobile}
                            className="md:hidden absolute inset-0 z-[70]"
                            style={{
                                background: "rgba(5,10,8,.45)",
                                opacity: isMobileOpen ? 1 : 0,
                                pointerEvents: isMobileOpen ? "auto" : "none",
                                transition: `opacity ${DEPTH_MS}ms ${DEPTH_EASE}`,
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
