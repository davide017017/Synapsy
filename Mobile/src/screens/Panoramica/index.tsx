// src/screens/Panoramica/index.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Calendario mensile con barre entrate/spese
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { useTransactions } from '@/context/TransactionsContext';
import CalendarGrid from './components/CalendarGrid';
import Header from './components/Header';
import { styles } from './styles';
import { monthMatrix } from './utils/calendar';
import type { Transaction } from '@/features/transactions/types';

export default function Panoramica() {
    const { items } = useTransactions();
    const [current, setCurrent] = useState(new Date());

    const year = current.getFullYear();
    const month = current.getMonth();
    const weeks = useMemo(() => monthMatrix(year, month), [year, month]);

    const data = useMemo(() => {
        const m: Record<string, { in: number; out: number }> = {};
        items.forEach((tx: Transaction) => {
            const key = tx.date.slice(0, 10);
            const dt = new Date(key);
            if (dt.getMonth() !== month || dt.getFullYear() !== year) return;
            if (!m[key]) m[key] = { in: 0, out: 0 };
            if (tx.type === 'entrata') m[key].in += tx.amount;
            else m[key].out += tx.amount;
        });
        return m;
    }, [items, month, year]);

    const max = useMemo(() => {
        let maxVal = 0;
        Object.values(data).forEach((v) => {
            maxVal = Math.max(maxVal, v.in, v.out);
        });
        return maxVal;
    }, [data]);

    const label = new Date(year, month, 1).toLocaleDateString('it-IT', {
        month: 'long',
        year: 'numeric',
    });

    const changeMonth = (delta: number) => {
        const d = new Date(year, month + delta, 1);
        setCurrent(d);
    };

    return (
        <View style={styles.root}>
            <Header
                label={label}
                onPrev={() => changeMonth(-1)}
                onNext={() => changeMonth(1)}
                onToday={() => setCurrent(new Date())}
            />
            <CalendarGrid
                weeks={weeks}
                data={data}
                max={max}
                onPressDay={(d) => Alert.alert('Giorno', d.toISOString().slice(0, 10))}
            />
        </View>
    );
}

