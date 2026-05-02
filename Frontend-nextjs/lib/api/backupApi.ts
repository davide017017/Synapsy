// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ API: Backup Database — solo admin (is_admin === true)                      ║
// ║ Chiama direttamente il backend Laravel, stesso pattern di userApi.ts       ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import { API } from "@/lib/api/endpoints";

export type BackupFile = {
    filename: string;
    size: number;       // bytes
    created_at: string; // "YYYY-MM-DD HH:mm:ss"
};

const base = () => API.base;

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/v1/admin/backup
// Avvia la creazione di un nuovo backup e restituisce i dati del file creato.
// ──────────────────────────────────────────────────────────────────────────────
export async function createBackup(
    token: string
): Promise<{ message: string; filename: string | null; size: number | null }> {
    const res = await fetch(`${base()}${API.adminBackup}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || "Errore durante la creazione del backup.");
    return data;
}

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/admin/backups
// Restituisce la lista dei backup ordinati dal più recente.
// ──────────────────────────────────────────────────────────────────────────────
export async function listBackups(token: string): Promise<BackupFile[]> {
    const res = await fetch(`${base()}${API.adminBackups}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || "Errore nel caricamento dei backup.");
    return data?.data ?? [];
}

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/v1/admin/backups/{filename}/download
// Scarica il file come blob e attiva il download nel browser tramite <a>.
// ──────────────────────────────────────────────────────────────────────────────
export async function downloadBackup(token: string, filename: string): Promise<void> {
    const res = await fetch(`${base()}${API.adminBackups}/${encodeURIComponent(filename)}/download`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/octet-stream, application/json",
        },
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Errore durante il download del backup.");
    }

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
}

// ──────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/admin/backups/{filename}
// ──────────────────────────────────────────────────────────────────────────────
export async function deleteBackup(token: string, filename: string): Promise<void> {
    const res = await fetch(`${base()}${API.adminBackups}/${encodeURIComponent(filename)}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || "Errore durante l'eliminazione del backup.");
}

// ──────────────────────────────────────────────────────────────────────────────
// Utility: formatta bytes in stringa leggibile
// ──────────────────────────────────────────────────────────────────────────────
export function formatBytes(bytes: number): string {
    if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} MB`;
    if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(2)} KB`;
    return `${bytes} B`;
}
