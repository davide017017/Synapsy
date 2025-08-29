"use client";

/* ╔══════════════════════════════════════════════════════╗
 * ║ resetCaches — helper per azzerare tutte le cache     ║
 * ║ dei provider client (Categories, User, Ricorrenze)   ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Uso tipico (client):
 *   import { resetAllProviderCaches } from "@/context/resetCaches";
 *   // p.es. prima del signOut o dopo fine impersonation
 *   await resetAllProviderCaches();
 */

export async function resetAllProviderCaches(): Promise<void> {
    const [cats, user, rico] = await Promise.all([
        import("./CategoriesContext"),
        import("./UserContext"),
        import("./RicorrenzeContext"),
    ]);

    cats.__resetCategoriesCache?.();
    user.__resetUserCache?.();
    rico.__resetRicorrenzeCache?.();
}

/** Reset mirati (se ti servono singolarmente) */
export async function resetCategoriesCache(): Promise<void> {
    const { __resetCategoriesCache } = await import("./CategoriesContext");
    __resetCategoriesCache?.();
}

export async function resetUserCache(): Promise<void> {
    const { __resetUserCache } = await import("./UserContext");
    __resetUserCache?.();
}

export async function resetRicorrenzeCache(): Promise<void> {
    const { __resetRicorrenzeCache } = await import("./RicorrenzeContext");
    __resetRicorrenzeCache?.();
}
