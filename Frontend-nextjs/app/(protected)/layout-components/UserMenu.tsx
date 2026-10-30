"use client";

// ╔══════════════════════════════════════════════════════════════╗
// ║ UserMenu.tsx — Menu avatar mobile "Synapse mini"             ║
// ║ - Bottone avatar + ≡ (toggle) nell'header                    ║
// ║ - Pannello sotto l'header, apertura a cerchio dall'avatar    ║
// ║   (clip-path), chiusura al contrario                         ║
// ║ - Lista a nodi: Utente · Logout (stile synapse)              ║
// ║ - Logout a due tap: CONFERMA? (4s) → USCITA…                 ║
// ║ - A11y: menu/menuitem, focus trap, frecce, ESC, focus torna  ║
// ║ - Reduced motion: solo dissolvenza                           ║
// ║ Lo stato open vive nell'Header (coordinato con la sidebar).  ║
// ╚══════════════════════════════════════════════════════════════╝

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, UserCircle } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { trapTab } from "@/utils/focusTrap";
import { SYN, EASE, type Rail, SynapseLine, SynapseNode, SynapsePulse, synapseEnter } from "./synapse";

// ────────────────────────────────
// Costanti
// ────────────────────────────────
const MENU_ID = "user-menu";
const TRIGGER_ID = "user-menu-trigger";

const RAIL: Rail = { x: 9, itemH: 46, padLeft: 26 };
const OPEN_MS = 550;
const PULSE_MS = 450;
const CONFIRM_MS = 4000;
const NODE_BG = "#0c1c16"; // ~ tono del gradiente all'altezza della lista

// Voci sulla linea
const UTENTE = 0;
const LOGOUT = 1;

type Props = {
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    username?: string;
    avatarUrl?: string;
    onLogout: () => Promise<void> | void;
};

// ════════════════════════════════
// Scrim (fuori dall'<header>: il backdrop-blur dell'header farebbe da
// riferimento ai `fixed` interni). Sta sotto l'header (z-20 < z-30).
// ════════════════════════════════
export function UserMenuScrim({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <div
            aria-hidden
            onClick={onClose}
            className="fixed inset-0 z-20 sm:hidden bg-black/30 backdrop-blur-[2px]"
            style={{
                touchAction: "none",
                opacity: open ? 1 : 0,
                pointerEvents: open ? "auto" : "none",
                transition: `opacity ${OPEN_MS}ms ${EASE.depth}`,
            }}
        />
    );
}

// ════════════════════════════════
// Bottone + pannello
// ════════════════════════════════
export default function UserMenu({ open, onToggle, onClose, username, avatarUrl, onLogout }: Props) {
    const router = useRouter();
    const reducedMotion = usePrefersReducedMotion();

    const panelRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const travelTimer = useRef<ReturnType<typeof setTimeout>>();
    const confirmTimer = useRef<ReturnType<typeof setTimeout>>();

    // visible: true finché aperto O il cerchio si sta ancora richiudendo
    const [visible, setVisible] = useState(false);
    const [pulse, setPulse] = useState(UTENTE);
    const [travelling, setTravelling] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [exiting, setExiting] = useState(false);

    const clearTimers = () => {
        clearTimeout(travelTimer.current);
        clearTimeout(confirmTimer.current);
    };

    // ── Apertura: reset stato + focus su Utente; chiusura: annulla conferma, focus al bottone ──
    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        if (open) {
            setVisible(true);
            setPulse(UTENTE);
            setTravelling(false);
            setConfirm(false);
            setExiting(false);
            panel.removeAttribute("inert");
            itemRefs.current[UTENTE]?.focus({ preventScroll: true });
            return;
        }
        clearTimers();
        setConfirm(false);
        setTravelling(false);
        if (panel.contains(document.activeElement)) document.getElementById(TRIGGER_ID)?.focus({ preventScroll: true });
        panel.setAttribute("inert", "");
        // fallback se transitionend non arriva
        const t = setTimeout(() => setVisible(false), (reducedMotion ? 200 : OPEN_MS) + 100);
        return () => clearTimeout(t);
    }, [open, reducedMotion]);

    useEffect(() => clearTimers, []);

    const onPanelTransitionEnd = (e: React.TransitionEvent) => {
        if (e.target !== panelRef.current || open) return;
        if (e.propertyName === "clip-path" || e.propertyName === "opacity") setVisible(false);
    };

    // ── Impulso: viaggia verso `index`, poi esegue `then` ──
    const travel = (index: number, then?: () => void) => {
        clearTimeout(travelTimer.current);
        if (index === pulse || reducedMotion) {
            setPulse(index);
            then?.();
            return;
        }
        setTravelling(true);
        setPulse(index);
        travelTimer.current = setTimeout(() => {
            setTravelling(false);
            then?.();
        }, PULSE_MS);
    };

    const resetConfirm = () => {
        clearTimeout(confirmTimer.current);
        setConfirm(false);
    };

    const onSelect = (index: number) => {
        if (travelling || exiting) return;

        if (index === UTENTE) {
            resetConfirm();
            travel(UTENTE, () => {
                router.push("/profilo");
                onClose();
            });
        } else if (confirm) {
            // Secondo tap entro 4s: logout reale
            clearTimeout(confirmTimer.current);
            setExiting(true);
            void onLogout();
        } else {
            // Primo tap: impulso su Logout → rosso, CONFERMA? per 4s
            travel(LOGOUT, () => {
                setConfirm(true);
                confirmTimer.current = setTimeout(() => setConfirm(false), CONFIRM_MS);
            });
        }
    };

    // ── Tastiera: ESC chiude, frecce tra le voci, Tab intrappolato ──
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
            return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
            const i = items.indexOf(document.activeElement as HTMLButtonElement);
            const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
            items[next]?.focus();
            return;
        }
        trapTab(e, panelRef.current);
    };

    const motion = { open, visible, reducedMotion };
    const red = pulse === LOGOUT && (confirm || exiting);
    const logoutLabel = exiting ? "Uscita…" : confirm ? "Conferma?" : "Logout";

    // Voce: riga 1 (icona + label) / riga 2 (sottotitolo)
    const item = (index: number, row1: React.ReactNode, row2: React.ReactNode, label: string) => {
        const lit = pulse === index && index !== LOGOUT;
        return (
            <li key={index} role="none" className="relative" style={{ height: RAIL.itemH }}>
                <SynapseNode rail={RAIL} bg={NODE_BG} />
                <button
                    ref={(el) => {
                        itemRefs.current[index] = el;
                    }}
                    type="button"
                    role="menuitem"
                    aria-label={label}
                    onClick={() => onSelect(index)}
                    className="flex h-full w-full min-w-0 flex-col justify-center whitespace-nowrap rounded-lg text-left outline-none focus-visible:ring-1 focus-visible:ring-[#3ddc97]/60"
                    style={{
                        ...synapseEnter(motion, 200 + 50 * index, { blurPx: 5 }),
                        color: lit ? SYN.green : SYN.muted,
                    }}
                >
                    {row1}
                    <span className="pl-[24px] text-[9px] transition-colors duration-300" style={{ color: lit ? SYN.green : SYN.grey }}>
                        {row2}
                    </span>
                </button>
            </li>
        );
    };

    return (
        <>
            {/* ───────── Bottone avatar + ≡ (toggle) ───────── */}
            <button
                id={TRIGGER_ID}
                type="button"
                onClick={onToggle}
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
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={MENU_ID}
            >
                {avatarUrl ? (
                    <Image src={avatarUrl} alt="" width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                    <UserCircle size={20} className="text-primary" />
                )}
                <Menu size={18} className="text-primary/80" />
            </button>

            {/* ───────── Pannello (ancorato all'header: top = header + 6px) ───────── */}
            <div
                id={MENU_ID}
                ref={panelRef}
                role="menu"
                aria-label="Menu utente"
                aria-hidden={!open}
                onKeyDown={onKeyDown}
                onTransitionEnd={onPanelTransitionEnd}
                className="absolute right-3 top-[calc(100%+6px)] z-50 w-[230px] rounded-2xl border border-[#173027] px-3 py-2 font-mono shadow-[0_24px_60px_rgba(0,0,0,0.6)] sm:hidden"
                style={{
                    background: "radial-gradient(120% 80% at 100% 0, #0f2a20 0, #08110e 60%)",
                    visibility: visible || open ? "visible" : "hidden",
                    ...(reducedMotion
                        ? { opacity: open ? 1 : 0, transition: "opacity 200ms ease" }
                        : {
                              clipPath: open ? "circle(420px at 92% 0)" : "circle(0 at 92% 0)",
                              transition: `clip-path ${OPEN_MS}ms ${EASE.depth}`,
                          }),
                }}
            >
                <ul role="none" className="relative" style={{ paddingLeft: RAIL.padLeft }}>
                    <SynapseLine
                        rail={RAIL}
                        drawn={reducedMotion || visible || open}
                        animate={!reducedMotion && open}
                        durationMs={500}
                        delayMs={150}
                    />
                    <SynapsePulse
                        rail={RAIL}
                        index={pulse}
                        travelMs={travelling && !reducedMotion ? PULSE_MS : 0}
                        color={red ? "red" : "green"}
                    />

                    {/* Utente → profilo */}
                    {item(
                        UTENTE,
                        <span className="flex min-w-0 items-center gap-1.5">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt=""
                                    width={18}
                                    height={18}
                                    className="h-[18px] w-[18px] shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <UserCircle size={18} className="shrink-0" />
                            )}
                            <span className="truncate text-[13px] font-bold text-[hsl(0_0%_95%)]">{username ?? "Profilo"}</span>
                        </span>,
                        "~/profilo",
                        `Profilo${username ? ` di ${username}` : ""}`,
                    )}

                    {/* Logout a due tap */}
                    {item(
                        LOGOUT,
                        <span
                            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.14em] transition-colors duration-300"
                            style={{ color: red ? SYN.red : SYN.redSoft, fontWeight: red ? 700 : 400 }}
                        >
                            <LogOut size={16} strokeWidth={1.8} className="shrink-0" />
                            {logoutLabel}
                        </span>,
                        "~/logout",
                        exiting ? "Uscita in corso" : confirm ? "Conferma logout" : "Logout",
                    )}
                </ul>
            </div>
        </>
    );
}
