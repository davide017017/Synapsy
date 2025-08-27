"use client";

/* ╔══════════════════════════════════════════════════════╗
 * ║ UserContext — Profilo utente + azioni email          ║
 * ║ Cache di modulo + coalescing delle fetch             ║
 * ╚══════════════════════════════════════════════════════╝ */

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import type { UserType } from "@/types/models/user";
import { fetchUserProfile, updateUserProfile, cancelPendingEmail, resendPendingEmail } from "@/lib/api/userApi";

/* ────────────────────────────────────────────────────────────────
 * Cache & promise a livello di modulo per il profilo
 * ──────────────────────────────────────────────────────────────── */
let userCache: UserType | null = null;
let userPromise: Promise<UserType> | null = null;
let userToken: string | undefined;

/* ===============================================================
 * Tipi del context
 * =============================================================== */
export type UserContextType = {
    user: UserType | null;
    loading: boolean;
    error: string | null;

    refresh: () => void;
    update: (data: Partial<UserType>) => Promise<void>;
    cancelPending: () => Promise<void>;
    resendPending: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ===============================================================
 * Provider
 * =============================================================== */
export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;

    /* =============================================================
     * Fetch profilo (cache + coalescing)
     * ============================================================= */
    const loadUser = useCallback(
        async (force = false) => {
            if (!token) {
                setUser(null);
                userCache = null;
                userPromise = null;
                userToken = undefined;
                setLoading(false);
                return;
            }

            // Cambio utente → invalida cache
            if (userToken !== token) {
                userCache = null;
                userPromise = null;
                userToken = token;
            }

            // Usa cache se presente e non forzato
            if (!force && userCache) {
                setUser(userCache);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const promise = userPromise ?? fetchUserProfile(token);
                userPromise = promise;

                const data = await promise;
                userCache = data;
                setUser(data);
            } catch (e: any) {
                const msg = e?.message ?? "Errore caricamento profilo";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
                userPromise = null;
            }
        },
        [token]
    );

    // Bootstrap iniziale (o quando cambia token)
    useEffect(() => {
        if (token) void loadUser();
    }, [token, loadUser]);

    // Invalida cache e forza il refetch
    const refresh = useCallback(() => {
        userCache = null;
        userPromise = null;
        void loadUser(true);
    }, [loadUser]);

    /* =============================================================
     * Mutazioni profilo
     *  - Aggiorniamo sia lo stato locale che la cache di modulo
     * ============================================================= */
    const update = async (data: Partial<UserType>) => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const updated = await updateUserProfile(token, data);
            setUser(updated);
            userCache = updated;
            toast.success("Profilo aggiornato!");
        } catch (e: any) {
            const msg = e?.message ?? "Errore aggiornamento profilo";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const cancelPending = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const updated = await cancelPendingEmail(token);
            setUser(updated);
            userCache = updated;
            toast.success("Richiesta annullata!");
        } catch (e: any) {
            const msg = e?.message ?? "Errore annullamento richiesta";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const resendPending = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            await resendPendingEmail(token);
            toast.success("Email di conferma inviata!");
        } catch (e: any) {
            const msg = e?.message ?? "Errore invio email";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                error,
                refresh,
                update,
                cancelPending,
                resendPending,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

/* ===============================================================
 * Hook custom
 * =============================================================== */
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser deve essere usato dentro <UserProvider>");
    return ctx;
}
