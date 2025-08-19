// src/screens/Profile/components/Row.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Riga profilo con stati editing/onEdit/onSave/onCancel
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, COLORS } from '../styles';

interface Props {
    label: string;
    value: string;
    editable?: boolean;
    onSave?: (val: string) => void;
}

export default function Row({ label, value, editable = true, onSave }: Props) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const startEdit = () => {
        if (!editable) return;
        setDraft(value);
        setEditing(true);
    };
    const cancel = () => {
        setEditing(false);
        setDraft(value);
    };
    const save = () => {
        setEditing(false);
        onSave?.(draft);
    };

    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            {editing ? (
                <>
                    <TextInput value={draft} onChangeText={setDraft} style={styles.rowInput} />
                    <View style={styles.rowActions}>
                        <Pressable onPress={save} hitSlop={8}>
                            <Ionicons name="checkmark" size={16} color={COLORS.green} />
                        </Pressable>
                        <Pressable onPress={cancel} hitSlop={8}>
                            <Ionicons name="close" size={16} color={COLORS.red} />
                        </Pressable>
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.rowValue}>{value || '—'}</Text>
                    {editable && (
                        <Pressable onPress={startEdit} style={styles.rowActions} hitSlop={8}>
                            <Ionicons name="pencil" size={16} color={COLORS.muted} />
                        </Pressable>
                    )}
                </>
            )}
        </View>
    );
}

