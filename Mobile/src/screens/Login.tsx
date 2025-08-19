// src/screens/Login.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Login stile "glass card" — fix: sfondo/overlay non intercettano i tocchi
// + Toggle visibilità password con icona "occhio"
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
    Image,
    Modal,
    Pressable,
    Platform,
    Switch,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { shadowLg, shadowMd, shadowSm } from "../ui/shadow";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// Tipi
// ─────────────────────────────────────────────────────────────────────────────
type FormData = { email: string; password: string };
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

// ─────────────────────────────────────────────────────────────────────────────
// Bottone gradient con icona
// ─────────────────────────────────────────────────────────────────────────────
type GButtonProps = {
    title: string;
    icon: IoniconName;
    colors?: [string, string];
    onPress: () => void;
    disabled?: boolean;
    style?: any;
};
function GradientButton({ title, icon, colors = ["#0d8f6e", "#49c0a2"], onPress, disabled, style }: GButtonProps) {
    return (
        <Pressable
            onPress={() => {
                if (!disabled) onPress();
            }}
            style={({ pressed }) => [{ opacity: disabled ? 0.7 : pressed ? 0.9 : 1 }, style]}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            <LinearGradient colors={colors} start={{ x: 0.05, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gbtn}>
                <Ionicons name={icon} size={18} color="#fff" />
                <Text style={styles.gbtnText}>{title}</Text>
            </LinearGradient>
        </Pressable>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function Login() {
    const { login } = useAuth();
    const pwdRef = useRef<TextInput>(null);

    const [serverError, setServerError] = useState<string | null>(null);
    const [showReg, setShowReg] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [remember, setRemember] = useState(true);

    // ── Stato: mostra/nascondi password ──
    const [showPwd, setShowPwd] = useState(false);
    const eyeIcon: IoniconName = showPwd ? "eye-off-outline" : "eye-outline";

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: { email: "test@example.com", password: "" },
        mode: "onChange",
    });

    // ── Submit ────────────────────────────────────────────────────────────────
    const onSubmit = handleSubmit(async (data) => {
        setServerError(null);
        Keyboard.dismiss();
        try {
            await login(data.email.trim(), data.password);
            // TODO: persist email se remember === true (AsyncStorage)
        } catch (e: any) {
            setServerError(e?.message ?? "Credenziali non valide");
        }
    });

    // ── Demo login ────────────────────────────────────────────────────────────
    async function handleDemoLogin() {
        await login("demo@synapsy.app", "demo");
    }

    return (
        // Nota: box-none per non far “mangiare” tocchi a wrapper non interattivi
        <View style={styles.root} pointerEvents="box-none">
            {/* SFONDO (non intercetta tocchi) */}
            <View style={styles.bgWrap} pointerEvents="none">
                <Image source={require("../../assets/images/bg-login.webp")} style={styles.bgImg} resizeMode="cover" />
            </View>

            {/* OVERLAY SCURO (non intercetta tocchi) */}
            <View style={styles.overlay} pointerEvents="none" />

            {/* ── CARD CENTRALE ──────────────────────────────────────────────────── */}
            <View style={styles.card}>
                <Text style={styles.title}>Accedi a Synapsi</Text>

                {/* EMAIL ───────────────────────────────────────────────────────────── */}
                <View style={styles.inputWrap}>
                    <Ionicons name="mail-outline" size={18} color="#111827" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: "Email richiesta",
                            pattern: { value: /\S+@\S+\.\S+/, message: "Email non valida" },
                        }}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="none"
                                autoComplete="email"
                                keyboardType="email-address"
                                placeholder="test@example.com"
                                placeholderTextColor="#9aa1aa"
                                returnKeyType="next"
                                onSubmitEditing={() => pwdRef.current?.focus()}
                                style={[styles.input, { paddingLeft: 42 }, errors.email && styles.inputError]}
                            />
                        )}
                    />
                </View>
                {errors.email ? <Text style={styles.error}>{errors.email.message}</Text> : null}

                {/* PASSWORD + TOGGLE OCCHIO ────────────────────────────────────────── */}
                <View style={styles.inputWrap}>
                    <Ionicons name="lock-closed-outline" size={18} color="#111827" style={styles.inputIcon} />

                    {/* ── TextInput password ── */}
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: "Password richiesta",
                            minLength: { value: 6, message: "Minimo 6 caratteri" },
                        }}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput
                                ref={pwdRef}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="none"
                                autoComplete="password"
                                textContentType="password"
                                secureTextEntry={!showPwd}
                                placeholder="Password"
                                placeholderTextColor="#9aa1aa"
                                returnKeyType="done"
                                onSubmitEditing={onSubmit}
                                style={[
                                    styles.input,
                                    { paddingLeft: 42, paddingRight: 42 }, // spazio per icona destra
                                    errors.password && styles.inputError,
                                ]}
                            />
                        )}
                    />

                    {/* ── Toggle visibilità (occhio) ── */}
                    <Pressable
                        onPress={() => setShowPwd((v) => !v)}
                        hitSlop={12}
                        style={styles.inputIconRight}
                        accessibilityRole="button"
                        accessibilityLabel={showPwd ? "Nascondi password" : "Mostra password"}
                    >
                        <Ionicons name={eyeIcon} size={18} color="#6b7280" />
                    </Pressable>
                </View>
                {errors.password ? <Text style={styles.error}>{errors.password.message}</Text> : null}

                {/* RICORDA EMAIL ───────────────────────────────────────────────────── */}
                <View style={styles.rememberRow}>
                    <Switch
                        value={remember}
                        onValueChange={setRemember}
                        trackColor={{ false: "#2e2e2e", true: "#176b54" }}
                        thumbColor={remember ? "#32d4a4" : "#bfbfbf"}
                    />
                    <Text style={styles.rememberText}>Ricorda la mia e-mail</Text>
                </View>

                {/* ERRORE SERVER ───────────────────────────────────────────────────── */}
                {serverError ? <Text style={[styles.error, { marginTop: 6 }]}>{serverError}</Text> : null}

                {/* CTA LOGIN ───────────────────────────────────────────────────────── */}
                <GradientButton
                    title={isSubmitting ? "Accesso…" : "Accedi"}
                    icon="enter-outline"
                    onPress={() => {
                        if (!isSubmitting) onSubmit();
                    }}
                    disabled={isSubmitting}
                    style={{ marginTop: 10 }}
                />
                {isSubmitting ? <ActivityIndicator color="#fff" style={{ marginTop: 10 }} /> : null}

                {/* LINK SECONDARI ─────────────────────────────────────────────────── */}
                <View style={styles.secondaryRow}>
                    <Pressable
                        onPress={() => setShowForgot(true)}
                        style={styles.secondaryLinkRow}
                        accessibilityRole="button"
                    >
                        <Ionicons name="lock-closed" size={14} color="#22c08a" />
                        <Text style={styles.secondaryLink}> Password dimenticata?</Text>
                    </Pressable>

                    <View style={{ height: 8 }} />

                    <Text style={styles.secondaryText}>
                        Non hai un account?{" "}
                        <Text style={styles.secondaryLink} onPress={() => setShowReg(true)}>
                            Registrati
                        </Text>
                    </Text>
                </View>
            </View>

            {/* ── BOTTONE DEMO ───────────────────────────────────────────────────── */}
            <GradientButton
                title="Accedi come demo"
                icon="key-outline"
                onPress={handleDemoLogin}
                colors={["#b3126a", "#ff678f"]}
                style={styles.demoWrapper}
            />

            {/* ── LEGALI (pill) ──────────────────────────────────────────────────── */}
            <View style={styles.legalBar} pointerEvents="box-none">
                <Pressable style={styles.pill}>
                    <Ionicons name="shield-checkmark-outline" size={14} color="#d1d5db" />
                    <Text style={styles.pillText}> Privacy</Text>
                </Pressable>
                <Pressable style={styles.pill}>
                    <Ionicons name="document-text-outline" size={14} color="#d1d5db" />
                    <Text style={styles.pillText}> Termini</Text>
                </Pressable>
            </View>

            {/* ── MODAL REGISTRAZIONE ────────────────────────────────────────────── */}
            <Modal visible={showReg} transparent animationType="fade" onRequestClose={() => setShowReg(false)}>
                <View style={styles.modalBackdrop} pointerEvents="box-none">
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Registrazione</Text>
                        <Text style={styles.modalBody}>TODO: form di registrazione</Text>
                        <GradientButton title="Chiudi" icon="close-outline" onPress={() => setShowReg(false)} />
                    </View>
                </View>
            </Modal>

            {/* ── MODAL PASSWORD DIMENTICATA ─────────────────────────────────────── */}
            <Modal visible={showForgot} transparent animationType="fade" onRequestClose={() => setShowForgot(false)}>
                <View style={styles.modalBackdrop} pointerEvents="box-none">
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Recupero password</Text>
                        <Text style={styles.modalBody}>
                            TODO: inserisci la tua e-mail e riceverai un link per reimpostare la password.
                        </Text>
                        <GradientButton title="Chiudi" icon="close-outline" onPress={() => setShowForgot(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stili
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, alignItems: "center", justifyContent: "center" },

    bgWrap: {
        ...StyleSheet.absoluteFillObject, // wrapper assoluto non interattivo
    },

    // sfondo pieno — non interattivo
    bgImg: {
        width: "100%",
        height: "100%",
        ...(Platform.OS === "web" ? ({ objectPosition: "50% 50%" } as any) : null),
    },

    // overlay scuro pieno — non interattivo
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.6)",
    },

    // card centrale (glass dark)
    card: {
        width: "92%",
        maxWidth: 520,
        padding: 18,
        borderRadius: 18,
        backgroundColor: "rgba(0,0,0,0.55)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        ...shadowLg,
    },

    title: {
        color: "#eaf5ee",
        fontSize: 22,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 14,
    },

    // input + icona
    inputWrap: { position: "relative", marginTop: 8 },

    // icona sinistra sopra l'input
    inputIcon: {
        position: "absolute",
        left: 14,
        top: 14,
        zIndex: 2, // ★ sopra
        pointerEvents: "none", // ★ non blocca i tap sull'input
    },

    input: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.14)",
        backgroundColor: "rgba(255,255,255,0.95)",
        color: "#111827",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontSize: 14,
        zIndex: 1,
    },
    // icona destra (occhio) sopra l'input
    inputIconRight: {
        position: "absolute",
        right: 14,
        top: 14,
        zIndex: 2, // ★
    },

    inputError: { borderColor: "#ef4444" },
    error: { color: "#fca5a5", fontSize: 12, marginTop: 4 },

    // remember
    rememberRow: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 10 },
    rememberText: { color: "#d1fae5", fontSize: 12 },

    // bottone gradient
    gbtn: {
        height: 44,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        ...shadowMd,
    },
    gbtnText: { color: "#fff", fontWeight: "700" },

    // link secondari
    secondaryRow: { marginTop: 12, alignItems: "center" },
    secondaryText: { color: "#e5f3ee", fontSize: 12 },
    secondaryLinkRow: { flexDirection: "row", alignItems: "center" },
    secondaryLink: { color: "#22c08a", fontWeight: "700" },

    // bottone demo sotto la card
    demoWrapper: { width: "92%", maxWidth: 520, marginTop: 16 },

    // barra legale in basso
    legalBar: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        gap: 12,
    },
    pill: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    pillText: { color: "#d1d5db" },

    // modali
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalCard: {
        width: "100%",
        maxWidth: 480,
        borderRadius: 16,
        backgroundColor: "#0b0f12",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        padding: 16,
        gap: 12,
        ...shadowSm,
    },
    modalTitle: { color: "#eaf5ee", fontSize: 18, fontWeight: "800" },
    modalBody: { color: "#d1d5db" },
});
