// lib/auth/handleLogin.ts
import { signIn } from "next-auth/react";

/**
 * Funzione helper per eseguire il login con NextAuth
 * Restituisce true se login ok, false se errore.
 */
export async function handleLogin(email: string, password: string): Promise<boolean> {
    const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
    });
    return !res?.error;
}

