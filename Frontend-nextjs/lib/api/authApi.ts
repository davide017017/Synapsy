/* ╔══════════════════════════════════════════════════════╗
 * ║  Config & guard (env)                                ║
 * ╚══════════════════════════════════════════════════════╝ */
if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL non definita in .env.local");
}
const API = process.env.NEXT_PUBLIC_API_URL as string;

/* ╔══════════════════════════════════════════════════════╗
 * ║  Auth API helper                                     ║
 * ╚══════════════════════════════════════════════════════╝ */

/* ────────────── LOGIN  (usato in Credentials.authorize) ────────────── */
export async function loginUser(email: string, password: string) {
    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login fallito");
    return res.json(); // { accessToken, user }
}

/* ────────────── LOGOUT (revoca access/refresh token) ──────────────── */
export async function logoutUser(accessToken: string) {
    try {
        const res = await fetch(`${API}/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
        });
        return res.ok;
    } catch (err) {
        console.error("Errore logout:", err);
        return false;
    }
}

/* ────────────── REGISTER (schermata di registrazione) ─────────────── */
export async function registerUser(name: string, email: string, password: string) {
    const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) throw new Error("Registrazione fallita");
    return res.json();
}
