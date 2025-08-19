// src/context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// AuthContext — login/logout/restore con storage cross-platform
// (AsyncStorage su native, sessionStorage su web) senza usare sessionStorage diretto
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/features/auth/types";
import { login as apiLogin, logout as apiLogout, me } from "@/features/auth/api";
import { storage } from "@/utils/storage";

// ── Chiave per il token salvato ──
const TOKEN_KEY = "auth:token";

// ─────────────────────────────────────────────────────────────────────────────
// Tipi
// ─────────────────────────────────────────────────────────────────────────────
type AuthContextValue = {
    loading: boolean;
    token: string | null;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // ── State ──
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // ───────────────────────────────────────────────────────────────────────────
    // Restore iniziale: prova a leggere il token da storage e carica /me
    // ───────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const t = await storage.get(TOKEN_KEY);
                if (t) {
                    setToken(t);
                    try {
                        const u = await me();
                        setUser(u);
                    } catch {
                        // Token non valido → pulizia soft
                        await storage.remove(TOKEN_KEY);
                        setToken(null);
                        setUser(null);
                    }
                }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ───────────────────────────────────────────────────────────────────────────
    // Login: salva token cross-platform e aggiorna utente
    // ───────────────────────────────────────────────────────────────────────────
    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            // apiLogin può restituire:
            // 1) { user, token }   → preferito
            // 2) User              → fallback (cerchiamo poi il token in storage)
            const result: any = await apiLogin(email, password);

            // ── Estrai user e token in modo robusto ──
            const nextUser: User =
                result && typeof result === "object" && "user" in result ? (result.user as User) : (result as User);

            const newToken: string | null =
                result && typeof result === "object" && "token" in result
                    ? (result.token as string)
                    : await storage.get(TOKEN_KEY); // fallback se apiLogin non lo ritorna

            // ── Persist token (se presente) ──
            if (newToken) {
                await storage.set(TOKEN_KEY, newToken);
                setToken(newToken);
            } else {
                // Se non abbiamo token su mobile, le prossime chiamate protette falliranno:
                // in tal caso adeguare apiLogin a ritornare { token, user }.
                setToken(null);
            }

            // ── Imposta utente ──
            setUser(nextUser);
        } finally {
            setLoading(false);
        }
    };

    // ───────────────────────────────────────────────────────────────────────────
    // Logout: invalida server, pulisce storage e stato locale
    // ───────────────────────────────────────────────────────────────────────────
    const logout = async () => {
        setLoading(true);
        try {
            // Non importa se fallisce: comunque puliamo il client
            try {
                await apiLogout();
            } catch {
                /* empty */
            }
            await storage.remove(TOKEN_KEY);
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // ───────────────────────────────────────────────────────────────────────────
    // Refresh /me manuale
    // ───────────────────────────────────────────────────────────────────────────
    const refreshMe = async () => {
        const u = await me();
        setUser(u);
    };

    // ───────────────────────────────────────────────────────────────────────────
    // Value memoizzato
    // ───────────────────────────────────────────────────────────────────────────
    const value = useMemo(() => ({ loading, token, user, login, logout, refreshMe }), [loading, token, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export const useAuth = () => useContext(AuthContext);
