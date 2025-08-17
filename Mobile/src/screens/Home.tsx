// src/screens/Home.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard compatta: header centrato + Saldo/Totali + 2 card (conteggi / data prima tx)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, Image, Pressable } from "react-native";
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

// Bottone azione (3 su una riga)
function ActionButton({
    icon,
    label,
    onPress,
}: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress} style={styles.actionBtn}>
            <Ionicons name={icon} size={16} color="#c8ffe2" />
            <Text style={styles.actionText} numberOfLines={2} ellipsizeMode="tail">
                {label}
            </Text>
        </Pressable>
    );
}

// Card Saldo centrata + occhio
function SaldoCard({ value, visible, onToggle }: { value: number; visible: boolean; onToggle: () => void }) {
    return (
        <View style={[styles.cardHalf, styles.centerCard]}>
            <Pressable onPress={onToggle} style={styles.eyeBtn} hitSlop={10}>
                <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={18} color="#c7ffea" />
            </Pressable>
            <Text style={styles.cardTitle}>Saldo</Text>
            <Text style={styles.cardValueCentered}>{visible ? eur(value) : "••••"}</Text>
        </View>
    );
}

// Card Totali (Entrate/Spese su due righe)
function TotalsCard({ entrate, spese, visible }: { entrate: number; spese: number; visible: boolean }) {
    return (
        <View style={[styles.cardHalf, styles.centerCard]}>
            <Text style={styles.cardTitle}>Totali</Text>
            <Text style={[styles.cardValueXS, styles.pos]} numberOfLines={1}>
                Entrate: {visible ? eur(entrate) : "••••"}
            </Text>
            <Text style={[styles.cardValueXS, styles.neg]} numberOfLines={1}>
                Spese: {visible ? eur(spese) : "••••"}
            </Text>
        </View>
    );
}

// Card "4 quadranti": Transazioni / Categorie (su) — Entrate / Spese (giù)
function CountsCard({
    txCount,
    catCount,
    inCount,
    outCount,
}: {
    txCount: number;
    catCount: number;
    inCount: number; // numero di entrate
    outCount: number; // numero di spese
}) {
    return (
        <View style={[styles.centerCard, { alignItems: "stretch" }]}>
            <Text style={[styles.cardTitle, { textAlign: "center" }]}>Riepilogo (n°)</Text>

            <View style={styles.quadWrap}>
                {/* Alto-sinistra: Transazioni */}
                <View style={[styles.quadCell, styles.quadTL]}>
                    <Text style={styles.mutedSmall}>Transazioni</Text>
                    <Text style={styles.splitValue}>{txCount}</Text>
                </View>

                {/* Alto-destra: Categorie */}
                <View style={[styles.quadCell, styles.quadTR]}>
                    <Text style={styles.mutedSmall}>Categorie</Text>
                    <Text style={styles.splitValue}>{catCount}</Text>
                </View>

                {/* Basso-sinistra: Entrate (conteggio) */}
                <View style={[styles.quadCell, styles.quadBL]}>
                    <Text style={styles.mutedSmall}>Entrate</Text>
                    <Text style={[styles.splitValue, styles.pos]}>{inCount}</Text>
                </View>

                {/* Basso-destra: Spese (conteggio) */}
                <View style={[styles.quadCell, styles.quadBR]}>
                    <Text style={styles.mutedSmall}>Spese</Text>
                    <Text style={[styles.splitValue, styles.neg]}>{outCount}</Text>
                </View>
            </View>
        </View>
    );
}

// card “storico” con prima e ultima transazione (centrate)
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

    const fmtDate = (d: Date | null) =>
        d ? d.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" }) : "—";

    const onRefresh = useCallback(() => {
        refreshUser();
        refreshCats();
        refreshTxs();
    }, [refreshUser, refreshCats, refreshTxs]);

    const {
        entrate,
        spese,
        saldo,
        latest: latestList,
        oldestStr,
        latestStr,
        txCount,
        catCount,
        inCount,
        outCount,
    } = useMemo(() => {
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
            latest: l,
            oldestStr: fmtDate(oldest),
            latestStr: fmtDate(latest),
            txCount: txs.length,
            catCount: useCategories.length, // se hai le categorie a portata qui
            inCount: inC,
            outCount: outC,
        };
    }, [txs /*, categories se la usi qui */]);

    return (
        <View style={styles.container}>
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
                <ActionButton icon="repeat-outline" label="Nuova Ricorrenza" onPress={() => {}} />
                <ActionButton icon="albums-outline" label="Nuova Categoria" onPress={() => {}} />
            </View>

            {/* Riga 1: Saldo + Totali € */}
            <View style={styles.grid2}>
                <SaldoCard value={saldo} visible={showMoney} onToggle={() => setShowMoney((v) => !v)} />
                <TotalsCard entrate={entrate} spese={spese} visible={showMoney} />
            </View>

            {/* Riga 2: Conteggi (Tx+Cat) + Data prima transazione */}
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
                <Text style={styles.muted} numberOfLines={1}>
                    Nessun pagamento in agenda
                </Text>
            </View>

            {/* Ultime transazioni */}
            <Text style={styles.section}>Ultime transazioni</Text>

            {latestList.length === 0 ? (
                <EmptyState message="Nessuna transazione" />
            ) : (
                <FlatList
                    data={latestList}
                    keyExtractor={(t) => `${t.type}-${t.id}-${t.date}`}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ItemSeparatorComponent={() => <View style={styles.sep} />}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <View style={{ flex: 1, paddingRight: 8 }}>
                                <Text style={styles.rowTitle} numberOfLines={1} ellipsizeMode="tail">
                                    {item.description || (item.type === "spesa" ? "Spesa" : "Entrata")}
                                </Text>
                                <Text style={styles.rowMeta} numberOfLines={1} ellipsizeMode="tail">
                                    {new Date(item.date).toLocaleDateString("it-IT")} · {item.category?.name ?? "—"}
                                </Text>
                            </View>
                            <Text
                                style={[styles.rowAmount, item.type === "spesa" ? styles.neg : styles.pos]}
                                numberOfLines={1}
                            >
                                {item.type === "spesa" ? "−" : "+"} {eur(item.amount)}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
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
    container: { flex: 1, padding: 12, backgroundColor: COLORS.bg },

    // Header
    header: { alignItems: "center", marginBottom: 8 },
    logo: { width: 56, height: 56, borderRadius: 12, marginBottom: 6 },
    hello: { fontSize: 18, fontWeight: "800", color: COLORS.text, textAlign: "center" },
    subtitle: { marginTop: 2, color: COLORS.muted, fontSize: 12, textAlign: "center" },

    // Azioni
    actionsRow: { flexDirection: "row", gap: 8, marginTop: 10, marginBottom: 8 },
    actionBtn: {
        flex: 1,
        minWidth: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#123327",
        borderColor: COLORS.border,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    actionText: { color: "#c8ffe2", fontWeight: "700", fontSize: 12, textAlign: "center", lineHeight: 14 },

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
    cardValueCentered: { color: COLORS.text, fontSize: 20, fontWeight: "900", marginTop: 6, textAlign: "center" },
    cardValueXS: { color: COLORS.text, fontSize: 14, fontWeight: "800", marginTop: 4, textAlign: "center" },
    splitValue: { color: COLORS.text, fontSize: 20, fontWeight: "900", textAlign: "center" },
    mutedSmall: { color: COLORS.muted, fontSize: 11, textAlign: "center" },

    // Sezioni
    section: { marginTop: 4, marginBottom: 6, color: COLORS.text, fontWeight: "800" },

    // Lista
    row: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
    sep: { height: 1, backgroundColor: "rgba(255,255,255,0.05)" },
    rowTitle: { color: COLORS.text, fontSize: 14, fontWeight: "700" },
    rowMeta: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
    rowAmount: { minWidth: 110, textAlign: "right", fontWeight: "900" },

    // Colori segno
    pos: { color: COLORS.green },
    neg: { color: COLORS.red },

    muted: { color: COLORS.muted, marginTop: 4 },

    // Griglia 2×2 dentro la card conteggi
    quadWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
        borderRadius: 10,
        overflow: "hidden",
    },
    quadCell: {
        width: "50%",
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "rgba(255,255,255,0.07)", // linee sottili
    },
    quadTL: {
        borderRightWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    quadTR: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    quadBL: {
        borderRightWidth: StyleSheet.hairlineWidth,
    },
    quadBR: {},
});
