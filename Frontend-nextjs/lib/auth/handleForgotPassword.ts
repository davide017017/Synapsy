// lib/auth/handleForgotPassword.ts
import { url } from "@/lib/api/endpoints";

export async function handleForgotPassword(email: string): Promise<{success:boolean; message:string}> {
    const res = await fetch(url("forgotPassword"), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
        const msg = data.message || 'Si è verificato un errore';
        return { success: false, message: msg };
    }
    return { success: true, message: data.message || 'Se l\'email esiste riceverai un messaggio con le istruzioni per il reset' };
}

