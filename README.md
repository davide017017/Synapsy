# 🚀 Synapsi Finance — Fullstack Monorepo

**Gestione avanzata di entrate, spese e operazioni ricorrenti**  
Monorepo con **Laravel API backend** + **Next.js frontend**

---

## 📂 Struttura del progetto

/
├── backend/ # API RESTful Laravel 12.x (gestione dati e logica di business)
├── Frontend-nextjs/ # Web app Next.js 15 (dashboard, UI, autenticazione)
├── docs/ # Documentazione tecnica e guide
├── LICENSE
├── README.md # (questo file)

---

## 🌐 Tecnologie principali

-   **Backend:** [Laravel 12.x](https://laravel.com/) (PHP 8.2+)
-   **Frontend:** [Next.js 15](https://nextjs.org/) (React, TypeScript, Tailwind CSS)
 -   **Database:** PostgreSQL / SQLite (testing)
-   **Autenticazione:** Laravel Sanctum (API Token)

---

## ⚡ Come iniziare

1. **Clona il repository**

    ```bash
    git clone https://github.com/davide017017/Synapsy.git
    cd Synapsy
    ```

2. **Setup Backend**

    ```bash
    cd Backend
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate --seed
    composer test
    cd ..
    ```

    Per maggiori dettagli consulta [`Backend/README.md`](Backend/README.md)

3. **Setup Frontend**

    ```bash
    cd Frontend-nextjs
    npm install
    cp .env.example .env
    # Configura API_URL e variabili necessarie
    npm run dev
    ```

---

## 🔗 Frontend Web

Per la dashboard e l’interfaccia utente consulta il README del frontend:

-   [🌈 Synapsi Finance — Frontend Web (Next.js)](Frontend-nextjs/README.md)

## 📸 Screenshot

![Screenshot di Synapsi Finance](/Frontend-nextjs/public/images/ScreenS.png)

---

## 📄 Licenza

Distribuito sotto licenza MIT.  
Vedi il file [LICENSE](LICENSE) per i dettagli.

---

## 📚 Risorse aggiuntive

-   [Documentazione tecnica (backend)](Backend/docs/README-dev.md)
-   [Esport API (rotte)](Backend/docs/routes_api_export.md)
-   [Checklist deploy](Backend/docs/deploy-checklist.md)

---

## 🤝 Contributi

Pull Request e segnalazioni sono benvenute!  
Apri una issue per bug, domande o suggerimenti.

---
