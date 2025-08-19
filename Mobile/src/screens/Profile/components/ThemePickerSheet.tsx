// src/screens/Profile/components/ThemePickerSheet.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Bottom sheet per selezione tema (mock)
// ─────────────────────────────────────────────────────────────────────────────
import React, { forwardRef } from 'react';
import { Pressable, Text } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { COLORS } from '../styles';

const THEMES = ['chiaro', 'scuro', 'emerald'];

interface Props { onPick: (t: string) => void }

const ThemePickerSheet = forwardRef<BottomSheetModal, Props>(({ onPick }, ref) => {
    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={['30%']}
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
            <BottomSheetView style={{ padding: 16, gap: 12 }}>
                {THEMES.map((t) => (
                    <Pressable
                        key={t}
                        onPress={() => {
                            onPick(t);
                            (ref as any)?.current?.dismiss();
                        }}
                        style={({ pressed }) => [
                            { padding: 12, borderRadius: 8 },
                            pressed && { backgroundColor: 'rgba(255,255,255,0.06)' },
                        ]}
                    >
                        <Text style={{ color: COLORS.text, fontWeight: '600' }}>{t}</Text>
                    </Pressable>
                ))}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default ThemePickerSheet;

