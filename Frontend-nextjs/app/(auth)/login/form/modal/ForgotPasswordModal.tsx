"use client";

import { useState } from "react";
import { handleForgotPassword } from "@/lib/auth/handleForgotPassword";
import s from "@/app/(auth)/login/login.module.css";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: Props) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        setMessage("Invio email in corso...");

        try {
            const { success, message } = await handleForgotPassword(email);
            if (success) {
                setMessage(message);
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // True only after a successful API response (not during loading)
    const sent = !!message && !error && !loading;

    return (
        <div className={s.modalScrim} onClick={onClose} role="dialog" aria-modal="true">
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
                        <span className={s.cardLabel}>SYN/RECOVER</span>
                    </div>
                    <button
                        type="button"
                        className={s.modalCloseBtn}
                        onClick={onClose}
                        aria-label="Chiudi"
                    >
                        ✕
                    </button>
                </div>

                {/* Title */}
                <h2 className={s.title} style={{ fontSize: "22px", marginBottom: "6px" }}>
                    Recupero <span className={s.titleCursor}>_</span>
                </h2>
                <p className={s.subtitle}>
                    {"// inserisci la tua email per ricevere un magic-link di reset"}
                </p>

                {sent ? (
                    /* ── Success state ── */
                    <p className={s.successBlock}>
                        {"// link inviato a "}
                        <span style={{ color: "#14b88a" }}>{email}</span>
                        {". controlla la posta."}
                    </p>
                ) : (
                    /* ── Form state ── */
                    <form onSubmit={submit} autoComplete="off" noValidate>
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
                            <p className={s.fieldHint}>{"// link valido 30 minuti"}</p>
                        </div>

                        {error && (
                            <p className={s.errorMsg} role="alert">
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className={s.btnLogin}
                            disabled={loading}
                            aria-busy={loading}
                            style={{ marginBottom: "10px" }}
                        >
                            <div className={s.sweep} aria-hidden="true" />
                            {loading && <span className={s.spinner} aria-hidden="true" />}
                            {loading ? "INVIO · IN CORSO…" : "INVIA · MAGIC LINK"}
                        </button>

                        {/* Cancel */}
                        <button
                            type="button"
                            className={s.btnDemo}
                            onClick={onClose}
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
