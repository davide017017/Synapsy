// lib/auth/handleRegister.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RegisterPayload {
    name: string;
    surname: string;
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
    has_accepted_terms: boolean;
}

export async function handleRegister(payload: RegisterPayload): Promise<{success:boolean; message:string}> {
    if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL not defined');
    const res = await fetch(`${API_URL}/v1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
        const msg = data.message || 'Errore di registrazione';
        return { success: false, message: msg };
    }
    return { success: true, message: data.message || 'Registrazione completata' };
}

