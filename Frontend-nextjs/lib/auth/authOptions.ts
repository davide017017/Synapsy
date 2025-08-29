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
                const res = await fetch(url("login"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                });
                if (!res.ok) return null;
                const data = await res.json();
                if (!data.token || !data.user) return null;
                return {
                    id: data.user.id.toString(),
                    name: data.user.name ?? undefined,
                    email: data.user.email ?? undefined,
                    access_token: data.token,
                } as any;
            },
        }),
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
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login?error=true",
    },
    debug: process.env.NODE_ENV === "development",
};
