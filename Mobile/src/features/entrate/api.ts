// ──────────────────────────────────────────────────
// Service entrate
// ──────────────────────────────────────────────────
import { api } from "@/lib/api";
import { asList } from "@/lib/shape";

export async function listEntrate(page = 1, perPage = 20) {
    return api
        .get('/entrate', { params: { page, per_page: perPage } })
        .then((r) => asList(r.data));
}
