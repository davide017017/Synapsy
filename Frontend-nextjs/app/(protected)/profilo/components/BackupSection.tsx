"use client";

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ BackupSection — Sezione admin per il backup del database                   ║
// ║ Visibile solo se user.is_admin === true                                    ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DatabaseBackup, Download, Trash2, RefreshCw } from "lucide-react";
import {
    type BackupFile,
    createBackup,
    listBackups,
    downloadBackup,
    deleteBackup,
    formatBytes,
} from "@/lib/api/backupApi";
import { useUser } from "@/context/UserContext";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

export default function BackupSection() {
    const { data: session } = useSession();
    const { user } = useUser();
    const token = session?.accessToken as string | undefined;

    const [backups, setBackups] = useState<BackupFile[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [creating, setCreating] = useState(false);
    const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
    const [deletingFile, setDeletingFile] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const isLocal =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    // ─── mostra solo in development e solo agli admin ─────────────────────
    if (process.env.NODE_ENV !== "development") return null;
    if (!user?.is_admin) return null;

    // ─── carica lista backup ───────────────────────────────────────────────
    const loadList = useCallback(async () => {
        if (!token) return;
        setLoadingList(true);
        try {
            const data = await listBackups(token);
            setBackups(data);
        } catch (e: any) {
            toast.error(e.message || "Errore caricamento lista backup.");
        } finally {
            setLoadingList(false);
        }
    }, [token]);

    useEffect(() => {
        loadList();
    }, [loadList]);

    // ─── crea nuovo backup ─────────────────────────────────────────────────
    const handleCreate = async () => {
        if (!token) return;
        setCreating(true);
        try {
            const res = await createBackup(token);
            toast.success(res.message || "Backup completato.");
            await loadList();
        } catch (e: any) {
            toast.error(e.message || "Errore creazione backup.");
        } finally {
            setCreating(false);
        }
    };

    // ─── download ──────────────────────────────────────────────────────────
    const handleDownload = async (filename: string) => {
        if (!token) return;
        setDownloadingFile(filename);
        try {
            await downloadBackup(token, filename);
        } catch (e: any) {
            toast.error(e.message || "Errore download.");
        } finally {
            setDownloadingFile(null);
        }
    };

    // ─── elimina ───────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!token || !confirmDelete) return;
        setDeletingFile(confirmDelete);
        setConfirmDelete(null);
        try {
            await deleteBackup(token, confirmDelete);
            toast.success("Backup eliminato.");
            setBackups((prev) => prev.filter((b) => b.filename !== confirmDelete));
        } catch (e: any) {
            toast.error(e.message || "Errore eliminazione.");
        } finally {
            setDeletingFile(null);
        }
    };

    // ─── render ────────────────────────────────────────────────────────────
    return (
        <>
            <div
                className="mt-8 rounded-xl shadow-sm overflow-hidden"
                style={{
                    background: "hsl(var(--c-bg-elevate, 44 36% 88%) / 0.8)",
                    border: "1px solid hsl(var(--c-primary-border, 205 66% 49% / 0.16))",
                    boxShadow: "0 2px 12px 0 hsl(var(--c-primary-shadow, 205 66% 49% / 0.09))",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-4 border-b"
                    style={{ borderColor: "hsl(var(--c-primary-border, 205 66% 49% / 0.12))" }}
                >
                    <div className="flex items-center gap-2">
                        <DatabaseBackup size={20} className="text-primary" />
                        <h2 className="font-semibold text-primary text-base">Backup Database</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Ricarica lista */}
                        <button
                            type="button"
                            onClick={loadList}
                            disabled={loadingList}
                            className="
                                p-1.5 rounded-lg border transition
                                bg-bg-soft border-secondary text-text-secondary
                                hover:bg-bg-alt hover:text-text
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                            title="Aggiorna lista"
                        >
                            <RefreshCw size={15} className={loadingList ? "animate-spin" : ""} />
                        </button>

                        {/* Crea backup — solo in locale */}
                        {isLocal && (
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={creating}
                                className="
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                                    font-medium text-sm transition
                                    bg-primary text-text-invert border-primary
                                    hover:opacity-90 hover:scale-105 active:scale-95
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                "
                            >
                                {creating ? (
                                    <>
                                        <RefreshCw size={14} className="animate-spin" />
                                        In corso...
                                    </>
                                ) : (
                                    <>
                                        <DatabaseBackup size={14} />
                                        Crea backup
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Lista backup */}
                <div className="px-5 py-3">
                    {loadingList && backups.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-3 text-center">
                            Caricamento backup...
                        </p>
                    ) : backups.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-3 text-center">
                            Nessun backup disponibile. Crea il primo backup.
                        </p>
                    ) : (
                        <ul className="divide-y" style={{ borderColor: "hsl(var(--c-primary-border, 205 66% 49% / 0.1))" }}>
                            {backups.map((backup) => (
                                <li
                                    key={backup.filename}
                                    className="flex items-center justify-between py-3 gap-3 flex-wrap"
                                >
                                    {/* Info file */}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-mono text-text truncate">
                                            {backup.filename}
                                        </span>
                                        <span className="text-xs text-muted-foreground mt-0.5">
                                            {formatBytes(backup.size)} · {backup.created_at}
                                        </span>
                                    </div>

                                    {/* Azioni */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Download */}
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(backup.filename)}
                                            disabled={downloadingFile === backup.filename}
                                            className="
                                                flex items-center gap-1 px-2.5 py-1 rounded-lg border
                                                text-xs font-medium transition
                                                bg-bg-soft border-secondary text-text-secondary
                                                hover:bg-primary hover:text-text-invert hover:border-primary
                                                active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                            "
                                        >
                                            {downloadingFile === backup.filename ? (
                                                <RefreshCw size={12} className="animate-spin" />
                                            ) : (
                                                <Download size={12} />
                                            )}
                                            Scarica
                                        </button>

                                        {/* Elimina — solo in locale */}
                                        {isLocal && (
                                            <button
                                                type="button"
                                                onClick={() => setConfirmDelete(backup.filename)}
                                                disabled={deletingFile === backup.filename}
                                                className="
                                                    flex items-center gap-1 px-2.5 py-1 rounded-lg border
                                                    text-xs font-medium transition
                                                    bg-bg-soft border-secondary text-text-secondary
                                                    hover:bg-danger hover:text-text-invert hover:border-danger-dark
                                                    active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                                "
                                            >
                                                {deletingFile === backup.filename ? (
                                                    <RefreshCw size={12} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={12} />
                                                )}
                                                Elimina
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Dialog conferma eliminazione */}
            {confirmDelete && (
                <ConfirmDialog
                    open={!!confirmDelete}
                    type="delete"
                    title="Elimina backup"
                    message={`Sei sicuro di voler eliminare questo backup? L'azione è irreversibile.`}
                    highlight={confirmDelete}
                    confirmLabel="Elimina"
                    cancelLabel="Annulla"
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </>
    );
}
