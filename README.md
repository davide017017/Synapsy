# 🚀 Synapsy Finance — Fullstack Monorepo

Gestione avanzata di entrate, spese e operazioni ricorrenti.

**🚀 Prova ora Synapsy!**

---

## 📚 Indice
- [📦 Backend API](Backend/docs/README.md)
- [💻 Frontend Web](Frontend-nextjs/docs/README.md)

---

## 🛠️ Requisiti minimi
- PHP 8.2+
- Node.js 20+
- PostgreSQL (oppure SQLite per i test)

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

## 🔗 Demo
- Email demo: `demo@synapsy.app`
- Password: `demo`

---

## 📄 Licenza
Distribuito sotto licenza MIT. Vedi [LICENSE](LICENSE).
