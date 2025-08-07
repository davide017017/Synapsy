# 🔐 Auth Flow

Gestione dell'autenticazione nel frontend.

---

## 🔑 Login
- richiesta a `/api/login`
- il token restituito viene salvato nello `localStorage`
- viene impostato l'header `Authorization` per le chiamate successive

## 🛡️ Protected Routes
- le pagine sensibili usano un `AuthGuard`
- se il token è assente si viene reindirizzati a `/login`

## 🚪 Logout
- rimuove il token e invalida la sessione sul backend

---
Esempio hook:
```ts
const { token, login, logout } = useAuth()
```
