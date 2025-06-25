"use client";

// ==============================
// IMPORT PRINCIPALI
// ==============================
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginForm from "@/app/(auth)/login/form/LoginForm";
import { handleLogin } from "@/lib/auth/handleLogin";

// ==============================
// PAGINA DI LOGIN CON REDIRECT E SFONDO
// ==============================
export default function LoginPage() {
    // ───── Stato auth sessione ─────
    const { status } = useSession();
    const router = useRouter();

    // ───── Redirect se già autenticato ─────
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

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
            <LoginForm onSubmit={onLogin} />
        </div>
    );
}
