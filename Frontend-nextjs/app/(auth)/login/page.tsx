"use client";

// ==============================
// IMPORT PRINCIPALI
// ==============================
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/app/(auth)/login/form/LoginForm";
import { handleLogin } from "@/lib/auth/handleLogin";
import { handleTokenLogin } from "@/lib/auth/handleTokenLogin";
import RegisterModal from "@/app/(auth)/login/form/modal/RegisterModal";
import ForgotPasswordModal from "@/app/(auth)/login/form/modal/ForgotPasswordModal";
import { useThemeContext } from "@/context/contexts/ThemeContext";

// ==============================
// PAGINA DI LOGIN CON REDIRECT E SFONDO
// ==============================
export default function LoginPage() {
    // ───── Stato auth sessione ─────
    const { status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showReg, setShowReg] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [info, setInfo] = useState<string | null>(null);
    const { theme, setTheme } = useThemeContext();

    // ───── Forza tema dark durante la schermata di login ─────
    useEffect(() => {
        const prev = theme;
        if (prev !== "dark") setTheme("dark", false);
        return () => {
            if (prev && prev !== "dark") setTheme(prev, false);
        };
        // deliberately exclude `theme` from deps to avoid loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setTheme]);

    // ───── Redirect se già autenticato ─────
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            handleTokenLogin(token).then((ok) => {
                if (ok) router.replace("/");
            });
        }
        if (searchParams.get("verified")) {
            setInfo("Email verificata, ora puoi accedere");
        }
    }, [searchParams, router]);

    // ───── Handler login form (usa helper) ─────
    async function onLogin(email: string, password: string) {
        const ok = await handleLogin(email, password);
        if (!ok) {
            alert("Credenziali non valide");
        } else {
            router.push("/");
        }
    }

    // ==============================
    // RENDER
    // ==============================
    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: "url('/images/bg-login.png')" }}
        >
            {/* Overlay sfocato/oscuro */}
            <div
                className="absolute inset-0 bg-black z-0 pointer-events-none"
                style={{
                    opacity: 0.8,
                    maskImage: "radial-gradient(circle at center, transparent 20%, black 100%)",
                    WebkitMaskImage: "radial-gradient(circle at center, transparent 20%, black 100%)",
                }}
            />
            {/* Form login */}
            <div className="z-10 w-full max-w-sm space-y-2">
                {info && <p className="text-success text-center text-sm">{info}</p>}
                <LoginForm onSubmit={onLogin} onOpenRegister={() => setShowReg(true)} onOpenForgot={() => setShowForgot(true)} />
            </div>

            {/* Modali */}
            <RegisterModal isOpen={showReg} onClose={() => setShowReg(false)} />
            <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
        </div>
    );
}
