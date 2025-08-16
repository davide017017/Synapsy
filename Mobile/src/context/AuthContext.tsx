import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import api, { setAuthToken, registerInterceptor } from "../lib/api";
import { API_PREFIX } from "../lib/apiPrefix";
import { User } from "../types";

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
        setToken(null);
        setUser(null);
        setAuthToken(null);
        SecureStore.deleteItemAsync("token");
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        const { data } = await api.post(`${API_PREFIX}/login`, { email, password });
        const accessToken = data.token;
        setToken(accessToken);
        setAuthToken(accessToken);
        await SecureStore.setItemAsync("token", accessToken);
        const me = await api.get(`${API_PREFIX}/me`);
        setUser(me.data);
        setLoading(false);
    };

    const restore = async () => {
        const saved = await SecureStore.getItemAsync("token");
        if (saved) {
            setAuthToken(saved);
            setToken(saved);
            try {
                const me = await api.get(`${API_PREFIX}/me`);
                setUser(me.data);
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
