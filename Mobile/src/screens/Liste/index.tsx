// src/screens/Liste/index.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Landing: bottoni per Transazioni, Ricorrenti, Categorie
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Pressable, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

export default function Liste() {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.root}>
            <View style={styles.landing}>
                <Pressable
                    onPress={() => navigation.navigate('TransactionsList')}
                    style={({ pressed }) => [styles.bigBtn, pressed && { opacity: 0.96 }]}
                >
                    <Text style={styles.bigBtnText}>Transazioni</Text>
                </Pressable>
                <Pressable
                    onPress={() => Alert.alert('Ricorrenti', 'TODO')}
                    style={({ pressed }) => [styles.bigBtn, pressed && { opacity: 0.96 }]}
                >
                    <Text style={styles.bigBtnText}>Ricorrenti</Text>
                </Pressable>
                <Pressable
                    onPress={() => Alert.alert('Categorie', 'TODO')}
                    style={({ pressed }) => [styles.bigBtn, pressed && { opacity: 0.96 }]}
                >
                    <Text style={styles.bigBtnText}>Categorie</Text>
                </Pressable>
            </View>
        </View>
    );
}

