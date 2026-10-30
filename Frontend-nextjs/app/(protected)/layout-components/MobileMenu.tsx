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
import { useOnline } from "@/hooks/useOnline";
import { trapTab } from "@/utils/focusTrap";
import { navItems } from "./navItems";
import { SYN, EASE, type Rail, SynapseLine, SynapseNode, SynapsePulse, synapseEnter } from "./synapse";

// ────────────────────────────────
// Costanti animazione / geometria
// ────────────────────────────────
export const MENU_ID = "mobile-menu";
export const MENU_TRIGGER_ID = "mobile-menu-trigger";

const MENU_BG = "#060a09";
const RAIL: Rail = { x: 9, itemH: 56, padLeft: 30 };
const PULSE_MS = 500;
const CLOSE_DELAY_MS = 250; // dopo la navigazione, prima di chiudere

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
    // Stato online/offline (nessuno stato di salute API esistente)
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
        trapTab(e, menuRef.current);
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

    const motion = { open, visible, reducedMotion };

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
                background: `radial-gradient(90% 50% at 0 100%, #0f2a20 0, transparent 70%), ${MENU_BG}`,
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
                        style={{ color: SYN.green, textShadow: `0 0 12px ${SYN.green}66` }}
                    >
                        Synapsi
                    </span>
                </div>

                {/* ───────── Lista Synapse ───────── */}
                <nav aria-label="Principale" className="relative mt-12 pl-[30px]">
                    {/* Linea verticale: si disegna dall'alto */}
                    <SynapseLine
                        rail={RAIL}
                        drawn={reducedMotion || visible}
                        animate={!reducedMotion && open}
                        durationMs={600}
                        delayMs={200}
                    />

                    {/* Impulso sul nodo attivo: viaggia lungo la linea */}
                    {pulseIndex >= 0 && (
                        <SynapsePulse
                            rail={RAIL}
                            index={pulseIndex}
                            travelMs={target !== null && !reducedMotion ? PULSE_MS : 0}
                        />
                    )}

                    <ul>
                        {navItems.map(({ href, label, Icon }, i) => {
                            const isCurrent = i === activeIndex;
                            const lit = i === pulseIndex;
                            return (
                                <li key={href} className="relative" style={{ height: RAIL.itemH }}>
                                    <SynapseNode rail={RAIL} bg={MENU_BG} />
                                    <Link
                                        href={href}
                                        onClick={(e) => onSelect(e, i, href)}
                                        aria-current={isCurrent ? "page" : undefined}
                                        className="flex h-full flex-col justify-center rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-[#3ddc97]/60"
                                        style={synapseEnter(motion, 260 + 45 * i, { from: "translateX(-10px)" })}
                                    >
                                        <span
                                            className="flex items-center gap-2.5 text-[13px] uppercase tracking-[.18em] transition-colors duration-300"
                                            style={{ color: lit ? SYN.green : SYN.muted }}
                                        >
                                            <Icon size={16} strokeWidth={1.8} />
                                            {label}
                                        </span>
                                        <span
                                            className="pl-[26px] text-[9.5px] transition-colors duration-300"
                                            style={{ color: lit ? SYN.green : SYN.grey }}
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
                <div
                    className="mt-auto space-y-4 pt-10"
                    style={synapseEnter(motion, 450, { from: "translateY(10px)", blurPx: 0 })}
                >
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
                                        transition: `transform 450ms ${EASE.spring}, border-color 200ms, box-shadow 200ms`,
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Info tech */}
                    <div className="space-y-0.5 text-[8.5px] leading-relaxed" style={{ color: SYN.grey }}>
                        <div>
                            <span style={{ color: online ? SYN.green : SYN.offline }}>●</span>{" "}
                            {online ? "online" : "offline"}
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
