// utils/useRenderTimer.ts
// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Hook - Render Timer
// Dettagli: misura il tempo tra render e commit; supporta 'every-render' | 'mount'
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from "react";

type Options = {
    thresholdMs?: number; // soglia log (default 5ms)
    mode?: "every-render" | "mount"; // default: every-render
};

export function useRenderTimer(name: string, options?: Options) {
    const { thresholdMs = 5, mode = "every-render" } = options ?? {};

    // ── refs stabili (no deps in useEffect)
    const startRef = useRef(0);
    const nameRef = useRef(name);
    const thresholdRef = useRef(thresholdMs);
    const didLogRef = useRef(false); // per loggare una sola volta in modalità 'mount'

    // ── snapshot ad ogni render
    startRef.current = performance.now();
    nameRef.current = name;
    thresholdRef.current = thresholdMs;

    // ── effetto dopo il commit (nessuna deps → ogni render)
    useEffect(() => {
        // gate per 'mount': logga solo alla prima esecuzione
        if (mode === "mount" && didLogRef.current) return;

        const duration = performance.now() - startRef.current;
        if (duration >= thresholdRef.current) {
            console.log(`%c[RenderTimer] ${nameRef.current}: ${duration.toFixed(2)}ms`, "color:orange;");
        }

        if (mode === "mount") didLogRef.current = true;
    }); // ← nessuna dependency array: niente warning e funziona per entrambi i mode
}
