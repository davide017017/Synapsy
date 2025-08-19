import { StyleSheet } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Palette
// ─────────────────────────────────────────────────────────────────────────────
export const COLORS = {
    bg: '#0b1013',
    card: '#0f1a20',
    border: 'rgba(255,255,255,0.08)',
    text: '#eaf5ee',
    muted: '#9fb0a9',
    green: '#22c55e',
    red: '#ef4444',
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: COLORS.bg },
    landing: { flex: 1, padding: 16, justifyContent: 'center', gap: 20 },
    bigBtn: {
        height: 80,
        borderRadius: 16,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bigBtnText: { color: COLORS.text, fontSize: 18, fontWeight: '700' },

    listWrap: { flex: 1, padding: 12 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
    leadIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowTexts: { flex: 1 },
    rowTitle: { color: COLORS.text, fontWeight: '600' },
    rowMeta: { color: COLORS.muted, fontSize: 12 },
    amountPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        minWidth: 70,
        alignItems: 'center',
    },
    amountText: { fontWeight: '700' },
    editBtn: { padding: 6 },

    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
});

export default styles;

