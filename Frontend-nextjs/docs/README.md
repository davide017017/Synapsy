# 🌈 Synapsy Finance — Frontend Web

Interfaccia Next.js/React per la gestione finanziaria collegata alle API Laravel.

---

## ⚙️ Panoramica
- Next.js 15 con App Router
- TypeScript, Tailwind CSS e Framer Motion
- Gestione entrate, spese e ricorrenze
- Tema chiaro/scuro automatico

---

## 📄 Struttura pagine
L'alberatura completa con componenti e modali è descritta in [SITE_STRUCTURE.md](SITE_STRUCTURE.md).

Pagine principali:
- `/` Home
- `/transazioni`
- `/ricorrenti`
- `/categorie`
- `/panoramica`
- `/profilo`
- `/login`
- `/reset-password`

---

## 🚀 Avvio rapido
```bash
cd Frontend-nextjs
npm install
cp .env.example .env
npm run dev
```
L'app è disponibile su [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentazione
- [🔐 Auth Flow](AUTH_FLOW.md)
- [🧩 Componenti](COMPONENTS.md)
- [🔌 API Usage](API_USAGE.md)
- [🎨 Temi](THEMES.md)
- [🧪 Testing](TESTING.md)
- [🔄 Workflows](WORKFLOWS.md)
- [🚀 Deploy](DEPLOY.md)
- [🗺️ Struttura del sito](SITE_STRUCTURE.md)

---

## 🔒 Protezione utente demo
Le operazioni di scrittura sono bloccate per l'utente demo. L'interfaccia mostra un avviso e disabilita i controlli (tema, avatar, eliminazione account). Feature introdotta nel commit `426d9c0` con il middleware `PreventDemoUserModification` e gli aggiornamenti in `ProfilePage.tsx`.

---

## 📄 Licenza
Distribuito sotto licenza MIT.
