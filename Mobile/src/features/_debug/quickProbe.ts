// ──────────────────────────────────────────────────
// Probe veloce in DEV
// ──────────────────────────────────────────────────
import { listSpese } from "@/features/spese/api";
import { listEntrate } from "@/features/entrate/api";

export async function quickProbe() {
    if (!__DEV__) return;
    try {
        const [spese, entrate] = await Promise.all([listSpese(1, 50), listEntrate(1, 50)]);
        const merged = [...spese, ...entrate].slice(0, 3);
        console.log("quickProbe", merged);
    } catch (e) {
        console.log("quickProbe error", e);
    }
}
