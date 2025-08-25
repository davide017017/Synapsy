import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/session", (route) =>
        route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                user: { name: "Test", email: "test@example.com" },
                accessToken: "test-token",
                expires: "2099-01-01T00:00:00Z",
            }),
        }),
    );
    await page.route("**/api/v1/profile", (route) =>
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
        }),
    );
    await page.route("**/api/v1/**", (route) =>
        route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
});

test("navigazione sidebar", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Panoramica");
    await expect(page.getByRole("heading", { name: /Riepilogo con Calendario/i })).toBeVisible();
    await page.click("text=Transazioni");
    await expect(page.getByRole("heading", { name: /Transazioni/i })).toBeVisible();
    await page.click("text=Profilo");
    await expect(page.getByRole("heading", { name: /Profilo/i })).toBeVisible();
});

test("avatar header link", async ({ page }) => {
    await page.goto("/");
    await page.getByTitle("Vai al profilo").click();
    await expect(page.getByRole("heading", { name: /Profilo/i })).toBeVisible();
});
