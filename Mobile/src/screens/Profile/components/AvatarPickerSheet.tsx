// src/screens/Profile/components/AvatarPickerSheet.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Bottom sheet per selezione avatar (mock)
// ─────────────────────────────────────────────────────────────────────────────
import React, { forwardRef } from 'react';
import { Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/context/UserContext';
import { COLORS } from '../styles';

const AVATARS = ['person-circle', 'planet', 'happy', 'rocket', 'sparkles', 'bulb'];

const AvatarPickerSheet = forwardRef<BottomSheetModal>((props, ref) => {
    const { update } = useUser();
    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={['40%']}
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
            <BottomSheetView style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {AVATARS.map((name) => (
                    <Pressable
                        key={name}
                        onPress={() => {
                            update?.({ avatar: name });
                            (ref as any)?.current?.dismiss();
                        }}
                        style={{ padding: 8 }}
                    >
                        <Ionicons name={name as any} size={40} color="#eaf5ee" />
                    </Pressable>
                ))}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default AvatarPickerSheet;

