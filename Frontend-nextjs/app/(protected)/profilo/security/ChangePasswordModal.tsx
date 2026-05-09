"use client";

import { useState } from "react";
import { handleChangePassword } from "@/lib/auth/handleChangePassword";
import { validatePassword, passwordStrength } from "@/lib/auth/passwordRules";
import s from "@/app/(auth)/login/login.module.css";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }: Props) {
    const [current, setCurrent] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const { ok: validNew, rules } = validatePassword(password);
    const strength = passwordStrength(password);
    const matchOk = confirm.length > 0 && password === confirm;
    const matchErr = confirm.length > 0 && password !== confirm;
    const canSubmit = current.length > 0 && validNew && matchOk && !loading;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { success, message } = await handleChangePassword({
                currentPassword: current,
                newPassword: password,
            });
            if (success) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    onSuccess?.();
                }, 1500);
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        onClose();
    };

    if (!isOpen) return null;

    const EyeOpen = () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const EyeOff = () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    return (
        <div className={s.modalScrim} onClick={handleClose} role="dialog" aria-modal="true">
            <div className={s.modalPanel} onClick={(e) => e.stopPropagation()}>
                {/* Crop marks */}
                <div className={s.cropTL} aria-hidden="true" />
                <div className={s.cropBR} aria-hidden="true" />

                {/* Header */}
                <div className={s.modalHeader}>
                    <div className={s.cardHeader} style={{ marginBottom: 0 }}>
                        <div className={s.mark}>
                            <div className={s.markCore} />
                        </div>
                        <span className={s.cardLabel}>SYN/CHANGE-PWD</span>
                    </div>
                    <button
                        type="button"
                        className={s.modalCloseBtn}
                        onClick={handleClose}
                        aria-label="Chiudi"
                    >
                        ✕
                    </button>
                </div>

                {/* Title */}
                <h2 className={s.title} style={{ fontSize: "22px", marginBottom: "6px" }}>
                    Cambia password <span className={s.titleCursor}>_</span>
                </h2>
                <p className={s.subtitle}>{"// per sicurezza, conferma quella attuale"}</p>

                {submitted ? (
                    <p className={s.successBlock}>
                        {"// password aggiornata con successo"}
                    </p>
                ) : (
                    <form onSubmit={submit} autoComplete="off" noValidate>
                        {/* ── PASSWORD ATTUALE ── */}
                        <div className={s.fieldGroup}>
                            <div className={s.fieldLabel}>
                                <span>Password attuale</span>
                                <span className={s.fieldBadge}>required</span>
                            </div>
                            <div className={s.fieldRow}>
                                <span className={s.fieldPrompt} aria-hidden="true">$</span>
                                <input
                                    className={s.fieldInput}
                                    type={showCurrent ? "text" : "password"}
                                    value={current}
                                    onChange={(e) => setCurrent(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    aria-label="Password attuale"
                                />
                                <button
                                    type="button"
                                    className={s.passwordToggle}
                                    onClick={() => setShowCurrent((v) => !v)}
                                    aria-label={showCurrent ? "Nascondi" : "Mostra"}
                                >
                                    {showCurrent ? <EyeOff /> : <EyeOpen />}
                                </button>
                            </div>
                        </div>

                        {/* ── NUOVA PASSWORD ── */}
                        <div className={s.fieldGroup}>
                            <div className={s.fieldLabel}>
                                <span>Nuova password</span>
                                <span className={s.fieldBadge}>min 8</span>
                            </div>
                            <div className={s.fieldRow}>
                                <span className={s.fieldPrompt} aria-hidden="true">$</span>
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
                                    aria-label={showPassword ? "Nascondi" : "Mostra"}
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
                                    { ok: rules.len,     label: "almeno 8 caratteri" },
                                    { ok: rules.upper,   label: "una maiuscola" },
                                    { ok: rules.num,     label: "un numero" },
                                    { ok: rules.special, label: "un carattere speciale (consigliato)" },
                                ].map(({ ok, label }) => (
                                    <li key={label} className={`${s.rulesItem} ${ok ? s.rulesItemActive : ""}`}>
                                        <span className={`${s.rulesDot} ${ok ? s.rulesDotActive : ""}`} aria-hidden="true" />
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── CONFERMA PASSWORD ── */}
                        <div className={s.fieldGroup}>
                            <div className={s.fieldLabel}>
                                <span>Conferma nuova</span>
                                <span className={s.fieldBadge}>match</span>
                            </div>
                            <div className={s.fieldRow}>
                                <span className={s.fieldPrompt} aria-hidden="true">$</span>
                                <input
                                    className={s.fieldInput}
                                    type={showConfirm ? "text" : "password"}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    required
                                    aria-label="Conferma nuova password"
                                />
                                <button
                                    type="button"
                                    className={s.passwordToggle}
                                    onClick={() => setShowConfirm((v) => !v)}
                                    aria-label={showConfirm ? "Nascondi" : "Mostra"}
                                >
                                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                                </button>
                            </div>
                            {matchOk && (
                                <p className={`${s.matchHint} ${s.matchOk}`}>{"// password coincidono"}</p>
                            )}
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
                            style={{ marginBottom: "10px", ...(loading ? { opacity: 0.7 } : {}) }}
                        >
                            <div className={s.sweep} aria-hidden="true" />
                            {loading && <span className={s.spinner} aria-hidden="true" />}
                            {loading ? "AGGIORNAMENTO · IN CORSO…" : "AGGIORNA · PASSWORD"}
                        </button>

                        {/* Cancel */}
                        <button
                            type="button"
                            className={s.btnDemo}
                            onClick={handleClose}
                            disabled={loading}
                            style={{ marginBottom: 0 }}
                        >
                            ANNULLA
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
