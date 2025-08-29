// ╔═════════════════════════════════════════════════════════╗
// ║                 API: Profilo Utente                    ║
// ╚═════════════════════════════════════════════════════════╝

import type { UserType } from "@/types/models/user";
import { url } from "@/lib/api/endpoints";

// ==============================
// GET profilo corrente
// ==============================
export async function fetchUserProfile(token: string): Promise<UserType> {
    const endpoint = url("profile");
    try {
        const res = await fetch(endpoint, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const bodyText = await res.text();
        let body: any = null;
        try {
            body = JSON.parse(bodyText);
        } catch {
            body = bodyText;
        }

        if (!res.ok) {
            console.error("[fetchUserProfile] fetch failed", {
                url: endpoint,
                status: res.status,
                body: typeof body === "string" ? body.slice(0, 200) : body,
            });
            throw new Error(body?.message || "Errore caricamento profilo");
        }

        return body.data || body;
    } catch (err) {
        console.error("[fetchUserProfile] network error", {
            url: endpoint,
            error: err,
        });
        throw err;
    }
}

// ==============================
// PUT profilo
// ==============================
export async function updateUserProfile(token: string, payload: Partial<UserType>): Promise<UserType> {
    const res = await fetch(url("profile"), {
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
    const res = await fetch(`${url("profile")}/pending-email`, {
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
    const res = await fetch(`${url("profile")}/pending-email/resend`, {
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
    const res = await fetch(url("profile"), {
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

// ─────────────────────────────────────────────────────────
// Descrizione file:
// Wrapper API per profilo utente. Include diagnostica avanzata
// (log URL, status e snippet body in caso di errore).
// Funzioni CRUD con Bearer token per l’autenticazione.
// ─────────────────────────────────────────────────────────
