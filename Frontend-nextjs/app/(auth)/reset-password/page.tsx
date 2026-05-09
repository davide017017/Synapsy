"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleResetPassword } from "@/lib/auth/handleResetPassword";
import { isPasswordValid } from "@/lib/auth/passwordRules";
import s from "@/app/(auth)/login/login.module.css";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            setToken(params.get("token") || "");
            setEmail(params.get("email") || "");
        }
    }, []);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Password rule checks
    const has8 = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const strength = [has8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    const valid = isPasswordValid(password);
    const matchOk = confirm.length > 0 && password === confirm;
    const matchErr = confirm.length > 0 && password !== confirm;
    const canSubmit = valid && matchOk && !loading;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        if (password !== confirm) {
            setError("Le password non coincidono");
            return;
        }
        if (!valid) {
            setError("La password non rispetta i criteri");
            return;
        }
        setLoading(true);
        setMessage("Invio richiesta in corso...");
        try {
            const { success, message } = await handleResetPassword({
                email,
                token,
                password,
                password_confirmation: confirm,
            });
            if (success) {
                setMessage(message);
                setTimeout(() => router.push("/login?reset=ok"), 1500);
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    const tokenSnippet = token ? `${token.slice(0, 8)}…${token.slice(-8)}` : "—";

    const EyeOpen = () => (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const EyeOff = () => (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    return (
        <div className={s.terminal}>
            {/* Background grid + scan line */}
            <div className={s.gridBg} aria-hidden="true" />
            <div className={s.scan} aria-hidden="true" />

            {/* Top bar */}
            <div className={s.topBar}>
                <div className={s.barLeft}>
                    <span className={s.statusDot} />
                    SYN/AUTH · RESET
                </div>
                <span>TOKEN · OK · {tokenSnippet}</span>
            </div>

            {/* Bottom bar */}
            <div className={s.bottomBar}>
                <span>RESET.EXE · SECURE · ENCRYPTED</span>
                <span>© 2026 SYNAPSY</span>
            </div>

            {/* Corner registration marks */}
            <div className={`${s.corner} ${s.cornerTL}`} aria-hidden="true" />
            <div className={`${s.corner} ${s.cornerTR}`} aria-hidden="true" />
            <div className={`${s.corner} ${s.cornerBL}`} aria-hidden="true" />
            <div className={`${s.corner} ${s.cornerBR}`} aria-hidden="true" />

            {/* Center panel */}
            <div className={s.center}>
                <div className={s.card}>
                    <div className={s.cropTL} aria-hidden="true" />
                    <div className={s.cropBR} aria-hidden="true" />

                    {/* Card header */}
                    <div className={s.cardHeader}>
                        <div className={s.mark}>
                            <div className={s.markCore} />
                        </div>
                        <span className={s.cardLabel}>SYN/RESET</span>
                    </div>

                    {/* Title */}
                    <h1 className={s.title}>
                        Nuova password <span className={s.titleCursor}>_</span>
                    </h1>
                    <p className={s.subtitle}>
                        {"// imposta una password sicura per "}
                        <span style={{ color: "rgba(232,236,239,0.62)" }}>{email}</span>
                    </p>

                    <form onSubmit={submit} noValidate>
                        {/* ── NUOVA password ── */}
                        <div className={s.fieldGroup}>
                            <div className={s.fieldLabel}>
                                <span>Nuova password</span>
                                <span className={s.fieldBadge}>required</span>
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
                                    autoComplete="new-password"
                                    required
                                    aria-label="Nuova password"
                                />
                                <button
                                    type="button"
                                    className={s.passwordToggle}
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                                >
                                    {showPassword ? <EyeOff /> : <EyeOpen />}
                                </button>
                            </div>

                            {/* Strength meter */}
                            <div className={s.pwMeter} aria-hidden="true">
                                {[0, 1, 2, 3].map((i) => (
                                    <span
                                        key={i}
                                        className={`${s.pwMeterSeg} ${i < strength ? s.pwMeterSegActive : ""}`}
                                    />
                                ))}
                            </div>

                            {/* Rules list */}
                            <ul className={s.rulesList} aria-label="Requisiti password">
                                {[
                                    { ok: has8, label: "almeno 8 caratteri" },
                                    { ok: hasUpper, label: "una maiuscola" },
                                    { ok: hasNumber, label: "un numero" },
                                    { ok: hasSpecial, label: "un carattere speciale (consigliato)" },
                                ].map(({ ok, label }) => (
                                    <li key={label} className={`${s.rulesItem} ${ok ? s.rulesItemActive : ""}`}>
                                        <span
                                            className={`${s.rulesDot} ${ok ? s.rulesDotActive : ""}`}
                                            aria-hidden="true"
                                        />
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── CONFERMA password ── */}
                        <div className={s.fieldGroup}>
                            <div className={s.fieldLabel}>
                                <span>Conferma password</span>
                                <span className={s.fieldBadge}>required</span>
                            </div>
                            <div className={s.fieldRow}>
                                <span className={s.fieldPrompt} aria-hidden="true">
                                    $
                                </span>
                                <input
                                    className={s.fieldInput}
                                    type={showConfirm ? "text" : "password"}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    required
                                    aria-label="Conferma password"
                                />
                                <button
                                    type="button"
                                    className={s.passwordToggle}
                                    onClick={() => setShowConfirm((v) => !v)}
                                    aria-label={showConfirm ? "Nascondi password" : "Mostra password"}
                                >
                                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                                </button>
                            </div>
                            {matchOk && <p className={`${s.matchHint} ${s.matchOk}`}>{"// password coincidono"}</p>}
                            {matchErr && (
                                <p className={`${s.matchHint} ${s.matchErr}`}>{"// le password non coincidono"}</p>
                            )}
                        </div>

                        {error && (
                            <p className={s.errorMsg} role="alert">
                                {"// errore: "}
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className={s.btnLogin}
                            disabled={!canSubmit}
                            aria-busy={loading}
                            style={loading ? { opacity: 0.7 } : undefined}
                        >
                            <div className={s.sweep} aria-hidden="true" />
                            {loading && <span className={s.spinner} aria-hidden="true" />}
                            {loading ? "SALVATAGGIO · IN CORSO…" : "SALVA · NUOVA PASSWORD"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
