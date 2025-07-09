# 💼 Synapsi Finance — Backend

> Gestione avanzata di entrate, spese e operazioni ricorrenti modulari in Laravel.

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red?style=flat-square&logo=laravel)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.4-blue?style=flat-square&logo=php)](https://www.php.net/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## 📖 Descrizione

**Synapsi Finance** è il backend API modulare, progettato per semplificare la gestione finanziaria personale e professionale, con supporto per:

-   Entrate e spese (CRUD)
-   Operazioni ricorrenti (cron, regole, intervalli)
-   Categorie personalizzate
-   Filtri avanzati e report
-   Test automatizzati (SQLite)

---

## 🚀 Funzionalità principali

-   ✅ Architettura Laravel modulare (`Modules/`)
-   🔁 Operazioni ricorrenti con logica personalizzabile
-   🔎 Filtro completo su data, categoria, tipo, stato
-   📊 API per viste riepilogative
-   🧪 Suite test completa

---

## 🛠️ Requisiti

-   PHP 8.2+
-   Laravel 12.x
-   Composer
-   Node.js + npm (per asset frontend, se usi Blade)
-   SQLite (per testing)

---

## 📦 Installazione

```bash
git clone https://github.com/davide017017/Synapsy.git
cd Synapsy/backend

composer install
npm install && npm run dev
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
