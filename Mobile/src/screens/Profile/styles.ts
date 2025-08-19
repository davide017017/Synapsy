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
    banner: {
        margin: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(239,68,68,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.35)',
    },
    bannerText: { color: COLORS.red, textAlign: 'center', fontWeight: '700' },
    section: { paddingHorizontal: 16, paddingTop: 20, gap: 12 },
    avatarBtn: { alignSelf: 'center', marginTop: 20 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    rowLabel: { width: 90, color: COLORS.muted, fontSize: 14 },
    rowValue: { flex: 1, color: COLORS.text, fontSize: 15 },
    rowInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.96)',
        color: '#111827',
        fontSize: 14,
    },
    rowActions: { flexDirection: 'row', gap: 6, marginLeft: 8 },
});

export default styles;

