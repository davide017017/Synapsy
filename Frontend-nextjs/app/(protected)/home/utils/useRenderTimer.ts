// utils/useRenderTimer.ts
import { useRef, useEffect } from "react";

/**
 * Hook che logga il tempo di render del componente
 * @param name Nome del componente da mostrare nel log
 */
export function useRenderTimer(name: string) {
    const start = useRef(performance.now());
    useEffect(() => {
        const end = performance.now();
        // Mostra solo se il render dura più di 5ms (personalizza come vuoi)
        const duration = end - start.current;
        if (duration > 5) {
            // Log visibile, puoi colorare per differenziare
            console.log(`%c[RenderTimer] ${name}: ${duration.toFixed(2)}ms`, "color:orange;");
        }
    }, []);
}
