"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleLogin } from "@/lib/auth/handleLogin";
import { handleTokenLogin } from "@/lib/auth/handleTokenLogin";
import RegisterModal from "@/app/(auth)/login/form/modal/RegisterModal";
import ForgotPasswordModal from "@/app/(auth)/login/form/modal/ForgotPasswordModal";
import s from "./login.module.css";

export default function LoginPage() {
    // ── Auth session ──
    const { status, data } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    // ── Page state ──
    const [showReg, setShowReg] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [info, setInfo] = useState<string | null>(null);

    // ── Form state ──
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // toggle visibilità password
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ── Redirect if already authenticated ──
    useEffect(() => {
        if (status === "authenticated" && data?.user) {
            router.replace("/");
        }
    }, [status, data?.user, router]);

    // ── Token magic-link + verified message ──
    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            handleTokenLogin(token).then((ok) => {
                if (ok) router.replace("/");
            });
            return;
        }
        if (searchParams.get("verified")) setInfo("Email verificata, ora puoi accedere");
    }, [searchParams, router]);

    // ── Restore remembered email ──
    useEffect(() => {
        const saved = localStorage.getItem("rememberedEmail");
        if (saved) {
            setEmail(saved);
            setRemember(true);
        }
    }, []);

    // ── Core login handler ──
    async function onLogin(em: string, pw: string) {
        const ok = await handleLogin(em, pw);
        if (!ok) throw new Error("invalid");
        router.push("/");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        remember ? localStorage.setItem("rememberedEmail", email) : localStorage.removeItem("rememberedEmail");
        try {
            await onLogin(email, password);
        } catch {
            setError("Email o password non corretti");
        } finally {
            setLoading(false);
        }
    }

    async function handleDemoLogin() {
        setLoading(true);
        setError("");
        try {
            await onLogin("demo@synapsy.app", "demo");
        } catch {
            setError("Demo non disponibile");
        } finally {
            setLoading(false);
        }
    }

    // ── Loading guard (avoid flicker) ──
    if (status === "loading") {
        return (
            <div
                style={{
                    minHeight: "100svh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0a0c0f",
                }}
            >
                <span className="sr-only">Caricamento…</span>
            </div>
        );
    }

    return (
        <div className={s.terminal}>
            {/* ── Background grid + scan line ── */}
            <div className={s.gridBg} aria-hidden="true" />
            <div className={s.scan} aria-hidden="true" />

            {/* ── Top bar ── */}
            <div className={s.topBar}>
                <div className={s.barLeft}>
                    <span className={s.statusDot} />
                    SYNAPSY · NEURAL CORE v1.1.17
                </div>
                <span>SESSION · NULL · TRUST ME BRO</span>
            </div>

            {/* ── Bottom bar ── */}
            <div className={s.bottomBar}>
                <span>LOGIN.EXE · TOKEN · OAUTH · NO PANIC</span>
                <span>© 2026 SYNAPSY · COMPILED WITH CAFFEINE</span>
            </div>

            {/* ── Beta badge ── */}
            <div className={s.betaBadge} aria-label="Versione beta">
                BETA
            </div>

            {/* ── Corner registration marks ── */}
            <div className={`${s.corner} ${s.cornerTL}`} aria-hidden="true" />
            <div className={`${s.corner} ${s.cornerTR}`} aria-hidden="true" />
            <div className={`${s.corner} ${s.cornerBL}`} aria-hidden="true" />
            <div className={`${s.corner} ${s.cornerBR}`} aria-hidden="true" />

            {/* ── Center content ── */}
            <div className={s.center}>
                {info && <p className={s.infoMsg}>{info}</p>}

                <div className={s.card}>
                    {/* Card crop marks */}
                    <div className={s.cropTL} aria-hidden="true" />
                    <div className={s.cropBR} aria-hidden="true" />

                    {/* Card header */}
                    <div className={s.cardHeader}>
                        <div className={s.mark}>
                            <div className={s.markCore} />
                        </div>
                        <span className={s.cardLabel}>SYN/AUTH</span>
                    </div>

                    {/* Title */}
                    <h1 className={s.title}>
                        Accedi <span className={s.titleCursor}>_</span>
                    </h1>

                    <p className={s.subtitle}>{"// authenticate to continue"}</p>

                    {error && (
                        <p className={s.errorMsg} role="alert">
                            {error}
                        </p>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email field */}
                        <div className={s.fieldGroup}>
                            <div className={s.fieldLabel}>
                                <span>Email</span>
                                <span className={s.fieldBadge}>required</span>
                            </div>
                            <div className={s.fieldRow}>
                                <span className={s.fieldPrompt} aria-hidden="true">
                                    $
                                </span>
                                <input
                                    className={s.fieldInput}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@domain.com"
                                    autoComplete="email"
                                    required
                                    aria-label="Email"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className={s.fieldGroup}>
                            <div className={s.fieldLabel}>
                                <span>Password</span>
                                <span className={s.fieldBadge}>min 8</span>
                            </div>
                            <div className={s.fieldRow}>
                                <span className={s.fieldPrompt} aria-hidden="true">
                                    $
                                </span>
                                <input
                                    className={s.fieldInput}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    aria-label="Password"
                                />
                                {/* Toggle visibilità password */}
                                <button
                                    type="button"
                                    className={s.passwordToggle}
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                                >
                                    {showPassword ? (
                                        /* Occhio barrato */
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        /* Occhio aperto */
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember + forgot */}
                        <div className={s.rememberRow}>
                            <label className={s.checkboxLabel}>
                                <div
                                    className={`${s.checkbox} ${remember ? s.checkboxChecked : ""}`}
                                    onClick={() => setRemember((r) => !r)}
                                    role="checkbox"
                                    aria-checked={remember}
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === " " && setRemember((r) => !r)}
                                >
                                    {remember && <div className={s.checkboxInner} />}
                                </div>
                                Remember
                            </label>
                            <button type="button" className={s.forgotBtn} onClick={() => setShowForgot(true)}>
                                Recupera →
                            </button>
                        </div>

                        {/* Submit */}
                        <button type="submit" className={s.btnLogin} disabled={loading} aria-busy={loading}>
                            <div className={s.sweep} aria-hidden="true" />
                            {loading && <span className={s.spinner} aria-hidden="true" />}
                            {loading ? "Autenticazione…" : "ESEGUI · LOGIN"}
                        </button>
                    </form>

                    {/* Demo login */}
                    <button type="button" className={s.btnDemo} onClick={handleDemoLogin} disabled={loading}>
                        {/* Flask icon */}
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M9 3h6" />
                            <path d="M9 3v6L4.5 17.5A2 2 0 0 0 6.32 21h11.36a2 2 0 0 0 1.82-3.5L15 9V3" />
                        </svg>
                        Entra come Demo
                    </button>

                    {/* Footer links */}
                    <div className={s.cardFooter}>
                        <button type="button" className={s.footerBtn}>
                            Privacy
                        </button>
                        <span className={s.footerSep}>·</span>
                        <button type="button" className={s.footerBtn}>
                            Termini
                        </button>
                        <span className={s.footerSep}>·</span>
                        <button type="button" className={s.footerBtn} onClick={() => setShowReg(true)}>
                            Registrati
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <RegisterModal isOpen={showReg} onClose={() => setShowReg(false)} />
            <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
        </div>
    );
}
