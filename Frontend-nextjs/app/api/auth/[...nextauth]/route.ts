// ─────────────────────────────────────────────────────────
// NextAuth Route Handler (App Router) - runtime Node
// ─────────────────────────────────────────────────────────
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

// ─────────────────────────────────────────────────────────
// Evita Edge runtime: alcune lib (crypto, fetch) falliscono
// ─────────────────────────────────────────────────────────
export const runtime = "nodejs";

// ─────────────────────────────────────────────────────────
// Tipi estesi: Session, User, JWT
// ─────────────────────────────────────────────────────────
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        error?: string;
    }
    interface User {
        is_admin?: boolean;
        is_demo?: boolean;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        tokenExpiresAt?: number;
        refreshError?: string;
        isAdmin?: boolean;
        isDemo?: boolean;
    }
}

// ─────────────────────────────────────────────────────────
// Handler GET/POST
// ─────────────────────────────────────────────────────────
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
