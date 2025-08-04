// ╔══════════════════════════════════════════════════════╗
// ║              NextAuth Configuration                ║
// ╚══════════════════════════════════════════════════════╝
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

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
// ║        Handler NextAuth GET/POST                    ║
// ╚══════════════════════════════════════════════════════╝
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

