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
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: COLORS.bg, padding: 12 },
    card: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 14,
        gap: 10,
    },

    title: { color: COLORS.text, fontWeight: '800', fontSize: 18 },
    subtitle: { color: COLORS.muted, fontSize: 12 },

    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    categoryBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

    label: { color: COLORS.muted, fontSize: 12, marginTop: 2 },

    input: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.96)',
        color: '#111827',
        fontSize: 14,
    },

    selectBtn: {
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        backgroundColor: '#0f1a20',
        paddingHorizontal: 12,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    selectText: { color: COLORS.text, flex: 1 },

    catRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 4,
        borderRadius: 10,
    },

    saveBtn: {
        marginTop: 6,
        height: 44,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        backgroundColor: '#16a34a',
    },
    saveText: { color: '#fff', fontWeight: '800' },
});

export default styles;
