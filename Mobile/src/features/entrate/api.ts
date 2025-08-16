// ──────────────────────────────────────────────────
// Service entrate
// ──────────────────────────────────────────────────
import api from "@/lib/api";
import { API_PREFIX } from "@/lib/apiPrefix";
import { asList } from "@/lib/shape";

export async function listEntrate(page = 1, perPage = 20) {
    return api
        .get(`${API_PREFIX}/entrate`, { params: { page, per_page: perPage } })
        .then((r) => asList(r.data));
}
