"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginUser, fetchUserProfile, logoutUser } from "@/lib/api/authApi";
import type { User, AuthContextType } from "@/types/types/auth";

// ─────────────────────────────────────────────
// Context per autenticazione utente globale
// ─────────────────────────────────────────────

// 1. Creazione del contesto (vuoto inizialmente)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Provider che gestisce login/logout/token/utente
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ───── On mount: recupera token e profilo utente ─────
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return setIsLoading(false);

        fetchUserProfile(storedToken)
            .then((data) => {
                setUser(data);
                setToken(storedToken);
            })
            .catch(() => logout())
            .finally(() => setIsLoading(false));
    }, []);

    // ───── Login ─────
    const login = async (email: string, password: string) => {
        try {
            const data = await loginUser(email, password);
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("token", data.token);
            return true;
        } catch (err) {
            console.error("Errore login:", err);
            return false;
        }
    };

    // ───── Logout ─────
    const logout = async () => {
        if (token) {
            await logoutUser(token);
        }
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    // ───── Ritorna il context provider ─────
    return <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};

// 3. Hook personalizzato per usare il context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve essere usato dentro <AuthProvider>");
    }
    return context;
};
