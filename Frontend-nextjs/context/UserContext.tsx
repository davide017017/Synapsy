"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { UserType } from "@/types/models/user";
import {
    fetchUserProfile,
    updateUserProfile,
    cancelPendingEmail,
    resendPendingEmail,
} from "@/lib/api/userApi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ========================================================
// Tipo del context
// ========================================================
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

// ========================================================
// Provider principale
// ========================================================
export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();
    const token = session?.accessToken as string;

    // Fix: memoize load to avoid repeated profile fetch
    const inFlightRef = useRef(false);
    const loadUser = useCallback(async () => {
        if (!token || inFlightRef.current) return;
        inFlightRef.current = true;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUserProfile(token);
            setUser(data);
        } catch (e: any) {
            setError(e.message || "Errore caricamento profilo");
            toast.error(e.message || "Errore caricamento profilo");
        } finally {
            setLoading(false);
            inFlightRef.current = false;
        }
    }, [token]);

    useEffect(() => {
        if (token) loadUser();
    }, [token, loadUser]); // Fix: include loadUser

    const update = async (data: Partial<UserType>) => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const updated = await updateUserProfile(token, data);
            setUser(updated);
            toast.success("Profilo aggiornato!");
        } catch (e: any) {
            setError(e.message || "Errore aggiornamento profilo");
            toast.error(e.message || "Errore aggiornamento profilo");
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
            toast.success("Richiesta annullata!");
        } catch (e: any) {
            setError(e.message || "Errore annullamento richiesta");
            toast.error(e.message || "Errore annullamento richiesta");
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
            setError(e.message || "Errore invio email");
            toast.error(e.message || "Errore invio email");
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
                refresh: loadUser,
                update,
                cancelPending,
                resendPending,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser deve essere usato dentro <UserProvider>");
    return ctx;
}

