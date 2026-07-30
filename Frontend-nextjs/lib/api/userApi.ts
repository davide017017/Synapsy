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
            throw new Error(body?.message || "Errore caricamento profilo");
        }

        return body.data || body;
    } catch (err) {
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

// ==============================
// POST rigenera dati demo (solo utente demo)
// ==============================
export type ReseedDemoDataResult = {
    cleanup: Record<string, number>;
    mesi: Array<{
        label: string;
        n_spese: number;
        n_entrate: number;
        tot_spese: number;
        tot_entrate: number;
        periodo_inizio: string;
        periodo_fine: string;
    }>;
    n_ricorrenze: number;
    n_snapshots: number;
};

export async function reseedDemoData(token: string, secret: string): Promise<ReseedDemoDataResult> {
    const res = await fetch(url("reseedDemoData"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: JSON.stringify({ secret }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Errore rigenerazione dati demo");
    return data.data || data;
}

// ─────────────────────────────────────────────────────────
// Descrizione file:
// Wrapper API per profilo utente. Include diagnostica avanzata
// (log URL, status e snippet body in caso di errore).
// Funzioni CRUD con Bearer token per l’autenticazione.
// ─────────────────────────────────────────────────────────
