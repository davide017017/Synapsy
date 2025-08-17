// src/components/shared/Button.tsx
import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
};

export default function Button({ title, onPress, disabled, style }: Props) {
    return (
        <Pressable
            onPress={disabled ? undefined : onPress}
            style={[styles.btn, disabled && styles.disabled, style]}
            accessibilityState={{ disabled }}
        >
            <Text style={styles.label}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: "#222",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: "center",
    },
    disabled: { opacity: 0.5 },
    label: { color: "#fff", fontWeight: "600" },
});
