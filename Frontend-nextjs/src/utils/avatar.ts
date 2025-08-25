import md5 from "./md5";

// ==============================
// Utility: avatar URL resolver
// ==============================
export type AvatarUser = {
    avatarUrl?: string | null;
    avatar?: string | null; // legacy field
    email?: string | null;
    name?: string | null;
    surname?: string | null;
    username?: string | null;
    updated_at?: string | Date | null;
    updatedAt?: string | Date | null;
};

// --------------------------------------------------
// Helper: normalizza path avatar (CDN / local)
// --------------------------------------------------
function resolvePath(path: string): string {
    const cdn = process.env.NEXT_PUBLIC_CDN_URL;
    const normalized = path.replace(/^\/+/, "");

    if (cdn) {
        return `${cdn.replace(/\/+$/, "")}/${normalized}`;
    }
    const localBase = "/images/avatars";
    if (normalized.startsWith("images/avatars")) {
        return `/${normalized}`;
    }
    return `${localBase}/${normalized}`;
}

// --------------------------------------------------
// getAvatarUrl: avatarUrl → gravatar → iniziali SVG
// --------------------------------------------------
export function getAvatarUrl(user: AvatarUser): string {
    const path = user.avatarUrl || user.avatar;
    if (path) {
        const base = resolvePath(path);
        const updated = user.updatedAt || user.updated_at;
        const version = updated ? `?v=${new Date(updated).getTime()}` : "";
        return `${base}${version}`;
    }

    if (user.email) {
        const hash = md5(user.email.trim().toLowerCase());
        return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
    }

    const initials = (
        (user.name?.[0] || "") +
        (user.surname?.[0] || "") ||
        user.username?.slice(0, 2) ||
        "?"
    ).toUpperCase();

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='100%' height='100%' fill='#888'/><text x='50%' y='50%' dominant-baseline='central' text-anchor='middle' fill='#fff' font-size='32' font-family='sans-serif'>${initials}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default getAvatarUrl;
