# 🌈 Synapsi Finance — Frontend Web (Next.js)

> Dashboard interattiva per la gestione finanziaria, collegata alle API Laravel.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.x-black?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](../backend/LICENSE)

---

## 📖 Descrizione

Frontend **Next.js**/React per Synapsi Finance — visualizza, filtra e gestisci **entrate**, **spese** e **ricorrenze** collegate via API al backend Laravel.

---

## 🚀 Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Linguaggio:** TypeScript, React
-   **UI & Styling:** Tailwind CSS, Framer Motion
-   **API:** Laravel REST (Sanctum Auth)
-   **State Management:** Context API
-   **Altre dipendenze:** Lucide Icons, sonner (toast), usehooks-ts

---

## 🖥️ Funzionalità principali

-   Gestione **entrate**, **spese** e **ricorrenze** in tempo reale
-   Calendario interattivo stile Google Calendar
-   Dashboard riepilogativa e filtri avanzati
-   Modali custom per inserimento e modifica dati
-   **Tema scuro/chiaro** automatico
-   Responsive e mobile-first

---

## ⚡ Avvio rapido

1. **Spostati nella cartella Frontend-nextjs**

    ```bash
    cd Frontend-nextjs
    ```

2. **Installa le dipendenze**

    ```bash
    npm install
    ```

3. **Configura le variabili ambiente**

    - Copia il file di esempio:  
      `cp .env.example .env`
    - Imposta `NEXT_PUBLIC_API_URL` con l'URL delle API backend Laravel

4. **Avvia in sviluppo**

    ```bash
    npm run dev
    ```

    L'app sarà disponibile su [http://localhost:3000](http://localhost:3000)

---

## 🔒 Autenticazione

-   Il frontend si autentica via **Bearer Token** con le API Laravel (Sanctum)
-   Puoi collegare un utente demo dal backend oppure registrarti tramite la UI

---

## 📄 Note & Risorse

-   Personalizza temi e colori modificando `tailwind.config.js` e le variabili globali
-   Consulta la [documentazione backend](../Backend/README.md) per le API disponibili

---

## 🐛 Bug & feedback

Apri una **Issue** su GitHub o contatta il maintainer per segnalazioni e suggerimenti!

---

## 📝 Licenza

Distribuito sotto licenza [MIT](../Backend/LICENSE).

