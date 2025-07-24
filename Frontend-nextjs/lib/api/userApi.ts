// ╔═════════════════════════════════════════════════════════╗
// ║                 API: Profilo Utente                    ║
// ╚═════════════════════════════════════════════════════════╝

import type { UserType } from "@/types/models/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// GET profilo corrente
// ==============================
export async function fetchUserProfile(token: string): Promise<UserType> {
    const res = await fetch(`${API_URL}/v1/profile`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    if (!res.ok) throw new Error("Errore caricamento profilo");
    const data = await res.json();
    return data.data || data;
}

// ==============================
// PUT profilo
// ==============================
export async function updateUserProfile(
    token: string,
    payload: Partial<UserType>
): Promise<UserType> {
    const res = await fetch(`${API_URL}/v1/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Errore aggiornamento profilo");
    const data = await res.json();
    return data.data || data;
}
