"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginForm from "@/app/(auth)/login/form/LoginForm";

/*  Il tuo <LoginForm /> deve accettare onSubmit(email, password)
    e internamente validare i campi; qui sotto un esempio */

export default function LoginPage() {
    /* next-auth session */
    const { data: session, status } = useSession();
    const router = useRouter();

    /* se già loggato → redirect alla home */
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    /* handler che il LoginForm chiamerà */
    async function handleLogin(email: string, password: string) {
        const res = await signIn("credentials", {
            redirect: false, // niente redirect automatico
            email,
            password,
        });

        if (res?.error) {
            alert("Credenziali non valide"); // gestisci come preferisci
        } else {
            router.push("/"); // login OK → homepage
        }
    }

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: "url('/images/bg-login.png')" }}
        >
            <div
                className="absolute inset-0 bg-black z-0 pointer-events-none"
                style={{
                    opacity: 0.8,
                    maskImage: "radial-gradient(circle at center, transparent 20%, black 100%)",
                    WebkitMaskImage: "radial-gradient(circle at center, transparent 20%, black 100%)",
                }}
            />

            {/* LoginForm ora riceve la callback */}
            <LoginForm onSubmit={handleLogin} />
        </div>
    );
}
