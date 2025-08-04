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
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Errore aggiornamento profilo");
    return data.data || data;
}

// ==============================
// DELETE pending email
// ==============================
export async function cancelPendingEmail(token: string): Promise<UserType> {
    const res = await fetch(`${API_URL}/v1/profile/pending-email`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Errore annullamento richiesta");
    return data.data || data;
}

// ==============================
// RESEND pending email link
// ==============================
export async function resendPendingEmail(token: string): Promise<void> {
    const res = await fetch(`${API_URL}/v1/profile/pending-email/resend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Errore invio email");
}

// ==============================
// DELETE profilo (soft delete)
// ==============================
export async function deleteUserProfile(token: string, password: string): Promise<void> {
    const res = await fetch(`${API_URL}/v1/profile`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Errore eliminazione profilo");
}

