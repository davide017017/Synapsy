const BASE_URL = "http://192.168.0.111:8484/api/v1";

/**
 * Effettua il login e restituisce { user, token }
 */
export async function loginUser(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login fallito");
    return await res.json();
}

/**
 * Recupera il profilo utente con il token
 */
export async function fetchUserProfile(token: string) {
    const res = await fetch(`${BASE_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) throw new Error("Token non valido");
    return await res.json();
}

/**
 * Effettua il logout lato backend (opzionale)
 */
export async function logoutUser(token: string): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        return res.ok;
    } catch (error) {
        console.error("Errore durante il logout:", error);
        return false;
    }
}

/**
 * Registra un nuovo utente (se previsto dal backend)
 */
export async function registerUser(name: string, email: string, password: string) {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) throw new Error("Registrazione fallita");
    return await res.json();
}
