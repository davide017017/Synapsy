// src/screens/Home.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard: tutto scrolla usando UNA FlatList con ListHeaderComponent
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionsContext";
import { useCategories } from "../context/CategoriesContext";
import { useUser } from "../context/UserContext";
import EmptyState from "../components/shared/EmptyState";

// ─────────────────────────────────────────────────────────────────────────────
// Utils
// ─────────────────────────────────────────────────────────────────────────────
function eur(n: number): string {
    try {
        return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
    } catch {
        return `€ ${n.toFixed(2)}`;
    }
}
const fmtDate = (d: Date | null) =>
    d ? d.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" }) : "—";

// ─────────────────────────────────────────────────────────────────────────────
// Bottoni azione (3 su una riga)
// ─────────────────────────────────────────────────────────────────────────────
function ActionButton({
    icon,
    label,
    onPress,
    iconSize = 30, // ★ default
    iconColor = "#c8ffe2", // opzionale
}: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    onPress: () => void;
    iconSize?: number;
    iconColor?: string;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            <Ionicons name={icon} size={iconSize} color={iconColor} style={styles.actionIcon} />
            <Text style={styles.actionText} numberOfLines={2} ellipsizeMode="tail">
                {label}
            </Text>
        </Pressable>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cards (Saldo, Totali, Riepilogo conteggi, Storico)
// ─────────────────────────────────────────────────────────────────────────────
function SaldoCard({ value, visible, onToggle }: { value: number; visible: boolean; onToggle: () => void }) {
    return (
        <View style={[styles.cardHalf, styles.centerCard]}>
            <Pressable onPress={onToggle} style={styles.eyeBtn} hitSlop={10}>
                <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={18} color="#c7ffea" />
            </Pressable>
            <Text style={styles.cardTitle}>Saldo</Text>
            <Text style={styles.cardValueCentered}>{visible ? eur(value) : "******"}</Text>
        </View>
    );
}

function TotalsCard({ entrate, spese, visible }: { entrate: number; spese: number; visible: boolean }) {
    return (
        <View style={[styles.cardHalf, styles.centerCard]}>
            <Text style={styles.cardTitle}>Totali</Text>
            <Text style={[styles.cardValueXS, styles.pos]} numberOfLines={1}>
                +: {visible ? eur(entrate) : "******"}
            </Text>
            <Text style={[styles.cardValueXS, styles.neg]} numberOfLines={1}>
                -: {visible ? eur(spese) : "******"}
            </Text>
        </View>
    );
}

function CountsCard({
    txCount,
    catCount,
    inCount,
    outCount,
}: {
    txCount: number;
    catCount: number;
    inCount: number;
    outCount: number;
}) {
    return (
        <View style={[styles.centerCard, { alignItems: "stretch" }]}>
            <Text style={[styles.cardTitle, { textAlign: "center" }]}>Riepilogo (n°)</Text>

            <View style={styles.quadWrap}>
                <View style={[styles.quadCell, styles.quadTL]}>
                    <Text style={styles.mutedSmall}>Transazioni</Text>
                    <Text style={styles.splitValue}>{txCount}</Text>
                </View>
                <View style={[styles.quadCell, styles.quadTR]}>
                    <Text style={styles.mutedSmall}>Categorie</Text>
                    <Text style={styles.splitValue}>{catCount}</Text>
                </View>
                <View style={[styles.quadCell, styles.quadBL]}>
                    <Text style={styles.mutedSmall}>Entrate</Text>
                    <Text style={[styles.splitValue, styles.pos]}>{inCount}</Text>
                </View>
                <View style={[styles.quadCell, styles.quadBR]}>
                    <Text style={styles.mutedSmall}>Spese</Text>
                    <Text style={[styles.splitValue, styles.neg]}>{outCount}</Text>
                </View>
            </View>
        </View>
    );
}

function OldestTxCard({ oldest, latest }: { oldest: string; latest: string }) {
    return (
        <View style={[styles.centerCard]}>
            <Text style={styles.cardTitle}>Storico transazioni</Text>
            <View style={{ alignItems: "center", marginTop: 6 }}>
                <Text style={styles.mutedSmall}>Ultima transazione</Text>
                <Text style={styles.cardValueCentered}>{latest}</Text>
                <View style={{ height: 10 }} />
                <Text style={styles.mutedSmall}>Prima transazione</Text>
                <Text style={styles.cardValueCentered}>{oldest}</Text>
            </View>
        </View>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const { user: authUser } = useAuth();
    const userCtx: any = useUser();
    const user = userCtx?.user ?? authUser;
    const loadingUser = Boolean(userCtx?.loading);
    const refreshUser = userCtx?.refresh ?? (() => {});

    const { items: txs, refresh: refreshTxs, loading: loadingTxs } = useTransactions();
    const { items: cats = [], refresh: refreshCats, loading: loadingCats } = useCategories() as any;

    const refreshing = loadingUser || loadingTxs || loadingCats;
    const [showMoney, setShowMoney] = useState(true);

    const onRefresh = useCallback(() => {
        refreshUser();
        refreshCats();
        refreshTxs();
    }, [refreshUser, refreshCats, refreshTxs]);

    const { entrate, spese, saldo, latestList, oldestStr, latestStr, inCount, outCount } = useMemo(() => {
        let e = 0,
            s = 0;
        let minTs = Number.POSITIVE_INFINITY;
        let maxTs = Number.NEGATIVE_INFINITY;
        let inC = 0,
            outC = 0;

        for (const t of txs) {
            const ts = Date.parse(t.date);
            if (!Number.isNaN(ts)) {
                if (ts < minTs) minTs = ts;
                if (ts > maxTs) maxTs = ts;
            }
            if (t.type === "entrata") {
                e += t.amount || 0;
                inC++;
            } else {
                s += t.amount || 0;
                outC++;
            }
        }

        const oldest = minTs === Number.POSITIVE_INFINITY ? null : new Date(minTs);
        const latest = maxTs === Number.NEGATIVE_INFINITY ? null : new Date(maxTs);
        const l = [...txs].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 10);

        return {
            entrate: e,
            spese: s,
            saldo: e - s,
            latestList: l,
            oldestStr: fmtDate(oldest),
            latestStr: fmtDate(latest),
            inCount: inC,
            outCount: outC,
        };
    }, [txs]);

    // ── Header componibile per la FlatList ─────────────────────────────────────
    const ListHeader = (
        <View>
            {/* Header con logo + benvenuto centrato */}
            <View style={styles.header}>
                <Image
                    source={require("../../assets/images/icon_1024x1024.webp")}
                    style={styles.logo}
                    accessibilityLabel="Logo Synapsi"
                />
                <Text style={styles.hello} numberOfLines={1} ellipsizeMode="tail">
                    Benvenuto, {user?.name ?? "utente"}!
                </Text>
                <Text style={styles.subtitle}>Monitora spese ed entrate e tieni d’occhio il saldo.</Text>
            </View>

            {/* Bottoni azione */}
            <View style={styles.actionsRow}>
                <ActionButton icon="add-circle-outline" label="Nuova Transazione" onPress={() => {}} />
                <ActionButton icon="refresh-circle-outline" label="Nuova Ricorrenza" onPress={() => {}} />
                <ActionButton icon="albums-outline" label="Nuova Categoria" onPress={() => {}} />
            </View>

            {/* Riga 1: Saldo + Totali € */}
            <View style={styles.grid2}>
                <SaldoCard value={saldo} visible={showMoney} onToggle={() => setShowMoney((v) => !v)} />
                <TotalsCard entrate={entrate} spese={spese} visible={showMoney} />
            </View>

            {/* Riga 2: Conteggi (Tx+Cat) + Storico */}
            <View style={styles.grid2}>
                <View style={styles.cardHalf}>
                    <CountsCard txCount={txs.length} catCount={cats.length} inCount={inCount} outCount={outCount} />
                </View>
                <View style={styles.cardHalf}>
                    <OldestTxCard oldest={oldestStr} latest={latestStr} />
                </View>
            </View>

            {/* Prossimo pagamento – full width */}
            <View style={[styles.cardFull, { marginTop: 8, marginBottom: 10 }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="notifications-outline" size={16} color="#c7ffea" />
                    <Text style={styles.cardTitle}>Prossimo pagamento</Text>
                </View>
                <Text style={styles.muted} numberOfLines={3}>
                    {"\n"}Nessun pagamento in agenda{"\n"}
                    -----TODO
                </Text>
            </View>

            {/* Titolo lista */}
            <Text style={styles.section}>Ultime transazioni</Text>
        </View>
    );

    // ── Render item per la FlatList ────────────────────────────────────────────
    const renderItem = ({ item }: any) => (
        <TransactionRow
            item={item}
            onPress={() => {
                /* TODO: navigate to detail */
            }}
        />
    );
    // ─────────────────────────────────────────────────────────────────────────────
    // TransactionRow — card con icona (sx), titolo/meta (centro), amount (dx)
    // ─────────────────────────────────────────────────────────────────────────────
    const TransactionRow = React.memo(function TransactionRow({
        item,
        onPress,
    }: {
        item: any; // usa il tuo tipo Transaction se ce l'hai
        onPress?: () => void;
    }) {
        const isExpense = item.type === "spesa";
        const sign = isExpense ? "−" : "+";

        // ── Icona e colori per tipo ──
        const iconName = isExpense ? "trending-down" : "trending-up";
        const tintBg = isExpense ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)";

        return (
            <Pressable
                onPress={onPress}
                android_ripple={{ color: "rgba(255,255,255,0.06)" }}
                style={({ pressed }) => [styles.rowCard, pressed && { opacity: 0.98 }]}
            >
                {/* ── Icona tonda sinistra ── */}
                <View style={[styles.leadIconWrap, { backgroundColor: tintBg }]}>
                    <Ionicons name={iconName as any} size={18} color={isExpense ? "#ef4444" : "#22c55e"} />
                </View>

                {/* ── Testi centro ── */}
                <View style={styles.rowTexts}>
                    <Text style={styles.rowTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.description || (isExpense ? "Spesa" : "Entrata")}
                    </Text>
                    <Text style={styles.rowMeta} numberOfLines={1} ellipsizeMode="tail">
                        {new Date(item.date).toLocaleDateString("it-IT")} · {item.category?.name ?? "—"}
                    </Text>
                </View>

                {/* ── Amount pill destra ── */}
                <View style={[styles.amountPill, isExpense ? styles.amountPillNeg : styles.amountPillPos]}>
                    <Text style={styles.amountText} numberOfLines={1}>
                        {sign} {eur(item.amount)}
                    </Text>
                </View>
            </Pressable>
        );
    });

    // ── FlatList come root: scorre tutto (header + lista) ──────────────────────
    return (
        <FlatList
            style={styles.list}
            data={latestList}
            keyExtractor={(t: any) => `${t.type}-${t.id}-${t.date}`}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={<EmptyState message="Nessuna transazione" />}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.containerContent}
            ListFooterComponent={<View style={{ height: 16 }} />}
        />
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stili
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
    bg: "#0b1013",
    card: "#0f1a20",
    border: "rgba(255,255,255,0.06)",
    text: "#eaf5ee",
    muted: "#9fb0a9",
    green: "#22c55e",
    red: "#ef4444",
};

const styles = StyleSheet.create({
    list: { flex: 1, backgroundColor: COLORS.bg },
    containerContent: { padding: 12, flexGrow: 1 },

    // Header
    header: { alignItems: "center", marginBottom: 8, marginTop: 20 },
    logo: { width: 56, height: 56, borderRadius: 12, marginBottom: 6 },
    hello: { fontSize: 18, fontWeight: "800", color: COLORS.text, textAlign: "center" },
    subtitle: { marginTop: 2, color: COLORS.muted, fontSize: 12, textAlign: "center" },

    // Azioni
    actionsRow: { flexDirection: "row", gap: 8, marginTop: 10, marginBottom: 8 },

    actionBtn: {
        flex: 1,
        minWidth: 0,
        alignItems: "center",
        justifyContent: "center",
        // layout verticale
        paddingVertical: 12,
        paddingHorizontal: 10,
        minHeight: 72,
        backgroundColor: "#123327",
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 12,
    },

    actionIcon: { marginBottom: 6 }, // spazio tra icona e testo

    actionText: {
        color: "#c8ffe2",
        fontWeight: "700",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 14,
    },

    // Griglia 2x2
    grid2: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
    cardHalf: {
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        flexBasis: "48%",
        maxWidth: "48%",
        position: "relative",
    },
    centerCard: { alignItems: "center", justifyContent: "center" },
    eyeBtn: {
        position: "absolute",
        top: 8,
        right: 8,
        padding: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: "rgba(255,255,255,0.06)",
    },

    // Card full comune
    cardFull: {
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },

    // Testi card
    cardTitle: { color: COLORS.muted, fontSize: 12, fontWeight: "700", textAlign: "center" },
    cardValueCentered: { color: COLORS.text, fontSize: 10, fontWeight: "900", marginTop: 6, textAlign: "center" },
    cardValueXS: { color: COLORS.text, fontSize: 14, fontWeight: "800", marginTop: 4, textAlign: "center" },
    splitValue: { color: COLORS.text, fontSize: 20, fontWeight: "900", textAlign: "center" },
    mutedSmall: { color: COLORS.muted, fontSize: 9, textAlign: "center" },

    // Sezioni / titoli
    section: { marginTop: 4, marginBottom: 6, color: COLORS.text, fontWeight: "800" },
    muted: { color: COLORS.muted, marginTop: 4 },

    // Lista
    rowCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
    },
    leadIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    rowTexts: { flex: 1, minWidth: 0, paddingRight: 8 },
    rowTitle: { color: COLORS.text, fontSize: 14, fontWeight: "700" },
    rowMeta: { color: COLORS.muted, fontSize: 12, marginTop: 2 },

    amountPill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        minWidth: 96,
        alignItems: "flex-end",
    },
    amountPillPos: { backgroundColor: "rgba(34,197,94,0.10)", borderWidth: 1, borderColor: "rgba(34,197,94,0.25)" },
    amountPillNeg: { backgroundColor: "rgba(239,68,68,0.10)", borderWidth: 1, borderColor: "rgba(239,68,68,0.25)" },
    amountText: { fontWeight: "900", color: COLORS.text, fontSize: 13 },

    // Separatore più “spazioso” tra card (sostituisci la tua sep se vuoi)
    sep: { height: 8 },

    // Segni +/-
    pos: { color: COLORS.green },
    neg: { color: COLORS.red },

    // Griglia 2×2 della card conteggi
    quadWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
        borderRadius: 10,
        overflow: "hidden",
    },
    quadCell: {
        width: "50%",
        paddingVertical: 5,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "rgba(255,255,255,0.07)",
    },
    quadTL: { borderRightWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
    quadTR: { borderBottomWidth: StyleSheet.hairlineWidth },
    quadBL: { borderRightWidth: StyleSheet.hairlineWidth },
    quadBR: {},
});
