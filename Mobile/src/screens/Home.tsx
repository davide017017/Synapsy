// src/screens/Home.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard: UNA FlatList (header + card + lista)
// - BottomSheet (@gorhom/bottom-sheet) per dettaglio transazione
// - Azioni nel dettaglio: Modifica / Elimina
// - Icone categoria mappate (anche da nomi web) via renderCategoryIcon
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo, useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionsContext";
import { useCategories } from "../context/CategoriesContext";
import { useUser } from "../context/UserContext";
import { deleteTransaction } from "@/features/transactions/api";
import EmptyState from "../components/shared/EmptyState";
import { renderCategoryIcon } from "../utils/categoryIcons";

// ─────────────────────────────────────────────────────────────────────────────
// Tipi minimi
// ─────────────────────────────────────────────────────────────────────────────
type TxType = "entrata" | "spesa";
type TxCategory = { id: string | number; name: string; icon?: string };
type Transaction = {
    id: string | number;
    type: TxType;
    description?: string;
    amount: number;
    date: string;
    category?: TxCategory;
    notes?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utils formattazione
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
// ActionButton (icona sopra, testo sotto)
// ─────────────────────────────────────────────────────────────────────────────
function ActionButton({
    icon,
    label,
    onPress,
    iconSize = 30,
    iconColor = "#c8ffe2",
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
// Cards (Saldo / Totali / Riepilogo / Storico)
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
        <View style={styles.centerCard}>
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
/* Row lista (icona categoria, testi, importo pill) — apre sheet */
// ─────────────────────────────────────────────────────────────────────────────
const TransactionRow = React.memo(function TransactionRow({
    item,
    onPress,
}: {
    item: Transaction;
    onPress?: () => void;
}) {
    const isExpense = item.type === "spesa";
    const sign = isExpense ? "−" : "+";
    const tintBg = isExpense ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)";

    return (
        <Pressable
            onPress={onPress}
            android_ripple={{ color: "rgba(255,255,255,0.06)" }}
            style={({ pressed }) => [styles.rowCard, pressed && { opacity: 0.98 }]}
        >
            {/* icona categoria */}
            <View style={[styles.leadIconWrap, { backgroundColor: tintBg }]}>
                {renderCategoryIcon(item?.category?.icon, {
                    size: 18,
                    color: isExpense ? "#ef4444" : "#22c55e",
                    nameHint: item?.category?.name,
                })}
            </View>

            {/* testi */}
            <View style={styles.rowTexts}>
                <Text style={styles.rowTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.description || (isExpense ? "Spesa" : "Entrata")}
                </Text>
                <Text style={styles.rowMeta} numberOfLines={1} ellipsizeMode="tail">
                    {new Date(item.date).toLocaleDateString("it-IT")} · {item.category?.name ?? "—"}
                </Text>
            </View>

            {/* importo */}
            <View style={[styles.amountPill, isExpense ? styles.amountPillNeg : styles.amountPillPos]}>
                <Text style={styles.amountText} numberOfLines={1}>
                    {sign} {eur(item.amount)}
                </Text>
            </View>
        </Pressable>
    );
});

// ─────────────────────────────────────────────────────────────────────────────
/* Row helper per contenuto sheet (label: value) */
// ─────────────────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ width: 96, color: COLORS.muted, fontSize: 12 }}>{label}</Text>
            <Text style={{ flex: 1, color: COLORS.text, fontSize: 14 }} numberOfLines={3}>
                {value}
            </Text>
        </View>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
    // user & data
    const { user: authUser } = useAuth();
    const userCtx: any = useUser();
    const user = userCtx?.user ?? authUser;
    const loadingUser = Boolean(userCtx?.loading);
    const refreshUser = userCtx?.refresh ?? (() => {});
    const { items: txs, refresh: refreshTxs, loading: loadingTxs } = useTransactions();
    const { items: cats = [], refresh: refreshCats, loading: loadingCats } = useCategories() as any;
    const navigation = useNavigation<any>();

    // ui state
    const [showMoney, setShowMoney] = useState(true);
    const [detail, setDetail] = useState<Transaction | null>(null);

    // refresh
    const refreshing = loadingUser || loadingTxs || loadingCats;
    const onRefresh = useCallback(() => {
        refreshUser();
        refreshCats();
        refreshTxs();
    }, [refreshUser, refreshCats, refreshTxs]);

    // metriche
    const { entrate, spese, saldo, latestList, oldestStr, latestStr, inCount, outCount } = useMemo(() => {
        let e = 0,
            s = 0,
            inC = 0,
            outC = 0;
        let minTs = Number.POSITIVE_INFINITY,
            maxTs = Number.NEGATIVE_INFINITY;

        for (const t of txs as Transaction[]) {
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
        const l = [...(txs as Transaction[])].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 10);
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

    // ── BottomSheet setup ──────────────────────────────────────────────────────
    const sheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => (Platform.OS === "ios" ? ["40%", "75%"] : ["50%"]), []);
    const openDetail = (tx: Transaction) => {
        setDetail(tx);
        sheetRef.current?.present();
    };
    const closeDetail = () => sheetRef.current?.dismiss();

    // azioni dettaglio
    const handleEdit = () => {
        if (detail) {
            closeDetail();
            navigation.navigate('TxEdit', { tx: detail });
        }
    };
    const handleDelete = () => {
        Alert.alert("Eliminare transazione?", "Questa azione non è reversibile.", [
            { text: "Annulla", style: "cancel" },
            {
                text: "Elimina",
                style: "destructive",
                onPress: async () => {
                    if (detail) {
                        try {
                            await deleteTransaction(detail.id, detail.type);
                            await refresh();
                        } catch (e: any) {
                            Alert.alert("Errore", e?.message ?? "Impossibile eliminare");
                        }
                    }
                    closeDetail();
                },
            },
        ]);
    };

    // header lista
    const ListHeader = (
        <View>
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

            <View style={styles.actionsRow}>
                <ActionButton icon="add-circle-outline" label="Nuova Transazione" onPress={() => {}} />
                <ActionButton icon="refresh-circle-outline" label="Nuova Ricorrenza" onPress={() => {}} />
                <ActionButton icon="albums-outline" label="Nuova Categoria" onPress={() => {}} />
            </View>

            <View style={styles.grid2}>
                <SaldoCard value={saldo} visible={showMoney} onToggle={() => setShowMoney((v) => !v)} />
                <TotalsCard entrate={entrate} spese={spese} visible={showMoney} />
            </View>

            <View style={styles.grid2}>
                <View style={styles.cardHalf}>
                    <CountsCard txCount={txs.length} catCount={cats.length} inCount={inCount} outCount={outCount} />
                </View>
                <View style={styles.cardHalf}>
                    <OldestTxCard oldest={oldestStr} latest={latestStr} />
                </View>
            </View>

            <View style={[styles.cardFull, { marginTop: 8, marginBottom: 10 }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="notifications-outline" size={16} color="#c7ffea" />
                    <Text style={styles.cardTitle}>Prossimo pagamento</Text>
                </View>
                <Text style={styles.muted} numberOfLines={3}>
                    {"\n"}Nessun pagamento in agenda{"\n"}-----TODO
                </Text>
            </View>

            <Text style={styles.section}>Ultime transazioni</Text>
        </View>
    );

    // renderer item
    const renderItem = ({ item }: { item: Transaction }) => (
        <TransactionRow item={item} onPress={() => openDetail(item)} />
    );

    // ─────────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────────
    return (
        // Nota: hai già il Provider in App.tsx; tenerlo qui è ok se vuoi isolare lo scope
        <BottomSheetModalProvider>
            <View style={{ flex: 1 }}>
                <FlatList
                    style={styles.list}
                    data={latestList}
                    keyExtractor={(t) => `${t.type}-${t.id}-${t.date}`}
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

                {/* Bottom Sheet Dettaglio */}
                <BottomSheetModal
                    ref={sheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    backdropComponent={(p) => (
                        <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.45} />
                    )}
                    backgroundStyle={{
                        backgroundColor: COLORS.card,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                    }}
                    handleIndicatorStyle={{ backgroundColor: "#6b7280" }}
                >
                    <BottomSheetView style={{ padding: 16, gap: 8 }}>
                        {/* Header icona + categoria + close */}
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <View
                                    style={[
                                        styles.leadIconWrap,
                                        {
                                            backgroundColor:
                                                detail?.type === "spesa"
                                                    ? "rgba(239,68,68,0.15)"
                                                    : "rgba(34,197,94,0.15)",
                                        },
                                    ]}
                                >
                                    {renderCategoryIcon(detail?.category?.icon, {
                                        size: 18,
                                        color: detail?.type === "spesa" ? "#ef4444" : "#22c55e",
                                        nameHint: detail?.category?.name,
                                    })}
                                </View>
                                <Text style={{ color: COLORS.text, fontWeight: "800" }}>
                                    {detail?.category?.name ?? "Senza categoria"}
                                </Text>
                            </View>
                            <Pressable onPress={closeDetail} style={styles.closeBtn}>
                                <Ionicons name="close" size={18} color="#e5e7eb" />
                            </Pressable>
                        </View>

                        {/* Info */}
                        <View style={{ marginTop: 8, gap: 8 }}>
                            <InfoRow
                                label="Descrizione"
                                value={detail?.description || (detail?.type === "spesa" ? "Spesa" : "Entrata") || "—"}
                            />
                            <InfoRow
                                label="Importo"
                                value={`${detail?.type === "spesa" ? "−" : "+"} ${eur(detail?.amount || 0)}`}
                            />
                            <InfoRow
                                label="Data"
                                value={detail?.date ? new Date(detail?.date).toLocaleString("it-IT") : "—"}
                            />
                            <InfoRow label="Tipo" value={detail?.type ?? "—"} />
                            <InfoRow label="Note" value={detail?.notes || "—"} />
                            <InfoRow label="ID" value={String(detail?.id ?? "—")} />
                        </View>

                        {/* Azioni */}
                        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                            <Pressable
                                onPress={handleEdit}
                                style={[
                                    styles.actionSheetBtn,
                                    { backgroundColor: "rgba(59,130,246,0.12)", borderColor: "rgba(59,130,246,0.35)" },
                                ]}
                            >
                                <Ionicons name="pencil" size={16} color="#93c5fd" />
                                <Text style={[styles.actionSheetText, { color: "#93c5fd" }]}>Modifica</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleDelete}
                                style={[
                                    styles.actionSheetBtn,
                                    { backgroundColor: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.35)" },
                                ]}
                            >
                                <Ionicons name="trash" size={16} color="#fca5a5" />
                                <Text style={[styles.actionSheetText, { color: "#fca5a5" }]}>Elimina</Text>
                            </Pressable>
                        </View>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
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
    // Lista
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
        paddingVertical: 12,
        paddingHorizontal: 10,
        minHeight: 72,
        backgroundColor: "#123327",
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 12,
    },
    actionIcon: { marginBottom: 6 },
    actionText: { color: "#c8ffe2", fontWeight: "700", fontSize: 12, textAlign: "center", lineHeight: 14 },

    // Cards
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
    cardFull: {
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },
    cardTitle: { color: COLORS.muted, fontSize: 12, fontWeight: "700", textAlign: "center" },
    cardValueCentered: { color: COLORS.text, fontSize: 20, fontWeight: "900", marginTop: 6, textAlign: "center" },
    cardValueXS: { color: COLORS.text, fontSize: 14, fontWeight: "800", marginTop: 4, textAlign: "center" },
    splitValue: { color: COLORS.text, fontSize: 20, fontWeight: "900", textAlign: "center" },
    mutedSmall: { color: COLORS.muted, fontSize: 11, textAlign: "center" },

    // Sezioni
    section: { marginTop: 4, marginBottom: 6, color: COLORS.text, fontWeight: "800" },
    muted: { color: COLORS.muted, marginTop: 4 },

    // Griglia interna per Counts
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
        borderColor: "rgba(255,255,255,0.07)",
    },
    quadTL: { borderRightWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
    quadTR: { borderBottomWidth: StyleSheet.hairlineWidth },
    quadBL: { borderRightWidth: StyleSheet.hairlineWidth },
    quadBR: {},

    // Riga lista
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
    leadIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    rowTexts: { flex: 1, minWidth: 0, paddingRight: 8 },
    rowTitle: { color: COLORS.text, fontSize: 14, fontWeight: "700" },
    rowMeta: { color: COLORS.muted, fontSize: 12, marginTop: 2 },

    // Importo pill
    amountPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, minWidth: 96, alignItems: "flex-end" },
    amountPillPos: { backgroundColor: "rgba(34,197,94,0.10)", borderWidth: 1, borderColor: "rgba(34,197,94,0.25)" },
    amountPillNeg: { backgroundColor: "rgba(239,68,68,0.10)", borderWidth: 1, borderColor: "rgba(239,68,68,0.25)" },
    amountText: { fontWeight: "900", color: COLORS.text, fontSize: 13 },

    // Segni colore (testo)
    pos: { color: COLORS.green },
    neg: { color: COLORS.red },

    // Sheet: bottoni azione + close
    actionSheetBtn: {
        flex: 1,
        minHeight: 44,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    actionSheetText: { fontWeight: "800", fontSize: 14 },
    closeBtn: {
        padding: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        backgroundColor: "rgba(255,255,255,0.06)",
    },

    // Separatore lista
    sep: { height: 8 },
});
