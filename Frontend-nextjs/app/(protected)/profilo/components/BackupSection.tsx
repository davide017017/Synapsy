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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
                className="
                    mt-8
                    rounded-2xl
                    border
                    overflow-hidden
                    backdrop-blur-xl
                    shadow-[0_18px_55px_rgba(0,0,0,0.22)]
                "
                style={{
                    background: "hsl(var(--c-bg-elevate, 44 36% 88%) / 0.72)",
                    borderColor: "hsl(var(--c-primary) / 0.18)",
                }}
            >
                {/* Header */}
                <div
                    className="
                        flex items-center justify-between
                        px-5 py-4
                        border-b
                        bg-black/5
                    "
                    style={{ borderColor: "hsl(var(--c-primary) / 0.14)" }}
                >
                    <div className="flex items-center gap-2">
                        <DatabaseBackup
                            size={20}
                            className="text-primary drop-shadow-[0_0_12px_hsl(var(--c-primary)/0.35)]"
                        />

                        <div>
                            <h2
                                className="
                                    font-mono
                                    text-sm
                                    font-bold
                                    uppercase
                                    tracking-[0.14em]
                                    text-primary
                                "
                            >
                                Backup Database
                            </h2>

                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35">
                                {"// local admin tools"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Ricarica lista */}
                        <button
                            type="button"
                            onClick={loadList}
                            disabled={loadingList}
                            className="
                              p-2
                              rounded-xl
                              border
                              bg-primary/10
                              border-primary/25
                              text-primary
                              transition-all duration-200
                              hover:bg-primary/15
                              hover:shadow-[0_0_14px_hsl(var(--c-primary)/0.20)]
                              active:scale-95
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
                                    flex items-center gap-1.5
                                    px-3 py-2
                                    rounded-xl
                                    border
                                    font-mono
                                    text-[11px]
                                    uppercase
                                    tracking-[0.08em]
                                    bg-primary/15
                                    border-primary/35
                                    text-primary
                                    transition-all duration-200
                                    hover:bg-primary/20
                                    hover:shadow-[0_0_16px_hsl(var(--c-primary)/0.25)]
                                    active:scale-95
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
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/40 py-3 text-center">
                            Caricamento backup...
                        </p>
                    ) : backups.length === 0 ? (
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/40 py-3 text-center">
                            Nessun backup disponibile. Crea il primo backup.
                        </p>
                    ) : (
                        <ul
                            className="divide-y"
                            style={{ borderColor: "hsl(var(--c-primary-border, 205 66% 49% / 0.1))" }}
                        >
                            {backups.map((backup) => (
                                <li
                                    key={backup.filename}
                                    className="
                                        flex items-center justify-between
                                        py-3 gap-3 flex-wrap
                                        transition-colors
                                        hover:bg-primary/5
                                        rounded-xl
                                        px-2
                                    "
                                >
                                    {/* Info file */}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-mono text-primary truncate tracking-[0.04em]">
                                            {backup.filename}
                                        </span>{" "}
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
                                                flex items-center gap-1.5
                                                px-2.5 py-1.5
                                                rounded-xl
                                                border
                                                font-mono
                                                text-[10px]
                                                uppercase
                                                tracking-[0.06em]
                                                bg-primary/10
                                                border-primary/25
                                                text-primary
                                                transition-all duration-200
                                                hover:bg-primary/15
                                                hover:shadow-[0_0_12px_hsl(var(--c-primary)/0.20)]
                                                active:scale-95
                                                disabled:opacity-50 disabled:cursor-not-allowed
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
                                                  flex items-center gap-1.5
                                                  px-2.5 py-1.5
                                                  rounded-xl
                                                  border
                                                  font-mono
                                                  text-[10px]
                                                  uppercase
                                                  tracking-[0.06em]
                                                  bg-red-500/10
                                                  border-red-400/25
                                                  text-red-400/85
                                                  transition-all duration-200
                                                  hover:bg-red-500/15
                                                  hover:text-red-300
                                                  hover:shadow-[0_0_12px_rgba(248,113,113,0.22)]
                                                  active:scale-95
                                                  disabled:opacity-50 disabled:cursor-not-allowed
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
