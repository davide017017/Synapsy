// ╔══════════════════════════════════════════════════════╗
// ║              NextAuth Configuration                ║
// ╚══════════════════════════════════════════════════════╝
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// ────────────── API URL da env ──────────────
if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL non definita");
}
const API = process.env.NEXT_PUBLIC_API_URL;

// ╔══════════════════════════════════════════════════════╗
// ║        Estensione tipi per accessToken              ║
// ╚══════════════════════════════════════════════════════╝
declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
    }
}

// ╔══════════════════════════════════════════════════════╗
// ║              Opzioni NextAuth                       ║
// ╚══════════════════════════════════════════════════════╝
export const authOptions: NextAuthOptions = {
    // ───── Provider: Credentials (Bearer JWT) ─────
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch(`${API}/v1/login`, {
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
                };
            },
        }),
    ],

    // ───── Session & JWT settings ─────
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 giorni
    },
    jwt: {
        maxAge: 15 * 60, // 15 minuti
    },

    // ───── Callbacks: Propaga accessToken ─────
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

    // ───── Custom pages ─────
    pages: {
        signIn: "/login",
        error: "/login?error=true",
    },

    // ───── Debug mode solo in sviluppo ─────
    debug: process.env.NODE_ENV === "development",
};

// ╔══════════════════════════════════════════════════════╗
// ║        Handler NextAuth GET/POST                    ║
// ╚══════════════════════════════════════════════════════╝
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
