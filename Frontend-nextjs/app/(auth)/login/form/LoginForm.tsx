"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import RegisterModal from "@/app/(auth)/login/form/RegisterModal";
import ForgotPasswordModal from "@/app/(auth)/login/form/ForgotPasswordModal";

import EmailInput from "./form-components/EmailInput";
import PasswordInput from "./form-components/PasswordInput";
import RememberMeSwitch from "./form-components/RememberMeSwitch";
import AuthLinks from "./form-components/AuthLinks";

export default function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showRegister, setShowRegister] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    // Al caricamento, preleva email dal localStorage (se esiste)
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Salva o rimuove email da localStorage
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }

        const success = await login(email, password);
        setIsLoading(false);

        if (success) {
            router.push("/");
        } else {
            setError("Email o password non corretti");
        }
    };

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
                        <RememberMeSwitch checked={rememberMe} onToggle={() => setRememberMe(!rememberMe)} />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded font-semibold transition ${
                            isLoading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
                        } text-white flex justify-center items-center gap-2`}
                    >
                        {isLoading && (
                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        )}
                        {isLoading ? "Accesso in corso…" : "Accedi"}
                    </button>
                </form>

                <AuthLinks onForgotClick={() => setShowForgot(true)} onRegisterClick={() => setShowRegister(true)} />
            </motion.div>

            <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
            <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
        </>
    );
}
