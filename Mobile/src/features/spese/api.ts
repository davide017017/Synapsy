// ──────────────────────────────────────────────────
// Service spese
// ──────────────────────────────────────────────────
import { api } from "@/lib/api";
import { asList } from "@/lib/shape";

export async function listSpese(page = 1, perPage = 20) {
    return api
        .get('/spese', { params: { page, per_page: perPage } })
        .then((r) => asList(r.data));
}
