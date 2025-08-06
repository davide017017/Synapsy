export function getAvatarUrl(path: string): string {
    const cdn = process.env.NEXT_PUBLIC_CDN_URL;
    const normalizedPath = path.replace(/^\/+/, "");

    if (cdn) {
        return `${cdn.replace(/\/+$/, "")}/${normalizedPath}`;
    }

    const localBase = "/images/avatars";
    if (normalizedPath.startsWith("images/avatars")) {
        return `/${normalizedPath}`;
    }
    return `${localBase}/${normalizedPath}`;
}

export default getAvatarUrl;
