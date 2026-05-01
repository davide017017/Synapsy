import { useEffect } from "react";

const PULL_THRESHOLD = 80;
const INDICATOR_H = 48;

export function usePullToRefresh() {
    useEffect(() => {
        if (!("ontouchstart" in window)) return;

        let startY = 0;
        let currentDelta = 0;
        let active = false;

        const styleTag = document.createElement("style");
        styleTag.textContent = "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
        document.head.appendChild(styleTag);

        const spinner = document.createElement("span");
        Object.assign(spinner.style, {
            display: "inline-block",
            animation: "spin 0.8s linear infinite",
        });
        spinner.textContent = "↻";

        const label = document.createTextNode(" Aggiornamento...");

        const indicator = document.createElement("div");
        Object.assign(indicator.style, {
            position: "fixed",
            top: "calc(env(safe-area-inset-top) + 8px)",
            left: "50%",
            height: `${INDICATOR_H}px`,
            transform: `translateX(-50%) translateY(-${INDICATOR_H}px)`,
            zIndex: "99999",
            background: "#1c1c28",
            color: "#e2e8f0",
            padding: "0 20px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 0 20px rgba(0,255,180,0.3), 0 4px 16px rgba(0,0,0,0.5)",
            willChange: "transform, opacity",
            opacity: "0",
        });
        indicator.appendChild(spinner);
        indicator.appendChild(label);
        document.body.appendChild(indicator);

        // Returns true if any scrollable ancestor (between target and root) is scrolled down
        function hasScrolledAncestor(target: EventTarget | null): boolean {
            let el = target as HTMLElement | null;
            while (el && el !== document.documentElement) {
                const { overflowY } = window.getComputedStyle(el);
                if ((overflowY === "auto" || overflowY === "scroll") && el.scrollTop > 0) return true;
                el = el.parentElement;
            }
            return false;
        }

        function onTouchStart(e: TouchEvent) {
            if (window.scrollY > 0) return;
            if (hasScrolledAncestor(e.target)) return;
            startY = e.touches[0].clientY;
            currentDelta = 0;
            active = true;
        }

        function onTouchMove(e: TouchEvent) {
            if (!active) return;
            if (window.scrollY > 0) {
                active = false;
                retract();
                return;
            }

            const delta = e.touches[0].clientY - startY;
            if (delta <= 0) {
                currentDelta = 0;
                return;
            }

            currentDelta = delta;
            // Resistance curve: indicator fully visible well before threshold
            const pull = Math.min(Math.pow(delta, 0.75) * 2.2, INDICATOR_H);
            indicator.style.transform = `translateX(-50%) translateY(-${INDICATOR_H - pull}px)`;
            indicator.style.opacity = String(Math.min(pull / INDICATOR_H, 1));
        }

        function onTouchEnd() {
            if (!active) return;
            active = false;

            if (currentDelta >= PULL_THRESHOLD) {
                indicator.style.transition = "transform 0.15s ease";
                indicator.style.transform = "translateX(-50%) translateY(0)";
                indicator.style.opacity = "1";
                setTimeout(() => window.location.reload(), 350);
            } else {
                retract();
            }

            startY = 0;
            currentDelta = 0;
        }

        function retract() {
            indicator.style.transition = "transform 0.25s ease, opacity 0.2s ease";
            indicator.style.transform = `translateX(-50%) translateY(-${INDICATOR_H}px)`;
            indicator.style.opacity = "0";
            setTimeout(() => {
                indicator.style.transition = "";
            }, 260);
        }

        document.addEventListener("touchstart", onTouchStart, { passive: true });
        document.addEventListener("touchmove", onTouchMove, { passive: true });
        document.addEventListener("touchend", onTouchEnd, { passive: true });
        document.addEventListener("touchcancel", onTouchEnd, { passive: true });

        return () => {
            document.removeEventListener("touchstart", onTouchStart);
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            document.removeEventListener("touchcancel", onTouchEnd);
            indicator.remove();
            styleTag.remove();
        };
    }, []);
}
