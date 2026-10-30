"use client";

// ╔══════════════════════════════════════════════════════════════╗
// ║ MobileMenu.tsx — Menu mobile "Depth + Synapse"               ║
// ║ - Sta SOTTO l'app (z-0): è l'app a spostarsi (vedi layout)   ║
// ║ - Lista Synapse: linea verticale, nodi, impulso che viaggia  ║
// ║   fino alla voce scelta; naviga subito, chiude dopo 250ms    ║
// ║ - In basso: pallini tema, info tech, Privacy · Termini       ║
// ║ - A11y: focus trap, ESC chiude, aria-current, inert da chiuso║
// ║ - Reduced motion: sopra l'app, solo dissolvenza              ║
// ╚══════════════════════════════════════════════════════════════╝

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useThemeContext, type Theme } from "@/context/ThemeContext";
import LegalLinks from "@/app/components/legal/LegalLinks";
import { themeMeta, availableThemes } from "@/lib/themeUtils";
import { navItems } from "./navItems";

// ────────────────────────────────
// Costanti animazione / geometria
// ────────────────────────────────
export const MENU_ID = "mobile-menu";
export const MENU_TRIGGER_ID = "mobile-menu-trigger";

const ITEM_H = 56; // altezza voce
const LINE_X = 9; // centro linea (px dal bordo lista)
const PULSE_MS = 500;
const CLOSE_DELAY_MS = 250; // dopo la navigazione, prima di chiudere
const EASE_ITEM = "cubic-bezier(.2,.9,.1,1)";
const EASE_SPRING = "cubic-bezier(.34,1.6,.5,1)";

const GREEN = "#3ddc97";
const MUTED = "#a8bab3";
const GREY = "#5f716a";

// Stile condiviso ☰ / X: stesso aspetto (☰ fixed, X nel flusso del menu alla stessa posizione)
const TRIGGER_CLASS = `
    p-2 rounded-xl
    bg-black/50
    border border-primary/40
    text-primary
    shadow-[0_0_18px_rgba(20,184,138,0.25)]
    backdrop-blur-md
    transition-all duration-200
    hover:bg-primary/10
    active:scale-95
`;
const TRIGGER_TOP = { top: "calc(env(safe-area-inset-top) + 12px)" };

// ════════════════════════════════
// ☰ — vive dentro l'app (si sposta con lei)
// ════════════════════════════════
export function MobileMenuButton() {
    const { isMobileOpen, openMobile } = useSidebar();
    return (
        <button
            id={MENU_TRIGGER_ID}
            type="button"
            className={`fixed left-4 z-50 md:hidden ${TRIGGER_CLASS}`}
            style={TRIGGER_TOP}
            onClick={openMobile}
            aria-label="Apri menu"
            aria-expanded={isMobileOpen}
            aria-controls={MENU_ID}
        >
            <Menu size={20} />
        </button>
    );
}

// ════════════════════════════════
// Stato online/offline (nessuno stato di salute API esistente)
// ════════════════════════════════
function useOnline() {
    const [online, setOnline] = useState(true);
    useEffect(() => {
        const update = () => setOnline(navigator.onLine);
        update();
        window.addEventListener("online", update);
        window.addEventListener("offline", update);
        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
        };
    }, []);
    return online;
}

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION;
const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA;

// ════════════════════════════════
// Menu
// ════════════════════════════════
// visible: true finché il menu è aperto O l'app sta ancora tornando in posizione
// (deciso dal layout a fine transizione) → il menu non sparisce sotto l'animazione.
export default function MobileMenu({ reducedMotion, visible }: { reducedMotion: boolean; visible: boolean }) {
    const { isMobileOpen: open, closeMobile } = useSidebar();
    const { theme, setTheme } = useThemeContext();
    const pathname = usePathname();
    const router = useRouter();
    const online = useOnline();

    const menuRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const navTimer = useRef<ReturnType<typeof setTimeout>>();

    const activeIndex = navItems.findIndex(({ href }) => pathname === href);
    // Voce verso cui viaggia l'impulso (null = segue la rotta corrente)
    const [target, setTarget] = useState<number | null>(null);
    const pulseIndex = target ?? activeIndex;

    // ── Apertura: reset impulso + focus sulla X; chiusura: focus torna al ☰ ──
    useEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;
        if (open) {
            menu.removeAttribute("inert");
            setTarget(null);
            closeRef.current?.focus({ preventScroll: true });
        } else {
            if (menu.contains(document.activeElement))
                document.getElementById(MENU_TRIGGER_ID)?.focus({ preventScroll: true });
            menu.setAttribute("inert", "");
        }
    }, [open]);

    useEffect(() => () => clearTimeout(navTimer.current), []);

    // ── Focus trap + ESC ──
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            e.stopPropagation();
            closeMobile();
            return;
        }
        if (e.key !== "Tab" || !menuRef.current) return;
        const focusables = menuRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    // ── Click voce: naviga subito (la nuova pagina appare nell'app spostata),
    //    l'impulso viaggia, dopo CLOSE_DELAY_MS parte la chiusura ──
    const onSelect = (e: React.MouseEvent, index: number, href: string) => {
        e.preventDefault();
        if (target !== null) return; // impulso già in viaggio
        if (index === activeIndex) {
            closeMobile();
            return;
        }
        setTarget(index);
        router.push(href);
        // Reduced motion: il menu copre l'app, inutile attendere
        navTimer.current = setTimeout(closeMobile, reducedMotion ? 0 : CLOSE_DELAY_MS);
    };

    // ── Ingresso: da trasparente (+ sfocato) a nitido.
    //    In chiusura resta nitido finché visibile; si azzera solo a menu già nascosto ──
    const enter = (delay: number, from: string, blur = true) =>
        reducedMotion
            ? {}
            : open
              ? { opacity: 1, filter: "none", transform: "none", transition: `all 450ms ${EASE_ITEM} ${delay}ms` }
              : visible
                ? { opacity: 1, filter: "none", transform: "none", transition: "none" }
                : { opacity: 0, filter: blur ? "blur(6px)" : "none", transform: from, transition: "none" };

    return (
        <div
            id={MENU_ID}
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            aria-hidden={!open}
            onKeyDown={onKeyDown}
            className="md:hidden fixed inset-0 overflow-y-auto overscroll-contain font-mono"
            style={{
                zIndex: reducedMotion ? 60 : 0,
                background: "radial-gradient(90% 50% at 0 100%, #0f2a20 0, transparent 70%), #060a09",
                // Depth: sparisce solo quando l'app è tornata in posizione (visible dal layout).
                // Reduced motion: il menu è sopra l'app → dissolvenza propria.
                visibility: (reducedMotion ? open : visible) ? "visible" : "hidden",
                opacity: reducedMotion && !open ? 0 : 1,
                transition: reducedMotion ? `opacity 200ms ease, visibility 0s linear ${open ? 0 : 200}ms` : "none",
            }}
        >
            <div
                className="flex min-h-full w-[236px] flex-col pl-4 pr-2"
                style={{
                    paddingTop: "calc(env(safe-area-inset-top) + 12px)",
                    paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)",
                }}
            >
                {/* ───────── Header: X + SYNAPSI ───────── */}
                <div className="flex items-center gap-3">
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={closeMobile}
                        aria-label="Chiudi menu"
                        className={TRIGGER_CLASS}
                    >
                        <X size={20} />
                    </button>
                    <span
                        className="text-[14px] font-extrabold uppercase tracking-[.42em]"
                        style={{ color: GREEN, textShadow: `0 0 12px ${GREEN}66` }}
                    >
                        Synapsi
                    </span>
                </div>

                {/* ───────── Lista Synapse ───────── */}
                <nav aria-label="Principale" className="relative mt-12 pl-[30px]">
                    {/* Linea verticale: si disegna dall'alto */}
                    <span
                        aria-hidden
                        className="absolute top-2 bottom-2 w-[2px] origin-top"
                        style={{
                            left: LINE_X - 1,
                            background: "#1d3a2f",
                            transform: reducedMotion || visible ? "scaleY(1)" : "scaleY(0)",
                            transition:
                                !reducedMotion && open ? "transform 600ms cubic-bezier(.7,0,.2,1) 200ms" : "none",
                        }}
                    />

                    {/* Impulso sul nodo attivo: viaggia lungo la linea */}
                    {pulseIndex >= 0 && (
                        <span
                            aria-hidden
                            className="absolute top-0 h-3 w-3 rounded-full"
                            style={{
                                left: LINE_X - 6,
                                background: GREEN,
                                boxShadow: `0 0 0 4px rgba(61,220,151,.15), 0 0 18px ${GREEN}`,
                                transform: `translateY(${pulseIndex * ITEM_H + ITEM_H / 2 - 6}px)`,
                                transition:
                                    target !== null && !reducedMotion
                                        ? `transform ${PULSE_MS}ms cubic-bezier(.6,0,.2,1)`
                                        : "none",
                                zIndex: 1,
                            }}
                        />
                    )}

                    <ul>
                        {navItems.map(({ href, label, Icon }, i) => {
                            const isCurrent = i === activeIndex;
                            const lit = i === pulseIndex;
                            return (
                                <li key={href} className="relative" style={{ height: ITEM_H }}>
                                    {/* Nodo */}
                                    <span
                                        aria-hidden
                                        className="absolute h-1.5 w-1.5 rounded-full bg-[#060a09]"
                                        style={{
                                            left: LINE_X - 30 - 3,
                                            top: ITEM_H / 2 - 3,
                                            border: "1.5px solid #2d5546",
                                        }}
                                    />
                                    <Link
                                        href={href}
                                        onClick={(e) => onSelect(e, i, href)}
                                        aria-current={isCurrent ? "page" : undefined}
                                        className="flex h-full flex-col justify-center rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-[#3ddc97]/60"
                                        style={enter(260 + 45 * i, "translateX(-10px)")}
                                    >
                                        <span
                                            className="flex items-center gap-2.5 text-[13px] uppercase tracking-[.18em] transition-colors duration-300"
                                            style={{ color: lit ? GREEN : MUTED }}
                                        >
                                            <Icon size={16} strokeWidth={1.8} />
                                            {label}
                                        </span>
                                        <span
                                            className="pl-[26px] text-[9.5px] transition-colors duration-300"
                                            style={{ color: lit ? GREEN : GREY }}
                                        >
                                            ~{href === "/" ? "/" : href}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* ───────── Parte bassa ───────── */}
                <div className="mt-auto space-y-4 pt-10" style={enter(450, "translateY(10px)", false)}>
                    {/* Pallini tema: uno per tema esistente */}
                    <div role="radiogroup" aria-label="Tema" className="flex items-center gap-3 pl-1">
                        {availableThemes.map((t) => {
                            const active = theme === t;
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    aria-label={themeMeta[t].label}
                                    title={themeMeta[t].label}
                                    onClick={() => setTheme(t as Theme)}
                                    className="h-[22px] w-[22px] rounded-full"
                                    style={{
                                        background: themeMeta[t].color,
                                        border: `2px solid ${active ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.12)"}`,
                                        boxShadow: active ? `0 0 12px ${themeMeta[t].color}88` : "none",
                                        transform: active ? "scale(1.18)" : "scale(1)",
                                        transition: `transform 450ms ${EASE_SPRING}, border-color 200ms, box-shadow 200ms`,
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Info tech */}
                    <div className="space-y-0.5 text-[8.5px] leading-relaxed" style={{ color: GREY }}>
                        <div>
                            <span style={{ color: online ? GREEN : "#e5484d" }}>●</span> {online ? "online" : "offline"}
                        </div>
                        {APP_VERSION && (
                            <div>
                                v{APP_VERSION}
                                {COMMIT_SHA && <> · build #{COMMIT_SHA.slice(0, 7)}</>}
                            </div>
                        )}
                        <LegalLinks variant="text" className="pt-1 text-[11px] text-[#a8bab3]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
