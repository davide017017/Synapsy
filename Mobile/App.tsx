// App.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap: AuthProvider + Navigation
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { CategoriesProvider } from './src/context/CategoriesContext';
import { TransactionsProvider } from './src/context/TransactionsContext';
import { UserProvider } from './src/context/UserContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <CategoriesProvider>
          <TransactionsProvider>
            <Navigation />
          </TransactionsProvider>
        </CategoriesProvider>
      </UserProvider>
    </AuthProvider>
  );
}
