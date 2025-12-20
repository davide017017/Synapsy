// lib/auth/authOptions.ts

import Credentials from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import { url } from "@/lib/api/endpoints";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials) {
                // ==================================================
                // AUTH DEBUG — rimuovere quando backend è stabile
                // ==================================================
                const DEBUG_AUTH = process.env.NODE_ENV === "development";

                const payload = {
                    email: credentials?.email,
                    password: credentials?.password,
                };

                if (DEBUG_AUTH) {
                    console.log("LOGIN URL", url("login"));
                    console.log("LOGIN PAYLOAD", payload);
                }

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

                if (DEBUG_AUTH) {
                    console.log("LOGIN STATUS", res.status);
                    console.log("LOGIN HEADERS", Object.fromEntries(res.headers.entries()));
                }

                const contentType = res.headers.get("content-type") || "";

                // --------------------------------------------------
                // Se NON è JSON → stampa body raw (HTML / PHP error)
                // --------------------------------------------------
                if (!contentType.includes("application/json")) {
                    const raw = await res.text().catch(() => "");
                    console.error("LOGIN NON-JSON RESPONSE", {
                        status: res.status,
                        contentType,
                        preview: raw.slice(0, 1000),
                    });
                    return null;
                }

                // --------------------------------------------------
                // Parse JSON sicuro
                // --------------------------------------------------
                let data: any = null;
                try {
                    data = await res.json();
                } catch (e) {
                    console.error("LOGIN JSON PARSE ERROR", e);
                    return null;
                }

                if (DEBUG_AUTH) {
                    console.log("LOGIN DATA", data);
                }

                // --------------------------------------------------
                // HTTP error (401 / 422 / 500)
                // --------------------------------------------------
                if (!res.ok) {
                    console.error("LOGIN FAILED (status not ok)", data);
                    return null;
                }

                // --------------------------------------------------
                // Compat: token + user (strutture diverse)
                // --------------------------------------------------
                const token = data?.token ?? data?.access_token ?? data?.data?.token ?? data?.data?.access_token;

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
                } as any;
            },
        }),

        // … il secondo provider "token-login" lascialo com’è
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
                } as any;
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
        maxAge: 15 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).access_token;
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login?error=true",
    },
    debug: process.env.NODE_ENV === "development",
};
