// ╔══════════════════════════════════════════════════════════╗
// ║ crud.spec.ts — Smoke CRUD via rete (mock backend)       ║
// ║  • NO UI: pagina fittizia /__noop                       ║
// ║  • Mock REST in-memory per /api/v1/* + /__dbg/db        ║
// ║  • Test separati: categorie | transazioni | ricorrenze | profilo
// ╚══════════════════════════════════════════════════════════╝

import { test, expect, Page, Route } from "@playwright/test";

// ─────────────────────────────────────────────────────────
// Config / Helpers base
// ─────────────────────────────────────────────────────────
const ORIGIN = "http://localhost";
const DEBUG = process.env.PW_DEBUG_CRUD === "1";

const esc = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
// RegExp “port-aware”: ^https?://host(:port)?<pattern>
const re = (pathPattern: string, flags?: string) => {
    const u = new URL(ORIGIN);
    const host = esc(u.hostname);
    const base = `^https?:\\/\\/${host}(?::\\d+)?`;
    return new RegExp(`${base}${pathPattern}`, flags ?? "");
};

const pathOf = (url: string) => new URL(url, ORIGIN).pathname;

// ─────────────────────────────────────────────────────────
// Helper fetch + asserzione
// ─────────────────────────────────────────────────────────
async function api(page: Page, path: string, init?: RequestInit & { json?: any }) {
    const label = `${(init?.method || "GET").padEnd(6)} ${path}`;
    const res = await page.evaluate(
        async (p) => {
            const { path, init } = p as { path: string; init?: any };
            const wantsBody = !!(init?.json || init?.body);
            const headers = {
                Accept: "application/json",
                ...(wantsBody ? { "Content-Type": "application/json" } : {}),
                ...(init?.headers || {}),
            };
            const body = init?.json ? JSON.stringify(init.json) : init?.body;
            const r = await fetch(path, { method: init?.method || "GET", headers, body });
            const text = await r.text();
            let data: any = null;
            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                data = text;
            }
            return { ok: r.ok, status: r.status, data };
        },
        { path, init }
    );
    if (DEBUG) console.log(`[API] ${label} -> ${res.status} ok=${res.ok}`, res.data);
    return res;
}

function expectOk(res: { ok: boolean; status: number; data: any }, label: string) {
    if (!res.ok) console.error("[API FAIL]", label, "status:", res.status, "data:", res.data);
    expect(res.ok, `${label} failed with ${res.status} — ${JSON.stringify(res.data)}`).toBe(true);
}

// ─────────────────────────────────────────────────────────
// Waiters (leggono /__dbg/db)
// ─────────────────────────────────────────────────────────
async function waitTxPresent(page: Page, id: number, desc?: string, timeout = 10_000) {
    await page.waitForFunction(
        async ({ id, desc }) => {
            const r = await fetch("/__dbg/db");
            const db = await r.json();
            const t = (db.transactions || []).find((x: any) => x.id === id);
            return !!t && (desc ? t.description === desc : true);
        },
        { id, desc },
        { timeout }
    );
}
async function waitTxAmount(page: Page, id: number, amount: number, timeout = 10_000) {
    await page.waitForFunction(
        async ({ id, amount }) => {
            const r = await fetch("/__dbg/db");
            const db = await r.json();
            const t = (db.transactions || []).find((x: any) => x.id === id);
            return !!t && Number(t.amount) === Number(amount);
        },
        { id, amount },
        { timeout }
    );
}
async function waitTxAbsent(page: Page, id: number, timeout = 10_000) {
    await page.waitForFunction(
        async ({ id }) => {
            const r = await fetch("/__dbg/db");
            const db = await r.json();
            return Array.isArray(db.transactions) && !db.transactions.some((x: any) => x.id === id);
        },
        { id },
        { timeout }
    );
}
async function waitRecurringUpdated(page: Page, id: number, amount: number, isActive: boolean, timeout = 10_000) {
    await page.waitForFunction(
        async ({ id, amount, isActive }) => {
            const r = await fetch("/__dbg/db");
            const db = await r.json();
            const rc = (db.recurring || []).find((x: any) => x.id === id);
            return !!rc && Number(rc.amount) === Number(amount) && rc.is_active === isActive;
        },
        { id, amount, isActive },
        { timeout }
    );
}
async function waitRecurringAbsent(page: Page, id: number, timeout = 10_000) {
    await page.waitForFunction(
        async ({ id }) => {
            const r = await fetch("/__dbg/db");
            const db = await r.json();
            return !db.recurring.some((x: any) => x.id === id);
        },
        { id },
        { timeout }
    );
}
async function waitProfile(page: Page, fields: Record<string, any>, timeout = 10_000) {
    await page.waitForFunction(
        async ({ fields }) => {
            const r = await fetch("/__dbg/db");
            const db = await r.json();
            return Object.entries(fields).every(([k, v]) => db.profile?.[k] === v);
        },
        { fields },
        { timeout }
    );
}

// ─────────────────────────────────────────────────────────
// beforeEach: mock backend in-memory + pagina /__noop
// ─────────────────────────────────────────────────────────
test.beforeEach(async ({ page }) => {
    if (DEBUG) console.log("[BOOT] crud.spec.ts beforeEach attivo");
    page.on("console", (msg) => {
        if (DEBUG) console.log(`[PAGE:${msg.type()}]`, msg.text());
    });

    // DB in-memory del test
    const db = {
        profile: {
            name: "Test",
            surname: "User",
            username: "test",
            email: "test@example.com",
            theme: "dark",
            avatar: "/images/avatars/avatar_01_boy.webp",
            pending_email: null,
        },
        categories: [
            { id: 1, name: "Stipendio", type: "entrata", color: "#22c55e" },
            { id: 2, name: "Spesa Casa", type: "spesa", color: "#ef4444" },
        ],
        transactions: [] as Array<{
            id: number;
            description: string;
            amount: number;
            date: string;
            type: "entrata" | "spesa";
            category_id?: number;
            notes?: string;
            category?: { id: number; name: string; type: "entrata" | "spesa"; color?: string };
        }>,
        recurring: [] as Array<{
            id: number;
            description: string;
            amount: number;
            frequency: "daily" | "weekly" | "monthly" | "annually";
            interval: number;
            start_date: string;
            is_active: boolean;
            category_id?: number;
            type?: "entrata" | "spesa";
            notes?: string;
        }>,
        idCounter: 1000,
    };
    const nextId = () => ++db.idCounter;
    const categoryOf = (id?: number) => db.categories.find((c) => c.id === id) || undefined;

    // 0) Pagina fittizia
    await page.route(re("/__noop$"), (route) =>
        route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><html><body>noop</body></html>" })
    );

    // 1) Debug DB
    await page.route(re("/__dbg/db(?:\\?.*)?$"), (route) =>
        route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                profile: db.profile,
                categories: db.categories,
                transactions: db.transactions.map((t) => ({ ...t, category: categoryOf(t.category_id) })),
                recurring: db.recurring,
            }),
        })
    );

    // 2) Categories CRUD
    await page.route(re("/api/v1/categories(?:/(\\d+))?(?:\\?.*)?$"), async (route, req) => {
        const method = req.method();
        const urlPath = pathOf(req.url());
        const idMatch = urlPath.match(/\/api\/v1\/categories\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        if (DEBUG) console.log("[ROUTE categories]", method, urlPath);

        if (method === "GET" && !id) {
            return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(db.categories) });
        }
        if (method === "POST" && !id) {
            const body = (await req.postDataJSON()) ?? {};
            const cat = { id: nextId(), ...body };
            db.categories.push(cat);
            return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(cat) });
        }
        if (id && method === "GET") {
            const cat = db.categories.find((c) => c.id === id);
            return route.fulfill({
                status: cat ? 200 : 404,
                contentType: "application/json",
                body: cat ? JSON.stringify(cat) : JSON.stringify({ error: "Not found" }),
            });
        }
        if (id && method === "PUT") {
            const body = (await req.postDataJSON()) ?? {};
            const idx = db.categories.findIndex((c) => c.id === id);
            if (idx === -1) return route.fulfill({ status: 404 });
            db.categories[idx] = { ...db.categories[idx], ...body };
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(db.categories[idx]),
            });
        }
        if (id && method === "DELETE") {
            const before = db.categories.length;
            db.categories = db.categories.filter((c) => c.id !== id);
            return route.fulfill({ status: before === db.categories.length ? 404 : 204, body: "" });
        }
        return route.fulfill({ status: 405 });
    });

    // 3) FinancialOverview GET
    const handleOverview = async (route: Route, req: any) => {
        if (DEBUG) console.log("[ROUTE overview]", req.method(), pathOf(req.url()));
        const enriched = db.transactions.map((t) => ({ ...t, category: categoryOf(t.category_id) }));
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(enriched) });
    };
    await page.route(re("/api/v1/financialOverview(?:\\?.*)?$", "i"), handleOverview);

    // 4) Entrate CRUD
    await page.route(re("/api/v1/entrate(?:/(\\d+))?(?:\\?.*)?$"), async (route, req) => {
        const method = req.method();
        const urlPath = pathOf(req.url());
        const idMatch = urlPath.match(/\/api\/v1\/entrate\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        if (DEBUG) console.log("[ROUTE entrate]", method, urlPath);

        if (method === "POST" && !id) {
            const body = (await req.postDataJSON()) ?? {};
            const tx = {
                id: nextId(),
                description: body.description,
                amount: Number(body.amount) || 0,
                date: body.date,
                type: "entrata" as const,
                category_id: body.category_id,
                notes: body.notes ?? "",
            };
            db.transactions.push(tx);
            return route.fulfill({
                status: 201,
                contentType: "application/json",
                body: JSON.stringify({ ...tx, category: categoryOf(tx.category_id) }),
            });
        }
        if (id && method === "PUT") {
            const body = (await req.postDataJSON()) ?? {};
            const idx = db.transactions.findIndex((t) => t.id === id);
            if (idx === -1) return route.fulfill({ status: 404 });
            db.transactions[idx] = { ...db.transactions[idx], ...body, type: "entrata" as const };
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    ...db.transactions[idx],
                    category: categoryOf(db.transactions[idx].category_id),
                }),
            });
        }
        if (id && method === "DELETE") {
            const before = db.transactions.length;
            db.transactions = db.transactions.filter((t) => t.id !== id);
            return route.fulfill({ status: before === db.transactions.length ? 404 : 204, body: "" });
        }
        return route.fulfill({ status: 405 });
    });

    // 5) Spese CRUD
    await page.route(re("/api/v1/spese(?:/(\\d+))?(?:\\?.*)?$"), async (route, req) => {
        const method = req.method();
        const urlPath = pathOf(req.url());
        const idMatch = urlPath.match(/\/api\/v1\/spese\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        if (DEBUG) console.log("[ROUTE spese]", method, urlPath);

        if (method === "POST" && !id) {
            const body = (await req.postDataJSON()) ?? {};
            const tx = {
                id: nextId(),
                description: body.description,
                amount: Number(body.amount) || 0,
                date: body.date,
                type: "spesa" as const,
                category_id: body.category_id,
                notes: body.notes ?? "",
            };
            db.transactions.push(tx);
            return route.fulfill({
                status: 201,
                contentType: "application/json",
                body: JSON.stringify({ ...tx, category: categoryOf(tx.category_id) }),
            });
        }
        if (id && method === "PUT") {
            const body = (await req.postDataJSON()) ?? {};
            const idx = db.transactions.findIndex((t) => t.id === id);
            if (idx === -1) return route.fulfill({ status: 404 });
            db.transactions[idx] = { ...db.transactions[idx], ...body, type: "spesa" as const };
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    ...db.transactions[idx],
                    category: categoryOf(db.transactions[idx].category_id),
                }),
            });
        }
        if (id && method === "DELETE") {
            const before = db.transactions.length;
            db.transactions = db.transactions.filter((t) => t.id !== id);
            return route.fulfill({ status: before === db.transactions.length ? 404 : 204, body: "" });
        }
        return route.fulfill({ status: 405 });
    });

    // 6) Ricorrenze CRUD
    await page.route(re("/api/v1/recurring(?:/(\\d+))?(?:\\?.*)?$"), async (route, req) => {
        const method = req.method();
        const urlPath = pathOf(req.url());
        const idMatch = urlPath.match(/\/api\/v1\/recurring\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        if (DEBUG) console.log("[ROUTE recurring]", method, urlPath);

        if (method === "GET" && !id) {
            return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(db.recurring) });
        }
        if (method === "POST" && !id) {
            const body = (await req.postDataJSON()) ?? {};
            const rc = { id: nextId(), ...body };
            db.recurring.push(rc);
            return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(rc) });
        }
        if (id && method === "PUT") {
            const body = (await req.postDataJSON()) ?? {};
            const idx = db.recurring.findIndex((r) => r.id === id);
            if (idx === -1) return route.fulfill({ status: 404 });
            db.recurring[idx] = { ...db.recurring[idx], ...body };
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(db.recurring[idx]),
            });
        }
        if (id && method === "DELETE") {
            const before = db.recurring.length;
            db.recurring = db.recurring.filter((r) => r.id !== id);
            return route.fulfill({ status: before === db.recurring.length ? 404 : 204, body: "" });
        }
        return route.fulfill({ status: 405 });
    });

    // 7) PROFILO GET/PUT
    await page.route(re("/api/v1/profile(?:\\?.*)?$"), async (route, req) => {
        const method = req.method();
        const urlPath = pathOf(req.url());
        if (DEBUG) console.log("[ROUTE profile]", method, urlPath);

        if (method === "GET") {
            return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(db.profile) });
        }
        if (method === "PUT") {
            const body = (await req.postDataJSON()) ?? {};
            db.profile = { ...db.profile, ...body };
            if (DEBUG) console.log("[MOCK update profile]", db.profile);
            return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(db.profile) });
        }
        return route.fulfill({ status: 405 });
    });

    // 8) Catch-all diagnostico: fallback (NON risponde)
    await page.route(re("/api/v1/.*"), async (route, req) => {
        if (DEBUG) console.warn("[CATCH-ALL fallback]", req.method(), pathOf(req.url()));
        await route.fallback();
    });
});

// ╔══════════════════════════════════════════════════════════╗
// ║ Test 1/4 — Categorie                                    ║
// ╚══════════════════════════════════════════════════════════╝
test("CRUD categorie", async ({ page }) => {
    await page.goto(`${ORIGIN}/__noop`, { waitUntil: "domcontentloaded" });

    let r = await api(page, "/api/v1/categories");
    expectOk(r, "GET /categories");

    r = await api(page, "/api/v1/categories", {
        method: "POST",
        json: { name: "Abbonamenti", type: "spesa", color: "#f97316" },
    });
    expect(r.status).toBe(201);
    const newCategoryId: number = r.data?.id;

    r = await api(page, `/api/v1/categories/${newCategoryId}`, {
        method: "PUT",
        json: { name: "Abbonamenti Mensili" },
    });
    expectOk(r, "PUT /categories/:id");
    expect(r.data?.name).toBe("Abbonamenti Mensili");

    r = await api(page, `/api/v1/categories/${newCategoryId}`, { method: "DELETE" });
    expect([204, 200]).toContain(r.status);
});

// ╔══════════════════════════════════════════════════════════╗
// ║ Test 2/4 — Transazioni (entrate/spese)                  ║
// ╚══════════════════════════════════════════════════════════╝
test("CRUD transazioni (entrate/spese)", async ({ page }) => {
    await page.goto(`${ORIGIN}/__noop`, { waitUntil: "domcontentloaded" });

    // ── CREA: SPAESA ─────────────────────────────────────────
    let r = await api(page, "/api/v1/spese", {
        method: "POST",
        json: { description: "Bollette", amount: 120.5, date: "2025-08-01", type: "spesa", category_id: 2 },
    });
    expect(r.status).toBe(201);
    const spesaId: number = r.data?.id;

    // ── CREA: ENTRATA ────────────────────────────────────────
    r = await api(page, "/api/v1/entrate", {
        method: "POST",
        json: { description: "Stipendio Agosto", amount: 2100, date: "2025-08-02", type: "entrata", category_id: 1 },
    });
    expect(r.status).toBe(201);
    const entrataId: number = r.data?.id;

    // ── WAIT: presenti entrambe ──────────────────────────────
    await waitTxPresent(page, spesaId, "Bollette");
    await waitTxPresent(page, entrataId, "Stipendio Agosto");

    // ── UPDATE: ENTRATA (descrizione + importo) ──────────────
    r = await api(page, `/api/v1/entrate/${entrataId}`, {
        method: "PUT",
        json: { description: "Stipendio Agosto (bonus)", amount: 2200 },
    });
    expectOk(r, "PUT /entrate/:id");
    await waitTxPresent(page, entrataId, "Stipendio Agosto (bonus)");
    await waitTxAmount(page, entrataId, 2200);

    // ── UPDATE: SPESA (descrizione + importo) ────────────────
    r = await api(page, `/api/v1/spese/${spesaId}`, {
        method: "PUT",
        json: { description: "Bollette Luce", amount: 99.9 },
    });
    expectOk(r, "PUT /spese/:id");
    await waitTxPresent(page, spesaId, "Bollette Luce");
    await waitTxAmount(page, spesaId, 99.9);

    // ── DELETE: ENTRATA ──────────────────────────────────────
    r = await api(page, `/api/v1/entrate/${entrataId}`, { method: "DELETE" });
    expect([204, 200]).toContain(r.status);
    await waitTxAbsent(page, entrataId);

    // ── DELETE: SPESA ────────────────────────────────────────
    r = await api(page, `/api/v1/spese/${spesaId}`, { method: "DELETE" });
    expect([204, 200]).toContain(r.status);
    await waitTxAbsent(page, spesaId);
});

// ╔══════════════════════════════════════════════════════════╗
// ║ Test 3/4 — Ricorrenze                                   ║
// ╚══════════════════════════════════════════════════════════╝
test("CRUD ricorrenze", async ({ page }) => {
    await page.goto(`${ORIGIN}/__noop`, { waitUntil: "domcontentloaded" });

    let r = await api(page, "/api/v1/recurring");
    expectOk(r, "GET /recurring");

    r = await api(page, "/api/v1/recurring", {
        method: "POST",
        json: {
            description: "Netflix",
            amount: 12.99,
            frequency: "monthly",
            interval: 1,
            start_date: "2025-08-05",
            is_active: true,
            type: "spesa",
            category_id: 2,
        },
    });
    expect(r.status).toBe(201);
    const recId: number = r.data?.id;

    r = await api(page, `/api/v1/recurring/${recId}`, { method: "PUT", json: { amount: 13.99, is_active: false } });
    expectOk(r, "PUT /recurring/:id");
    await waitRecurringUpdated(page, recId, 13.99, false);

    r = await api(page, `/api/v1/recurring/${recId}`, { method: "DELETE" });
    expect([204, 200]).toContain(r.status);
    await waitRecurringAbsent(page, recId);
});

// ╔══════════════════════════════════════════════════════════╗
// ║ Test 4/4 — Profilo                                      ║
// ╚══════════════════════════════════════════════════════════╝
test("CRUD profilo", async ({ page }) => {
    await page.goto(`${ORIGIN}/__noop`, { waitUntil: "domcontentloaded" });

    let r = await api(page, "/api/v1/profile");
    expectOk(r, "GET /profile");
    expect(r.data?.theme).toBeDefined();

    const put = await api(page, "/api/v1/profile", { method: "PUT", json: { theme: "light", username: "tester" } });
    expectOk(put, "PUT /profile");
    await waitProfile(page, { theme: "light", username: "tester" });
});

// ─────────────────────────────────────────────────────────
// Descrizione file
// ─────────────────────────────────────────────────────────
// Smoke-test rete con backend mock in-memory e pagina /__noop.
// Test separati per:
// 1) Categorie — CRUD completo
// 2) Transazioni — crea entrata/spesa, update entrata, delete spesa
// 3) Ricorrenze — lista, crea, update, delete
// 4) Profilo — GET+PUT e verifica nel DB di test
// RegExp port-aware, catch-all in fallback, DEBUG via PW_DEBUG_CRUD=1.
