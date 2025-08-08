# 🚀 Synapsy Finance — Fullstack Monorepo

Il tuo hub finanziario per tenere sotto controllo entrate, spese e operazioni ricorrenti… senza impazzire tra fogli Excel e ricevute volanti.  
Synapsy organizza le tue finanze in modo semplice, veloce e (quasi) divertente, con statistiche chiare e tutto sempre sincronizzato.

> ℹ️ **Nota:** Questa versione è ottimizzata per l'uso come **web app**.  
> 📱 Una versione **mobile** (iOS e Android) è già in sviluppo e sarà disponibile prossimamente, con sincronizzazione completa dei dati.

---

## 🔗 Demo online

**🚀 Prova ora Synapsy!**
👉 **Prova subito la web app qui:**  
[https://synapsy-frontend.vercel.app/](https://synapsy-frontend.vercel.app/)

> Puoi accedere in modalità demo per esplorare tutte le funzionalità senza registrazione!

<br/>

<img src="./Frontend-nextjs/public/images/ScreenS.webp" alt="Screenshot Synapsy" width="600" style="border-radius: 18px; box-shadow: 0 4px 16px #0002; margin-top: 10px;" />

---

## 📚 Indice

-   [📦 Backend API](Backend/docs/README.md)
-   [💻 Frontend Web](Frontend-nextjs/docs/README.md)
-   [🗺️ Site Structure](Frontend-nextjs/docs/SITE_STRUCTURE.md)

---

## 🛠️ Requisiti minimi

**Backend (Laravel 12)**

-   PHP 8.2+
-   Composer 2.5+
-   Estensioni PHP: `openssl`, `pdo`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`
-   Database: PostgreSQL 14+ (consigliato) — supporto anche per MySQL/MariaDB e SQLite (test)
-   Node.js 20+ e npm 10+ (per asset e sviluppo in locale)

**Frontend (Next.js 14)**

-   Node.js 20+ e npm 10+
-   Browser moderno (Chrome, Edge, Firefox, Safari)

---

## ⚡ Avvio rapido

```bash
git clone https://github.com/davide017017/Synapsy.git
cd Synapsy
```

### Backend

```bash
cd Backend
composer install
cp .env.example .env
php artisan migrate --seed
php artisan serve
```

### Frontend

```bash
cd Frontend-nextjs
npm install
cp .env.example .env
npm run dev
```

---

## 🔒 Protezione utente demo

Le operazioni di scrittura sono bloccate per l'utente demo tramite un middleware centralizzato (`PreventDemoUserModification`) applicato a rotte API, web e auth. La UI mostra un avviso e disabilita i controlli di modifica (tema, avatar, eliminazione account). Feature introdotta nel commit `426d9c0`.

---

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi [LICENSE](LICENSE).
