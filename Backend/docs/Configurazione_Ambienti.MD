# 🌐 Configurazione Ambienti — DEV Web (Synapsy)

## 🎯 Scenario

Sviluppo **solo Web** (Next.js + Laravel) **sulla stessa macchina**.  
Nessun accesso da mobile o device esterni.

---

## ✅ Regola chiave

**NextAuth esegue le fetch lato server (Node.js)**  
→ deve usare **URL sempre raggiungibili dal server locale**.

👉 **Usare `127.0.0.1` / `localhost`**, NON IP LAN.

---

## 🔧 Backend (`.env`)

```env
APP_URL=http://127.0.0.1:8484
SERVER_PORT=8484

FRONTEND_URL=http://localhost:3000
```

🔧 Frontend (.env.local)
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8484

❌ Cosa NON fare (in dev web)
NEXT_PUBLIC_API_BASE_URL=http://192.168.x.x:8484

Motivo:

Browser → può raggiungere IP LAN

NextAuth (server-side) → no, va in timeout

Risultato: fetch failed, 401, “Credenziali non valide”

🧠 Quando usare IP LAN (192.168.x.x)

Solo se:

sviluppo mobile / PWA su telefono

backend esposto con --host 0.0.0.0

CORS + firewall configurati

✅ Conclusione

Per sviluppo Web:

localhost / 127.0.0.1

meno problemi

flusso auth stabile

debug più veloce
