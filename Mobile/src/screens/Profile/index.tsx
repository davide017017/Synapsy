// src/screens/Profile/index.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Schermata profilo con edit inline, avatar e tema
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useUser } from '@/context/UserContext';
import Row from './components/Row';
import AvatarPickerSheet from './components/AvatarPickerSheet';
import ThemePickerSheet from './components/ThemePickerSheet';
import { styles } from './styles';

export default function Profile() {
    const { profile, update } = useUser();
    const avatarRef = useRef<BottomSheetModal>(null);
    const themeRef = useRef<BottomSheetModal>(null);
    const [theme, setTheme] = useState('default');

    const demo = profile?.email === 'demo@synapsy.app';
    const openAvatar = () => avatarRef.current?.present();
    const openTheme = () => themeRef.current?.present();

    return (
        <View style={styles.root}>
            {demo && (
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>Demo user: modifiche disabilitate</Text>
                </View>
            )}
            <Pressable onPress={openAvatar} style={styles.avatarBtn}>
                <Ionicons name={(profile?.avatar as any) || 'person-circle'} size={80} color="#eaf5ee" />
            </Pressable>
            <View style={styles.section}>
                <Row label="Nome" value={profile?.name || ''} editable={!demo} onSave={(v) => update?.({ name: v })} />
                <Row label="Cognome" value={profile?.surname || ''} editable={!demo} onSave={(v) => update?.({ surname: v })} />
                <Row label="Username" value={profile?.username || ''} editable={!demo} onSave={(v) => update?.({ username: v })} />
                <Row label="Email" value={profile?.email || ''} editable={!demo} onSave={(v) => update?.({ email: v })} />
                <Pressable onPress={openTheme} style={({ pressed }) => [styles.row, pressed && { opacity: 0.96 }]}>
                    <Text style={styles.rowLabel}>Tema</Text>
                    <Text style={styles.rowValue}>{theme}</Text>
                </Pressable>
            </View>
            <AvatarPickerSheet ref={avatarRef} />
            <ThemePickerSheet ref={themeRef} onPick={(t) => setTheme(t)} />
        </View>
    );
}

