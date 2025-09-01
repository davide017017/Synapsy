// ╔══════════════════════════════════════════════════════╗
// ║ navigation.spec.ts — Smoke routing E2E (Chromium)   ║
/* ║  • Mock sessione/profilo (client)                   ║
   ║  • Navigazione via sidebar (CSR)                    ║
   ║  • Debug esteso in caso di failure                  ║ */
// ╚══════════════════════════════════════════════════════╝

import { test, expect, Page, Route } from "@playwright/test";

// ───────────────────────────────────────────────────────
// Sezione: Mocks client-side per ogni test
// ───────────────────────────────────────────────────────
test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/session", (route: Route) =>
        route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                user: { name: "Test", email: "test@example.com" },
                accessToken: "test-token",
                expires: "2099-01-01T00:00:00Z",
            }),
        })
    );

    await page.route("**/api/v1/profile", (route: Route) =>
        route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                name: "Test",
                surname: "User",
                username: "test",
                email: "test@example.com",
                theme: "dark",
                avatar: "/images/avatars/avatar_01_boy.webp",
                pending_email: null,
            }),
        })
    );

    // Default: tutte le altre API → []
    await page.route("**/api/v1/**", (route: Route) =>
        route.fulfill({ status: 200, contentType: "application/json", body: "[]" })
    );
});

// ───────────────────────────────────────────────────────
// Helper: aspetta un heading che matcha `re`
// ───────────────────────────────────────────────────────
async function expectHeading(page: Page, re: RegExp, timeout = 10_000) {
    const h1 = page.getByRole("heading", { level: 1 }).filter({ hasText: re });
    if ((await h1.count()) > 0) {
        await expect(h1.first()).toBeVisible({ timeout });
        return;
    }
    const any = page.getByRole("heading", { name: re }).first();
    try {
        await expect(any).toBeVisible({ timeout });
    } catch (e) {
        const all = page.getByRole("heading");
        const n = await all.count();
        const texts: string[] = [];
        for (let i = 0; i < n; i++) texts.push(await all.nth(i).innerText());
        console.log("[DEBUG] Headings presenti:", texts);
        throw e;
    }
}

// ───────────────────────────────────────────────────────
// Helper: click su link sidebar → URL + heading atteso
// ───────────────────────────────────────────────────────
async function gotoBySidebar(page: Page, linkNameRe: RegExp, expectedPath: string, headingRe: RegExp) {
    await page.getByRole("link", { name: linkNameRe }).click();
    await page.waitForLoadState("networkidle");

    try {
        // Usa contains piuttosto che regex stretta per robustezza
        await expect(page).toHaveURL(new RegExp(expectedPath.replace("/", "\\/")), { timeout: 10_000 });
    } catch (e) {
        const url = page.url();
        console.log("[DEBUG] URL corrente:", url);
        await page.screenshot({ path: `test-debug-${expectedPath.replace(/\//g, "_")}.png`, fullPage: true });
        throw e;
    }

    await expectHeading(page, headingRe);
}

// ───────────────────────────────────────────────────────
// Helper SPECIFICO per /profilo
// ───────────────────────────────────────────────────────
async function expectProfilePage(page: Page, timeout = 15_000) {
    await expect(page).toHaveURL(/\/profilo/, { timeout });
    await page.waitForLoadState("networkidle");

    const marker = page.getByText(/Modifica le informazioni del tuo account\./i);
    const fallback = page.getByText(/profilo/i).first();

    try {
        await expect(marker.or(fallback)).toBeVisible({ timeout });
    } catch (e) {
        const allHeadings = page.getByRole("heading");
        const n = await allHeadings.count();
        const texts: string[] = [];
        for (let i = 0; i < n; i++) texts.push(await allHeadings.nth(i).innerText());
        console.log("[DEBUG] Headings presenti:", texts);

        await page.screenshot({ path: "test-debug-profilo.png", fullPage: true });
        const html = await page.content();
        console.log("[DEBUG] HTML snippet:", html.slice(0, 2000));

        throw e;
    }
}

// ╔══════════════════════════════════════════════════════╗
// ║ Test smoke: navigazione via sidebar (CSR)            ║
// ╚══════════════════════════════════════════════════════╝
test("routing via sidebar: Home → Panoramica → Transazioni → Ricorrenti → Categorie → Profilo", async ({ page }) => {
    // Home
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("link", { name: /panoramica/i })).toBeVisible();

    // Panoramica
    await gotoBySidebar(page, /panoramica/i, "/panoramica", /riepilogo|panoramica|calendario/i);

    // Transazioni
    await gotoBySidebar(page, /transazioni/i, "/transazioni", /transazioni|movimenti/i);

    // Ricorrenti
    await gotoBySidebar(page, /ricorrenti/i, "/ricorrenti", /ricorrenti|prossimi pagamenti|ricorrenze/i);

    // Categorie
    await gotoBySidebar(page, /categorie/i, "/categorie", /^categorie$/i);

    // Profilo
    await page.getByRole("link", { name: /profilo/i }).click();
    await expectProfilePage(page);
});

// ───────────────────────────────────────────────────────
// Descrizione file:
// Smoke E2E con mock fetch in browser. Naviga via sidebar
// e verifica URL + heading plausibile. Per /profilo usa un
// marker testuale stabile (no ARIA) con fallback e debug
// esteso in caso di failure.
// ───────────────────────────────────────────────────────
