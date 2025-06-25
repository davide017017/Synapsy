"use client";

// ==============================
// IMPORT PRINCIPALI
// ==============================
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RegisterModal from "@/app/(auth)/login/form/RegisterModal";
import ForgotPasswordModal from "@/app/(auth)/login/form/ForgotPasswordModal";
import EmailInput from "./form-components/EmailInput";
import PasswordInput from "./form-components/PasswordInput";
import RememberMeSwitch from "./form-components/RememberMeSwitch";
import AuthLinks from "./form-components/AuthLinks";
import { LogIn } from "lucide-react";

// ==============================
// LoginForm: Form di accesso con modali e UX
// ==============================
interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
    // ───── Stati input ─────
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    // ───── Stati feedback/modali ─────
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showReg, setShowReg] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    // ───── Ricorda email al mount ─────
    useEffect(() => {
        const saved = localStorage.getItem("rememberedEmail");
        if (saved) {
            setEmail(saved);
            setRemember(true);
        }
    }, []);

    // ───── Submit handler ─────
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        // Gestione remember-me
        remember ? localStorage.setItem("rememberedEmail", email) : localStorage.removeItem("rememberedEmail");
        try {
            await onSubmit(email, password);
        } catch {
            setError("Email o password non corretti");
        } finally {
            setLoading(false);
        }
    }

    // ==============================
    // RENDER
    // ==============================
    return (
        <>
            {/* ===== CARD LOGIN ===== */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 bg-black/70 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md text-white shadow-lg space-y-6"
            >
                {/* Titolo */}
                <h1 className="text-2xl font-bold text-center text-primary">Accedi a Synapsi</h1>

                {/* Messaggio errore */}
                {error && <p className="text-sm text-danger text-center">{error}</p>}

                {/* ===== FORM ===== */}
                <form onSubmit={handleSubmit} className="space-y-4 rounded">
                    <EmailInput value={email} onChange={setEmail} />
                    <PasswordInput value={password} onChange={setPassword} />
                    <div className="flex items-center justify-between">
                        <RememberMeSwitch checked={remember} onToggle={() => setRemember(!remember)} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            w-full py-2 rounded-2xl font-semibold
                            flex justify-center items-center gap-2
                            text-white shadow-md
                            transition-all duration-200
                            bg-gradient-to-r from-primary to-primary-dark
                            hover:shadow-2xl hover:-translate-y-0.5
                            active:scale-95
                            focus:outline-none focus:ring-2 focus:ring-primary/40
                            ${loading ? "opacity-70 cursor-not-allowed" : ""}
                        `}
                        style={{
                            background: "var(--c-primary-gradient)",
                        }}
                        aria-busy={loading}
                        aria-label="Accedi"
                    >
                        {loading && (
                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        )}
                        {!loading && <LogIn size={18} className="mr-2" />}
                        {loading ? "Accesso in corso…" : "Accedi"}
                    </button>
                </form>

                {/* Link “registrati/recupera password” */}
                <AuthLinks onForgotClick={() => setShowForgot(true)} onRegisterClick={() => setShowReg(true)} />
            </motion.div>

            {/* ===== MODALI ===== */}
            <RegisterModal isOpen={showReg} onClose={() => setShowReg(false)} />
            <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
        </>
    );
}
