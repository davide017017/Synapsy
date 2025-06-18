"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import RegisterModal from "@/app/(auth)/login/form/RegisterModal";
import ForgotPasswordModal from "@/app/(auth)/login/form/ForgotPasswordModal";

import EmailInput from "./form-components/EmailInput";
import PasswordInput from "./form-components/PasswordInput";
import RememberMeSwitch from "./form-components/RememberMeSwitch";
import AuthLinks from "./form-components/AuthLinks";

/* ⬇️  dichiara le props (onSubmit) */
interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
    /* stato locale per i campi */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /* modali */
    const [showReg, setShowReg] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    /* carica email salvata */
    useEffect(() => {
        const saved = localStorage.getItem("rememberedEmail");
        if (saved) {
            setEmail(saved);
            setRemember(true);
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        /* remember-me */
        remember ? localStorage.setItem("rememberedEmail", email) : localStorage.removeItem("rememberedEmail");

        /* chiama la callback passata dal parent */
        await onSubmit(email, password).catch(() => setError("Email o password non corretti"));

        setLoading(false);
    }

    /* UI invariata */
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 bg-black/70 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md text-white shadow-lg space-y-6"
            >
                <h1 className="text-2xl font-bold text-center text-primary">Accedi a Synapsi</h1>

                {error && <p className="text-sm text-red-300 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <EmailInput value={email} onChange={setEmail} />
                    <PasswordInput value={password} onChange={setPassword} />

                    <div className="flex items-center justify-between">
                        <RememberMeSwitch checked={remember} onToggle={() => setRemember(!remember)} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded font-semibold transition ${
                            loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
                        } text-white flex justify-center items-center gap-2`}
                    >
                        {loading && (
                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        )}
                        {loading ? "Accesso in corso…" : "Accedi"}
                    </button>
                </form>

                <AuthLinks onForgotClick={() => setShowForgot(true)} onRegisterClick={() => setShowReg(true)} />
            </motion.div>

            <RegisterModal isOpen={showReg} onClose={() => setShowReg(false)} />
            <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
        </>
    );
}
