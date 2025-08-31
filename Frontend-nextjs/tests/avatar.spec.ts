// ╔══════════════════════════════════════════════════════╗
// ║ avatar.spec.ts — unit test per getAvatarUrl          ║
/* ║  • Casi tabellari base                               ║
   ║  • Test di precedenza (avatarUrl > email > iniziali) ║ */
// ╚══════════════════════════════════════════════════════╝

import { test, expect } from "@playwright/test";
import getAvatarUrl from "../src/utils/avatar";

// ───────────────────────────────────────────────────────
// Sezione: casi base (tabellare, ogni test è separato)
// ───────────────────────────────────────────────────────
type Case = {
    name: string;
    input: any;
    assert: (url: string) => void;
};

const cases: Case[] = [
    // ── usa avatarUrl diretto ──
    {
        name: "usa avatarUrl se presente",
        input: { avatarUrl: "/images/avatars/avatar_01_boy.webp" },
        assert: (url) => expect(url).toContain("avatar_01_boy.webp"),
    },
    // ── fallback gravatar ──
    {
        name: "fallback a gravatar se fornita email",
        input: { email: "example@example.com" },
        assert: (url) => expect(url).toContain("gravatar.com/avatar"),
    },
    // ── fallback iniziali SVG ──
    {
        name: "fallback a iniziali se mancano avatar/email",
        input: { name: "Mario", surname: "Rossi" },
        assert: (url) => {
            expect(url.startsWith("data:image/svg+xml")).toBeTruthy();
            // (opzionale) verifica iniziali "MR" nell'SVG se previste dalla funzione:
            expect(decodeURIComponent(url)).toMatch(/M\s*R/);
        },
    },
];

for (const c of cases) {
    test(c.name, () => {
        const url = getAvatarUrl(c.input);
        c.assert(url);
    });
}

// ───────────────────────────────────────────────────────
// Sezione: precedenza (avatarUrl > email > iniziali)
// ───────────────────────────────────────────────────────
test("precedenza: avatarUrl > email > iniziali", () => {
    const both = getAvatarUrl({
        avatarUrl: "/images/avatars/custom.webp",
        email: "example@example.com",
        name: "Mario",
        surname: "Rossi",
    });
    expect(both).toContain("custom.webp"); // vince avatarUrl

    const emailOnly = getAvatarUrl({ email: "example@example.com", name: "Mario" });
    expect(emailOnly).toContain("gravatar.com/avatar"); // poi gravatar

    const initialsOnly = getAvatarUrl({ name: "Mario", surname: "Rossi" });
    expect(initialsOnly.startsWith("data:image/svg+xml")).toBeTruthy(); // infine SVG iniziali
});

// ───────────────────────────────────────────────────────
// Descrizione file:
// Verifica la logica di getAvatarUrl con 3 casi base e un
// test di precedenza:
// 1) preferisce avatarUrl;
// 2) poi gravatar se c'è email;
// 3) altrimenti SVG con iniziali.
// Ogni caso è indipendente e leggibile.
// ───────────────────────────────────────────────────────
