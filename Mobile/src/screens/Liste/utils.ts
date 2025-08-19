// src/screens/Liste/utils.ts
// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers per schermate Liste
// ─────────────────────────────────────────────────────────────────────────────

export function eur(n: number): string {
    try {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
    } catch {
        return `€ ${( +n || 0).toFixed(2)}`;
    }
}

export function fmtDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString('it-IT');
    } catch {
        return iso;
    }
}

function hexToRgb(hex?: string): { r: number; g: number; b: number } | null {
    if (!hex) return null;
    const h = hex.replace('#', '').trim();
    const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const int = parseInt(n, 16);
    if (Number.isNaN(int) || n.length !== 6) return null;
    return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function tintFromHex(hex?: string, alpha = 0.15, fallback = 'rgba(255,255,255,0.06)') {
    const rgb = hexToRgb(hex);
    return rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})` : fallback;
}

