// ──────────────────────────────────────────────────
// Service categories
// ──────────────────────────────────────────────────
import { api } from "@/lib/api";
import { asList } from "@/lib/shape";

export async function listCategories(page = 1, perPage = 20) {
    return api
        .get('/categories', { params: { page, per_page: perPage } })
        .then((r) => asList(r.data));
}
