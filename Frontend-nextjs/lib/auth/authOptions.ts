// lib/auth/authOptions.ts

import Credentials from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import { type JWT } from "next-auth/jwt";
import { url } from "@/lib/api/endpoints";

// ──────────────────────────────────────────────────────────
// Soglia di refresh: il token backend viene rinnovato se la
// scadenza JWT è a meno di 5 minuti. Il JWT NextAuth ha
// maxAge 15 min, quindi il refresh avviene intorno al min 10.
// ──────────────────────────────────────────────────────────
const TOKEN_REFRESH_THRESHOLD_SECONDS = 5 * 60;

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const res = await fetch(url("refreshToken"), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.accessToken as string}`,
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

        const data = await res.json();
        const newToken = data?.token ?? data?.access_token;

        if (!newToken) throw new Error("Refresh response missing token");

        return {
            ...token,
            accessToken: newToken,
            tokenExpiresAt: Math.floor(Date.now() / 1000) + 15 * 60,
            refreshError: undefined,
        };
    } catch (err) {
        console.error("[NextAuth] refreshAccessToken error:", err);
        return {
            ...token,
            refreshError: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials) {
                const payload = {
                    email: credentials?.email,
                    password: credentials?.password,
                };

                let res: Response;

                try {
                    res = await fetch(url("login"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
                } catch (err) {
                    console.error("LOGIN NETWORK ERROR", err);
                    return null;
                }

                const contentType = res.headers.get("content-type") || "";

                if (!contentType.includes("application/json")) {
                    const raw = await res.text().catch(() => "");
                    console.error("LOGIN NON-JSON RESPONSE", {
                        status: res.status,
                        contentType,
                        preview: raw.slice(0, 1000),
                    });
                    return null;
                }

                let data: any = null;
                try {
                    data = await res.json();
                } catch (e) {
                    console.error("LOGIN JSON PARSE ERROR", e);
                    return null;
                }

                if (!res.ok) {
                    console.error("LOGIN FAILED (status not ok)", data);
                    return null;
                }

                const token =
                    data?.token ??
                    data?.access_token ??
                    data?.data?.token ??
                    data?.data?.access_token;

                const user = data?.user ?? data?.data?.user ?? data?.data ?? null;

                if (!token || !user) {
                    console.error("LOGIN FAILED (missing token or user)", data);
                    return null;
                }

                return {
                    id: user.id?.toString?.() ?? String(user.id),
                    name: user.name ?? undefined,
                    email: user.email ?? undefined,
                    access_token: token,
                    is_admin: user.is_admin ?? false,
                    is_demo: user.is_demo ?? false,
                } as any;
            },
        }),

        // … il secondo provider "token-login" lascialo com'è
        Credentials({
            id: "token-login",
            name: "TokenLogin",
            credentials: { token: { type: "text" } },
            async authorize(credentials) {
                if (!credentials?.token) return null;
                const res = await fetch(url("me"), {
                    headers: { Authorization: `Bearer ${credentials.token}` },
                });
                if (!res.ok) return null;
                const user = await res.json();
                return {
                    id: user.id.toString(),
                    name: user.name ?? undefined,
                    email: user.email ?? undefined,
                    access_token: credentials.token,
                    is_admin: user.is_admin ?? false,
                    is_demo: user.is_demo ?? false,
                } as any;
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 giorni
    },
    jwt: {
        maxAge: 15 * 60, // 15 minuti
    },

    callbacks: {
        async jwt({ token, user }) {
            // Prima autenticazione: salva il token e imposta la scadenza
            if (user) {
                token.accessToken = (user as any).access_token;
                token.tokenExpiresAt = Math.floor(Date.now() / 1000) + 15 * 60;
                token.isAdmin = (user as any).is_admin ?? false;
                token.isDemo = (user as any).is_demo ?? false;
                return token;
            }

            // Rotazioni successive: verifica se il token backend deve essere rinnovato
            const expiresAt = token.tokenExpiresAt as number | undefined;
            const now = Math.floor(Date.now() / 1000);

            if (expiresAt && now >= expiresAt - TOKEN_REFRESH_THRESHOLD_SECONDS) {
                return refreshAccessToken(token);
            }

            return token;
        },

        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            (session.user as any).is_admin = token.isAdmin ?? false;
            (session.user as any).is_demo = token.isDemo ?? false;
            // Espone l'errore di refresh al client (per mostrare un avviso UX)
            if (token.refreshError) {
                (session as any).error = token.refreshError;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login?error=true",
    },
    debug: process.env.NODE_ENV === "development",
};
