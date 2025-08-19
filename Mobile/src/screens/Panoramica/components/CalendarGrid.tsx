// src/screens/Panoramica/components/CalendarGrid.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Griglia calendario 7x5/6
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles';
import type { Day } from '../utils/calendar';
import DayCell from './DayCell';

interface Props {
    weeks: Day[][];
    data: Record<string, { in: number; out: number }>;
    max: number;
    onPressDay: (d: Date) => void;
}

export default function CalendarGrid({ weeks, data, max, onPressDay }: Props) {
    return (
        <View style={styles.grid}>
            {weeks.map((w, i) => (
                <View key={i} style={styles.weekRow}>
                    {w.map((day) => {
                        const key = day.date.toISOString().slice(0, 10);
                        const val = data[key] || { in: 0, out: 0 };
                        return (
                            <DayCell
                                key={key}
                                day={day}
                                income={val.in}
                                expense={val.out}
                                max={max}
                                onPress={onPressDay}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

