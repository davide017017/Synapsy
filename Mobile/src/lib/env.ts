// Mobile/src/lib/env.ts
import Constants from "expo-constants";

type Env = { APP_ENV: string; API_BASE_URL: string; TOKEN_HEADER: string };

export const getEnv = (): Env => {
    const extra = (Constants?.expoConfig?.extra ?? {}) as Record<string, string>;
    const APP_ENV = extra.APP_ENV || "development";
    const API_BASE_URL = extra.API_BASE_URL;
    const TOKEN_HEADER = extra.TOKEN_HEADER || "Authorization";

    if (!API_BASE_URL) throw new Error("API_BASE_URL non configurato");
    return { APP_ENV, API_BASE_URL, TOKEN_HEADER };
};
