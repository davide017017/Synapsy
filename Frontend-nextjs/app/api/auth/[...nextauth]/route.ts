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
// Tipi estesi: accessToken in Session/JWT
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// Handler GET/POST
// ─────────────────────────────────────────────────────────
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// ─────────────────────────────────────────────────────────
// Descrizione file:
// Route NextAuth su App Router; forza runtime Node, espone
// handler GET/POST e aggiunge tipi per accessToken.
// ─────────────────────────────────────────────────────────
