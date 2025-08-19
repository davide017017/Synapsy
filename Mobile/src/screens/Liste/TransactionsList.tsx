// src/screens/Liste/TransactionsList.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Lista completa delle transazioni con azioni Modifica/Elimina
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useRef } from 'react';
import { View, FlatList, Pressable, Text, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useTransactions } from '@/context/TransactionsContext';
import { deleteTransaction } from '@/features/transactions/api';
import type { Transaction } from '@/features/transactions/types';
import RowItem from './components/RowItem';
import { styles, COLORS } from './styles';

export default function TransactionsList() {
    const { items, refresh } = useTransactions();
    const navigation = useNavigation<any>();
    const sheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['25%'], []);
    const current = useRef<Transaction | null>(null);

    const openActions = (tx: Transaction) => {
        current.current = tx;
        sheetRef.current?.present();
    };
    const closeActions = () => sheetRef.current?.dismiss();

    const data = useMemo(() => [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [items]);

    const handleEdit = () => {
        if (current.current) {
            closeActions();
            navigation.navigate('TxEdit', { tx: current.current });
        }
    };

    const handleDelete = () => {
        const tx = current.current;
        if (!tx) return;
        Alert.alert('Eliminare transazione?', 'Operazione irreversibile.', [
            { text: 'Annulla', style: 'cancel' },
            {
                text: 'Elimina',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteTransaction(tx.id, tx.type);
                        await refresh();
                    } catch (e: any) {
                        Alert.alert('Errore', e?.message ?? 'Impossibile eliminare');
                    }
                    closeActions();
                },
            },
        ]);
    };

    return (
        <View style={styles.root}>
            <FlatList
                data={data}
                keyExtractor={(i) => `${i.type}-${i.id}-${i.date}`}
                renderItem={({ item }) => <RowItem item={item} onActions={() => openActions(item)} />}
                contentContainerStyle={styles.listWrap}
            />
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
                handleIndicatorStyle={{ backgroundColor: '#6b7280' }}
            >
                <BottomSheetView style={{ padding: 16, gap: 10 }}>
                    <Pressable
                        onPress={handleEdit}
                        style={({ pressed }) => [
                            styles.actionRow,
                            { backgroundColor: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.35)' },
                            pressed && { opacity: 0.96 },
                        ]}
                    >
                        <Ionicons name="pencil" size={16} color="#93c5fd" />
                        <Text style={{ color: '#93c5fd', fontWeight: '700' }}>Modifica</Text>
                    </Pressable>
                    <Pressable
                        onPress={handleDelete}
                        style={({ pressed }) => [
                            styles.actionRow,
                            { backgroundColor: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.35)' },
                            pressed && { opacity: 0.96 },
                        ]}
                    >
                        <Ionicons name="trash" size={16} color="#fca5a5" />
                        <Text style={{ color: '#fca5a5', fontWeight: '700' }}>Elimina</Text>
                    </Pressable>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
}

