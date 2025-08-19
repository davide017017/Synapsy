// src/screens/EditTransaction/index.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Modifica transazione (descrizione / importo / note / categoria / data)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { updateTransaction } from '@/features/transactions/api';
import { useTransactions } from '@/context/TransactionsContext';
import { useCategories } from '@/context/CategoriesContext';
import type { Transaction } from '@/features/transactions/types';
import type { Category } from '@/features/categories/types';
import { renderCategoryIcon } from '@/utils/categoryIcons';
import { parseAmount, tintFromHex, fmtDate } from './utils';
import { COLORS, styles } from './styles';

type Params = { TxEdit: { tx: Transaction } };

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function EditTransaction() {
    const route = useRoute<RouteProp<Params, "TxEdit">>();
    const navigation = useNavigation<any>();
    const { refresh } = useTransactions();
    const { items: categories = [] } = useCategories();

    const tx = route.params?.tx;

    // ── Form ───────────────────────────────────────────────────────────────────
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            description: tx?.description ?? "",
            amount: String(tx?.amount ?? ""),
            notes: tx?.notes ?? "",
            category_id: tx?.category?.id ?? undefined,
            date: tx?.date ?? new Date().toISOString(),
        },
    });

    const pickedCategoryId = watch("category_id") as Category["id"] | undefined;
    const pickedDateIso = watch("date") as string;

    const pickedCategory = useMemo(
        () => categories.find((c) => String(c.id) === String(pickedCategoryId)),
        [categories, pickedCategoryId],
    );

    // ── Date picker state ──────────────────────────────────────────────────────
    const [showDatePicker, setShowDatePicker] = useState(false);
    const onChangeDate = (_: any, d?: Date) => {
        setShowDatePicker(false);
        if (d) setValue("date", d.toISOString(), { shouldDirty: true });
    };

    // ── BottomSheet categories ─────────────────────────────────────────────────
    const catSheetRef = useRef<BottomSheetModal>(null);
    const catSnapPoints = useMemo(() => ["50%", "85%"], []);
    const openCatSheet = () => catSheetRef.current?.present();
    const closeCatSheet = () => catSheetRef.current?.dismiss();

    // ── Submit ─────────────────────────────────────────────────────────────────
    const onSubmit = handleSubmit(async (data) => {
        const amountNum = parseAmount(data.amount as unknown as string);
        if (Number.isNaN(amountNum)) {
            Alert.alert("Importo non valido", "Inserisci un numero valido (es. 123,45).");
            return;
        }
        try {
            await updateTransaction(tx.id, tx.type, {
                description: (data.description as string)?.trim(),
                amount: amountNum,
                notes: (data.notes as string)?.trim(),
                date: (data.date as string) || tx.date,
                category_id: data.category_id as Category['id'] | undefined,
            });
            await refresh();
            navigation.goBack();
        } catch (e: any) {
            Alert.alert("Errore", e?.message ?? "Impossibile salvare la transazione.");
        }
    });

    // ── UI helpers ─────────────────────────────────────────────────────────────
    const catColor = pickedCategory?.color || (tx?.type === "spesa" ? "#ef4444" : "#22c55e");
    const catBg = tintFromHex(
        pickedCategory?.color,
        0.15,
        tx?.type === "spesa" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
    );

    const dateLabel = fmtDate(pickedDateIso);

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.card}>
                {/* ── Header ────────────────────────────────────────────────────────── */}
                <Text style={styles.title}>Modifica transazione</Text>
                <View style={styles.headerRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: catBg }]}>
                        {renderCategoryIcon(pickedCategory?.icon || tx?.category?.icon, {
                            size: 16,
                            color: catColor,
                            nameHint: pickedCategory?.name || tx?.category?.name,
                        })}
                    </View>
                    <Text style={styles.subtitle}>
                        {tx?.type === "spesa" ? "Spesa" : "Entrata"} ·{" "}
                        {pickedCategory?.name ?? tx?.category?.name ?? "—"}
                    </Text>
                </View>

                {/* ── Descrizione ───────────────────────────────────────────────────── */}
                <Text style={styles.label}>Descrizione</Text>
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Es. Spesa supermercato"
                            placeholderTextColor="#9aa1aa"
                            style={styles.input}
                        />
                    )}
                />

                {/* ── Importo ───────────────────────────────────────────────────────── */}
                <Text style={styles.label}>Importo</Text>
                <Controller
                    control={control}
                    name="amount"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="decimal-pad"
                            placeholder="0,00"
                            placeholderTextColor="#9aa1aa"
                            style={styles.input}
                        />
                    )}
                />

                {/* ── Categoria (BottomSheet) ───────────────────────────────────────── */}
                <Text style={styles.label}>Categoria</Text>
                <Pressable
                    onPress={openCatSheet}
                    style={({ pressed }) => [styles.selectBtn, pressed && { opacity: 0.96 }]}
                >
                    <View style={[styles.categoryBadge, { backgroundColor: catBg }]}>
                        {renderCategoryIcon(pickedCategory?.icon || tx?.category?.icon, {
                            size: 16,
                            color: catColor,
                            nameHint: pickedCategory?.name || tx?.category?.name,
                        })}
                    </View>
                    <Text style={styles.selectText} numberOfLines={1}>
                        {pickedCategory?.name ?? tx?.category?.name ?? "Scegli categoria"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9fb0a9" />
                </Pressable>

                {/* ── Data (DateTimePicker) ─────────────────────────────────────────── */}
                <Text style={styles.label}>Data</Text>
                {Platform.OS === 'web' ? (
                    <Controller
                        control={control}
                        name="date"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <>
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="2024-01-01T12:00:00"
                                    placeholderTextColor="#9aa1aa"
                                    style={styles.input}
                                />
                                <Text style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>
                                    {fmtDate(value)}
                                </Text>
                            </>
                        )}
                    />
                ) : (
                    <>
                        <Pressable
                            onPress={() => setShowDatePicker(true)}
                            style={({ pressed }) => [styles.selectBtn, pressed && { opacity: 0.96 }]}
                        >
                            <Ionicons name="calendar-outline" size={16} color="#9fb0a9" />
                            <Text style={styles.selectText}>{dateLabel}</Text>
                        </Pressable>
                        {showDatePicker && (
                            <DateTimePicker
                                mode="datetime"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                value={pickedDateIso ? new Date(pickedDateIso) : new Date()}
                                onChange={onChangeDate}
                            />
                        )}
                    </>
                )}

                {/* ── Note ──────────────────────────────────────────────────────────── */}
                <Text style={styles.label}>Note</Text>
                <Controller
                    control={control}
                    name="notes"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Aggiungi note (opzionale)"
                            placeholderTextColor="#9aa1aa"
                            style={[styles.input, { height: 90, textAlignVertical: "top" }]}
                            multiline
                        />
                    )}
                />

                {/* ── CTA Salva ─────────────────────────────────────────────────────── */}
                <Pressable
                    onPress={onSubmit}
                    style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.95 }]}
                    disabled={isSubmitting}
                >
                    <Ionicons name="save-outline" size={16} color="#fff" />
                    <Text style={styles.saveText}>{isSubmitting ? "Salvo…" : "Salva"}</Text>
                </Pressable>
            </View>

            {/* ── BottomSheet: Selettore categoria ────────────────────────────────── */}
            <BottomSheetModal
                ref={catSheetRef}
                index={0}
                snapPoints={catSnapPoints}
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
                <BottomSheetView style={{ padding: 12, gap: 8 }}>
                    <Text style={{ color: COLORS.text, fontWeight: "800", marginBottom: 6 }}>Seleziona categoria</Text>
                    {categories.map((c) => {
                        const color = c.color || "#22c55e";
                        const bg = tintFromHex(c.color, 0.15, "rgba(255,255,255,0.06)");
                        const selected = String(c.id) === String(pickedCategoryId);
                        return (
                            <Pressable
                                key={String(c.id)}
                                onPress={() => {
                                    setValue("category_id", c.id, { shouldDirty: true });
                                    closeCatSheet();
                                }}
                                style={({ pressed }) => [
                                    styles.catRow,
                                    { backgroundColor: pressed ? "rgba(255,255,255,0.04)" : "transparent" },
                                ]}
                            >
                                <View style={[styles.categoryBadge, { backgroundColor: bg }]}>
                                    {renderCategoryIcon(c.icon, { size: 16, color, nameHint: c.name })}
                                </View>
                                <Text style={{ color: COLORS.text, flex: 1 }}>{c.name}</Text>
                                {selected && <Ionicons name="checkmark" size={18} color="#93c5fd" />}
                            </Pressable>
                        );
                    })}
                </BottomSheetView>
            </BottomSheetModal>
        </KeyboardAvoidingView>
    );
}
