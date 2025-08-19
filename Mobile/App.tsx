// App.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap root: gesture + bottom-sheet + providers + navigation
// ─────────────────────────────────────────────────────────────────────────────

// 1) Gesture Handler DEVE essere importato come side-effect e PRIMA di tutto
import "react-native-gesture-handler";

import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./src/context/AuthContext";
import { CategoriesProvider } from "./src/context/CategoriesContext";
import { TransactionsProvider } from "./src/context/TransactionsContext";
import { UserProvider } from "./src/context/UserContext";
import Navigation from "./src/navigation";

// 2) Reanimated: side-effect import consigliato come ULTIMO import
import "react-native-reanimated";

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
    return (
        // Root assoluto per le gesture (necessario per @gorhom/bottom-sheet)
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Gestione notch / status bar iOS/Android */}
            <SafeAreaProvider>
                {/* Provider per i BottomSheet (può stare anche più in basso, ma qui è globale) */}
                <BottomSheetModalProvider>
                    {/* I tuoi providers applicativi */}
                    <AuthProvider>
                        <UserProvider>
                            <CategoriesProvider>
                                <TransactionsProvider>
                                    {/* Navigazione principale */}
                                    <Navigation />
                                </TransactionsProvider>
                            </CategoriesProvider>
                        </UserProvider>
                    </AuthProvider>
                </BottomSheetModalProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
