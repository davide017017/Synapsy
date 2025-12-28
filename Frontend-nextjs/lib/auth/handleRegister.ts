// lib/auth/handleRegister.ts

import { url } from "@/lib/api/endpoints";

export interface RegisterPayload {
    name: string;
    surname: string;
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
    has_accepted_terms: boolean;
}

export async function handleRegister(payload: RegisterPayload): Promise<{ success: boolean; message: string }> {
    try {
        const res = await fetch(url("register"), {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) {
            return { success: false, message: data?.message || "Errore di registrazione" };
        }

        return { success: true, message: data?.message || "Registrazione completata" };
    } catch {
        return { success: false, message: "Errore di rete o risposta non valida" };
    }
}

/* ------------------------------------------------------
Descrizione file:
handleRegister.ts: invia una POST al backend verso l’endpoint "register".
Gestisce risposta ok/errore e ritorna {success,message}.
Include parsing robusto (text→JSON) per evitare crash su risposte non JSON.
------------------------------------------------------ */
