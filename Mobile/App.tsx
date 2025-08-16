// ─────────────────────────────────────────────────────────────────────────────
// Entry per React Navigation: IMPORT obbligatorio PRIMA di tutto
// ─────────────────────────────────────────────────────────────────────────────
import "react-native-gesture-handler";

import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import Navigation from "./src/navigation";

export default function App() {
    return (
        <AuthProvider>
            <Navigation />
        </AuthProvider>
    );
}
