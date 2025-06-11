"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoginForm from "@/app/(auth)/login/form/LoginForm";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace("/");
        }
    }, [user]);

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: "url('/images/bg-login.png')" }}
        >
            <div
                className="absolute inset-0 bg-black z-0 pointer-events-none"
                style={{
                    opacity: 0.8,
                    maskImage: "radial-gradient(circle at center, rgba(0,0,0,0)20%, rgba(0,0,0,1) 100%)",
                    WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 100%)",
                }}
            />
            <LoginForm />
        </div>
    );
}
