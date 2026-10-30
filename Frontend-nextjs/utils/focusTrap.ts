import type { KeyboardEvent } from "react";

const FOCUSABLE = "a[href], button:not([disabled]), [role='menuitem']:not([aria-disabled='true'])";

// Tab / Shift+Tab ciclano dentro `container` (da chiamare in onKeyDown)
export function trapTab(e: KeyboardEvent, container: HTMLElement | null) {
    if (e.key !== "Tab" || !container) return;
    const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}
