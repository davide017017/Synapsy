# 💼 Synapsi Finance — Backend API

> Gestione avanzata di entrate, spese e operazioni ricorrenti — **Laravel API modulare**.

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red?style=flat-square&logo=laravel)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-blue?style=flat-square&logo=php)](https://www.php.net/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey?style=flat-square&logo=sqlite)](https://www.sqlite.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## 📖 Descrizione

**Synapsi Finance** è un backend API completamente modulare, progettato per la gestione finanziaria personale e professionale:

-   CRUD completo su **entrate** e **spese**
-   **Operazioni ricorrenti** (cron, regole, intervalli)
-   **Categorie** personalizzate
-   Filtri avanzati e **report** via API
-   **Test automatizzati** (SQLite)

---

## 🚀 Funzionalità principali

-   ✅ Architettura Laravel **modulare** (`Modules/`)
-   🔁 Operazioni ricorrenti con logica personalizzabile
-   🔎 Filtro avanzato: data, categoria, tipo, stato
-   📊 API riepiloghi e dashboard
-   🧪 Suite test completa

---

## 🛠️ Requisiti

-   PHP 8.2+
-   Laravel 12.x
-   Composer
-   Node.js + npm (per asset Blade, opzionale)
 -   **PostgreSQL 15.x** (consigliato)
-   SQLite (per testing rapido)

---

## ⚡ Installazione

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

---

## 🧪 Testing

    php artisan test
    # oppure con coverage:
    php artisan test --coverage
📄 Documentazione
    Guida tecnica sviluppatori (README-dev)

    API Routes

    Checklist Deploy

---

## 🔗 Frontend Web

Per la dashboard e l’interfaccia utente consulta la README del frontend:

-   [🌈 Synapsi Finance — Frontend Web (Next.js)](../Frontend-nextjs/README.md)

## 📝 Licenza

Distribuito sotto licenza MIT.

