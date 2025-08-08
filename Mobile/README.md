# Synapsy Mobile

Base Expo + React Native per l'app mobile Synapsy.

## Prerequisiti
- [Node.js 20+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio con SDK/Emulatore
- Xcode (solo macOS per build iOS)

## Setup
```bash
cp .env.example .env
# editare .env e impostare API_BASE_URL
npm install
```

## Avvio
```bash
npx expo start
```
Scansiona il QR o usa `a` per Android, `i` per iOS, `w` per Web.

## Ambienti
Modifica `APP_ENV` e `API_BASE_URL` nel `.env` per dev/beta/prod.

## Autenticazione
- Login via API con token JWT/Bearer.
- Il token è salvato in SecureStore e inviato in `Authorization`.
- Se l'API risponde 401 il token viene rimosso e l'utente torna al login.

## Struttura Cartelle
- `src/app` – entry points (login, tabs)
- `src/navigation` – stack + bottom tabs
- `src/screens` – schermate principali
- `src/context` – contesti React (Auth)
- `src/lib` – helper (api, env)
- `src/components` – componenti riutilizzabili
- `src/types` – definizioni TypeScript
- `src/theme` – token grafici

## Build
Per build native usare [EAS](https://docs.expo.dev/build/introduction/).
Comandi rapidi:
```bash
npm run android
npm run ios
```

## Sicurezza
- Non committare `.env` né segreti.
- Il token è salvato in storage sicuro.

## Limitazioni MVP
- Niente push notification.
- Niente refresh token.
- Liste e CRUD sono placeholder da collegare al backend.

## Smoke Test
1. Login con utente valido o demo.
2. Visualizza Transactions del mese corrente (mock).
3. Crea/Modifica/Elimina elemento (solo lato UI).
4. Profilo mostra dati utente e permette il logout.
5. Simula 401: rimuovere token manualmente ⇒ ritorno al login.
