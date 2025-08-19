// src/screens/Panoramica/components/DayCell.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Cella giorno con barre entrate/spese
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../styles';
import type { Day } from '../utils/calendar';
import { isSameDay } from '../utils/calendar';

interface Props {
    day: Day;
    income: number;
    expense: number;
    max: number;
    onPress: (d: Date) => void;
}

export default function DayCell({ day, income, expense, max, onPress }: Props) {
    const inH = max ? Math.min(1, income / max) * 40 : 0;
    const outH = max ? Math.min(1, expense / max) * 40 : 0;
    const today = isSameDay(day.date, new Date());
    return (
        <Pressable
            onPress={() => onPress(day.date)}
            style={[styles.dayCell, !day.inMonth && styles.outMonth, today && styles.today]}
        >
            <Text style={styles.dayLabel}>{day.date.getDate()}</Text>
            <View style={styles.bars}>
                <View style={[styles.barIn, { height: inH }]} />
                <View style={[styles.barOut, { height: outH }]} />
            </View>
        </Pressable>
    );
}

