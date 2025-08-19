// src/screens/Panoramica/components/Header.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Header controlli mese/anno
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, COLORS } from '../styles';

interface Props {
    label: string;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
}

export default function Header({ label, onPrev, onNext, onToday }: Props) {
    return (
        <View style={styles.header}>
            <Pressable onPress={onPrev} style={styles.headerBtn}>
                <Ionicons name="chevron-back" size={20} color={COLORS.text} />
            </Pressable>
            <Text style={styles.monthLabel}>{label}</Text>
            <Pressable onPress={onNext} style={styles.headerBtn}>
                <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
            </Pressable>
            <Pressable onPress={onToday} style={[styles.headerBtn, { marginLeft: 8 }]}> 
                <Text style={{ color: COLORS.muted, fontSize: 12 }}>Oggi</Text>
            </Pressable>
        </View>
    );
}

