// lib/auth/handleForgotPassword.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function handleForgotPassword(email: string): Promise<{success:boolean; message:string}> {
    if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL not defined');
    const res = await fetch(`${API_URL}/v1/forgot-password`, {
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

