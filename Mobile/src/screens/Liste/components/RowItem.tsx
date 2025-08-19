// src/screens/Liste/components/RowItem.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Riga transazione riutilizzabile per liste
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Transaction } from '@/features/transactions/types';
import { renderCategoryIcon } from '@/utils/categoryIcons';
import { eur, fmtDate, tintFromHex } from '../utils';
import { styles, COLORS } from '../styles';

interface Props {
    item: Transaction;
    onActions: () => void;
}

const RowItem = React.memo(({ item, onActions }: Props) => {
    const isExpense = item.type === 'spesa';
    const color = item.category?.color || (isExpense ? COLORS.red : COLORS.green);
    const bg = tintFromHex(item.category?.color, 0.15, isExpense ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)');
    const sign = isExpense ? '-' : '+';
    return (
        <View style={styles.row}>
            <View style={[styles.leadIconWrap, { backgroundColor: bg }]}> 
                {renderCategoryIcon(item.category?.icon, { size: 18, color, nameHint: item.category?.name })}
            </View>
            <View style={styles.rowTexts}>
                <Text style={styles.rowTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.description || (isExpense ? 'Spesa' : 'Entrata')}
                </Text>
                <Text style={styles.rowMeta} numberOfLines={1} ellipsizeMode="tail">
                    {fmtDate(item.date)} · {item.category?.name || '—'}
                </Text>
            </View>
            <View
                style={[
                    styles.amountPill,
                    { backgroundColor: isExpense ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)' },
                ]}
            >
                <Text
                    style={[styles.amountText, { color: isExpense ? COLORS.red : COLORS.green }]}
                    numberOfLines={1}
                >
                    {sign} {eur(item.amount)}
                </Text>
            </View>
            <Pressable onPress={onActions} style={styles.editBtn} hitSlop={10}>
                <Ionicons name="ellipsis-vertical" size={16} color={COLORS.muted} />
            </Pressable>
        </View>
    );
});

export default RowItem;

