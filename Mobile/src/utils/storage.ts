// ─────────────────────────────────────────────────────────────────────────────
// Storage cross-platform: AsyncStorage (native) / sessionStorage (web)
// ─────────────────────────────────────────────────────────────────────────────
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Safe getter per sessionStorage su web ────────────────────────────────────
const webSS = () => {
    try {
        return typeof window !== "undefined" ? window.sessionStorage : null;
    } catch {
        return null;
    }
};

// ── API unificata ────────────────────────────────────────────────────────────
export const storage = {
    // get ───────────────────────────────────────────────────────────────────────
    get: async (key: string): Promise<string | null> => {
        if (Platform.OS === "web") return webSS()?.getItem(key) ?? null;
        return AsyncStorage.getItem(key);
    },

    // set ───────────────────────────────────────────────────────────────────────
    set: async (key: string, value: string): Promise<void> => {
        if (Platform.OS === "web") {
            webSS()?.setItem(key, value);
            return;
        }
        await AsyncStorage.setItem(key, value);
    },

    // remove ────────────────────────────────────────────────────────────────────
    remove: async (key: string): Promise<void> => {
        if (Platform.OS === "web") {
            webSS()?.removeItem(key);
            return;
        }
        await AsyncStorage.removeItem(key);
    },
};

// ─────────────────────────────────────────────────────────────────────────────
