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
    root: { flex: 1, backgroundColor: COLORS.bg, padding: 12 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    headerBtn: { padding: 6 },
    monthLabel: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
    grid: { flex: 1 },
    weekRow: { flexDirection: 'row' },
    dayCell: { flex: 1, padding: 4, alignItems: 'center', justifyContent: 'flex-start' },
    dayLabel: { color: COLORS.text, fontSize: 12, marginBottom: 2 },
    bars: { flexDirection: 'row', width: '100%', gap: 2, alignItems: 'flex-end', flex: 1 },
    barIn: { flex: 1, backgroundColor: COLORS.green, borderRadius: 2 },
    barOut: { flex: 1, backgroundColor: COLORS.red, borderRadius: 2 },
    today: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4 },
    outMonth: { opacity: 0.3 },
});

export default styles;

