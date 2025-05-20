# 💼 Synapsi Finance

> Gestione avanzata di entrate, spese e operazioni ricorrenti modulari in Laravel.

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red?style=flat-square&logo=laravel)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.4-blue?style=flat-square&logo=php)](https://www.php.net/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://www.google.com/search?q=LICENSE)

---

## 📖 Descrizione

**Synapsi Finance** è un'applicazione Laravel modulare progettata per semplificare la gestione finanziaria personale e professionale, con supporto completo per:

-   Entrate e spese
-   Operazioni ricorrenti (cron, regole, intervalli)
-   Categorie personalizzate
-   Filtri avanzati e report
-   Test automatizzati su SQLite

---

## 🚀 Funzionalità principali

-   ✅ Architettura modulare (`Modules/`)
-   🔁 Operazioni ricorrenti con logica personalizzabile
-   🔎 Filtro completo su data, categoria, tipo, stato
-   📊 Vista riepilogativa entrate/spese
-   🧪 Suite test completa e performante

---

## 📸 Screenshot

![Screenshot di Synapsi Finance](docs/Synapsi-Screenshot.png)

---

## 🛠️ Requisiti

-   PHP 8.2+
-   Laravel 12.x
-   Composer
-   Node.js + npm (per asset frontend)
-   SQLite (per testing)

---

## 📦 Installazione

```bash
git clone https://github.com/davide017017/Synapsy.git
cd Synapsy

composer install
npm install && npm run dev

cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

---

## 🧪 Esecuzione test

```bash
php artisan test
```

Per copertura:

```bash
php artisan test --coverage
```

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza **MIT**. Vedi il file [LICENSE](LICENSE).

---

## 🤝 Contribuire

Le PR sono benvenute! Per bug o suggerimenti, apri una issue.

## 📚 Documentazione

Approfondisci il progetto con la nostra documentazione dedicata:

- [Guida tecnica sviluppatori (README-dev)](docs/README-dev.md)
- [API Routes](docs/routes_api_export.md)
- [Checklist Deploy](docs/deploy-checklist.md)
