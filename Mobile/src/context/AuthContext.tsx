import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { setAuthToken, registerInterceptor } from "@/lib/api";
import { login as loginApi, logout as logoutApi, me as meApi } from "@/features/auth/api";
import { User } from "@/types";

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    login: async () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        logoutApi().catch(() => {});
        setToken(null);
        setUser(null);
        setAuthToken(null);
        SecureStore.deleteItemAsync("token");
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        const data = await loginApi(email, password);
        const accessToken = data.token;
        setToken(accessToken);
        setAuthToken(accessToken);
        await SecureStore.setItemAsync("token", accessToken);
        const me = await meApi();
        setUser(me);
        setLoading(false);
    };

    const restore = async () => {
        const saved = await SecureStore.getItemAsync("token");
        if (saved) {
            setAuthToken(saved);
            setToken(saved);
            try {
                const me = await meApi();
                setUser(me);
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        registerInterceptor(logout);
        restore();
    }, []);

    return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
