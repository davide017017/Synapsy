// App.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap: AuthProvider + Navigation
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
