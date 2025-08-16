// ──────────────────────────────────────────────────
// Chiamate auth: login/logout/me
// ──────────────────────────────────────────────────
import api from "@/lib/api";
import { API_PREFIX } from "@/lib/apiPrefix";

export async function login(email: string, password: string) {
    return api.post(`${API_PREFIX}/login`, { email, password }).then((r) => r.data);
}

export async function logout() {
    return api.post(`${API_PREFIX}/logout`).then((r) => r.data);
}

export async function me() {
    return api.get(`${API_PREFIX}/me`).then((r) => r.data);
}
