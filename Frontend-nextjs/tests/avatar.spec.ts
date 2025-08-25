import { test, expect } from "@playwright/test";
import getAvatarUrl from "../src/utils/avatar";

test("usa avatarUrl se presente", () => {
    const url = getAvatarUrl({ avatarUrl: "/images/avatars/avatar_01_boy.webp" });
    expect(url).toContain("avatar_01_boy.webp");
});

test("fallback a gravatar se manca avatar", () => {
    const url = getAvatarUrl({ email: "example@example.com" });
    expect(url).toContain("gravatar.com/avatar");
});

test("fallback a iniziali se manca tutto", () => {
    const url = getAvatarUrl({ name: "Mario", surname: "Rossi" });
    expect(url.startsWith("data:image/svg+xml")).toBeTruthy();
});
