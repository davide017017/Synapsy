# 🌈 Synapsi Finance — Frontend Web (Next.js)

> Dashboard interattiva per la gestione finanziaria, collegata alle API Laravel.

---

## 🚀 Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Linguaggio:** TypeScript, React
-   **UI & Styling:** Tailwind CSS, Framer Motion
-   **API:** Laravel REST (Sanctum Auth)
-   **State Management:** Context API
-   **Altre dipendenze:** Lucide Icons, sonner (toasts), usehooks-ts

---

## 🖥️ Funzionalità principali

-   Gestione **entrate**, **spese** e **ricorrenze** in tempo reale
-   Calendario interattivo tipo Google Calendar
-   Dashboard riepilogativa e filtri avanzati
-   Modali custom per inserimento e modifica dati
-   **Tema scuro/chiaro** automatico
-   Responsive e mobile-first

---

## ⚡ Avvio rapido

1. **Sposta nella cartella frontend**

    ```bash
    cd frontend
    ```

2. **Installa le dipendenze**

    ```bash
    npm install
    ```

3. **Configura variabili ambiente**

    - Copia il file di esempio:  
      `cp .env.example .env`
    - Imposta `NEXT_PUBLIC_API_URL` con l'URL delle API backend Laravel.

4. **Avvia in sviluppo**
    ```bash
    npm run dev
    ```
    L'app sarà disponibile su [http://localhost:3000](http://localhost:3000)

---

## 🔒 Autenticazione

-   Il frontend si autentica via **Bearer Token** con le API Laravel (Sanctum).
-   Puoi collegare un utente demo dal backend, oppure registrarti tramite la UI.

---

## 📄 Note & Risorse

-   Personalizza temi e colori modificando `tailwind.config.js` e le variabili globali.
-   Consulta la [documentazione backend](../Backend/README.md) per dettagli sulle API disponibili.

---

## 🐛 Bug & feedback

Apri una Issue su GitHub o contatta il maintainer per segnalazioni e suggerimenti!

---

## 📝 Licenza

Distribuito sotto licenza MIT.
