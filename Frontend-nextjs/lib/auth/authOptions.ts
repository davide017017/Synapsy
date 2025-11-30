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
                const payload = {
                    email: credentials?.email,
                    password: credentials?.password,
                };

                console.log("LOGIN URL", url("login"));
                console.log("LOGIN PAYLOAD", payload);

                const res = await fetch(url("login"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json", // 👈 AGGIUNTO
                    },
                    body: JSON.stringify(payload),
                });

                console.log("LOGIN STATUS", res.status);

                let data: any = null;
                try {
                    data = await res.json();
                } catch (e) {
                    console.error("LOGIN JSON PARSE ERROR", e);
                }

                console.log("LOGIN DATA", data);

                if (!res.ok) {
                    console.error("LOGIN FAILED (status not ok)");
                    return null;
                }

                // compat largo: token + user
                const token = data?.token ?? data?.access_token ?? data?.data?.token ?? data?.data?.access_token;

                const user = data?.user ?? data?.data?.user ?? data?.data ?? null;

                if (!token || !user) {
                    console.error("LOGIN FAILED (missing token or user)");
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
