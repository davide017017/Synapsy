// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions, type SessionStrategy } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import type { JWT } from "next-auth/jwt";
import type { Session, DefaultUser } from "next-auth";

/* ╔══════════════════════════════════════════════════════╗
 * ║  Config & guard (env)                                ║
 * ╚══════════════════════════════════════════════════════╝ */
if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL non definita in .env.local");
}
const API = process.env.NEXT_PUBLIC_API_URL;

/* ╔══════════════════════════════════════════════════════╗
 * ║  Tipi ampliati (AppUser, Session, JWT)               ║
 * ╚══════════════════════════════════════════════════════╝ */
interface AppUser extends DefaultUser {
    token: string; // accessToken (15 min)
}

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        error?: string;
        user?: AppUser;
    }
    interface User extends AppUser {}
}
declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        accessTokenExpires?: number;
        error?: string;
    }
}

/* ╔══════════════════════════════════════════════════════╗
 * ║  Helper: refresh access-token con cookie Http-Only    ║
 * ╚══════════════════════════════════════════════════════╝ */
async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const res = await fetch(`${API}/refresh`, {
            method: "POST",
            credentials: "include", // ⇒ manda refreshToken
        });
        if (!res.ok) throw new Error("refresh failed");

        const { accessToken } = (await res.json()) as { accessToken: string };
        return {
            ...token,
            accessToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1_000, // +15 min
        };
    } catch {
        return { ...token, error: "RefreshFailed" };
    }
}

/* ╔══════════════════════════════════════════════════════╗
 * ║  NEXTAUTH OPTIONS                                    ║
 * ╚══════════════════════════════════════════════════════╝ */
export const authOptions: NextAuthOptions = {
    /* ───── PROVIDER CREDENTIALS ────────────────────────── */
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(creds) {
                const res = await fetch(`${API}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(creds),
                });
                if (!res.ok) return null; // KO
                return (await res.json()) as AppUser; // { token, user… }
            },
        }),
    ],

    /* ───── SESSION / JWT ───────────────────────────────── */
    session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 60 * 60 * 24 * 30, // cookie 30 gg
        updateAge: 60 * 5, // rinnovo cookie ogni 5 min
    },
    jwt: { maxAge: 60 * 15 }, // access 15 min

    /* ───── CALLBACKS ───────────────────────────────────── */
    callbacks: {
        /** ① ogni (re)generazione JWT */
        async jwt({ token, user }) {
            // primo login
            if (user) {
                return {
                    accessToken: (user as AppUser).token,
                    accessTokenExpires: Date.now() + 15 * 60 * 1_000,
                } as JWT;
            }

            // access ancora valido (>1 min)
            if (token.accessTokenExpires && Date.now() < token.accessTokenExpires - 60_000) {
                return token;
            }

            // access in scadenza → refresh
            return refreshAccessToken(token);
        },

        /** ② sessione consegnata a client / RSC */
        session({ session, token }: { session: Session; token: JWT }) {
            session.accessToken = token.accessToken;
            session.error = token.error;
            return session;
        },
    },

    /* ───── PAGINE CUSTOM ───────────────────────────────── */
    pages: {
        signIn: "/login",
        error: "/login?error=true",
    },

    debug: process.env.NODE_ENV === "development",
};

/* ╔══════════════════════════════════════════════════════╗
 * ║  API Route handler (GET / POST)                      ║
 * ╚══════════════════════════════════════════════════════╝ */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
