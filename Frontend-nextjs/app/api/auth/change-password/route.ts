import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/authOptions";
import { url } from "@/lib/api/endpoints";

export const runtime = "nodejs";

export async function PUT(req: Request) {
    // ── Auth guard ──
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
        return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    // ── Parse body ──
    let body: { currentPassword?: string; newPassword?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Body non valido" }, { status: 400 });
    }

    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Campi obbligatori mancanti" }, { status: 400 });
    }

    // ── Server-side validation ──
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
        return NextResponse.json(
            { error: "La nuova password deve avere almeno 8 caratteri, una maiuscola e un numero" },
            { status: 400 },
        );
    }

    // ── Proxy to backend API ──
    const res = await fetch(url("changePassword"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: newPassword,
        }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        return NextResponse.json(
            { error: data?.message || "Errore aggiornamento password" },
            { status: res.status },
        );
    }

    return NextResponse.json({ ok: true });
}
