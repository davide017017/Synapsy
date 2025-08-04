# 🛠️ Gestione Ambienti e Branch - Synapsi

## Ambienti di sviluppo

### 1. **Ambiente LOCAL**

-   **File**: `.env.local`
-   **Uso**: Sviluppo e test in locale, senza toccare il database o i servizi online.
-   **Avvio**:

    ```powershell

    # PowerShell (VS Code/Windows)
    .\switch-env.ps1 local

    ```

-   **Risultato**: Tutto gira in locale, nessun rischio di modificare dati online.

---

### 2. **Ambiente BETA**

-   **File**: `.env.beta`
-   **Uso**: Solo per operazioni specifiche sul database beta/online (es. seed/reset demo).
-   **Avvio**:
    ```powershell
    .\switch-env.ps1 beta
    ```
-   **Risultato**: Il backend locale si collega al database cloud (ATTENZIONE: le modifiche si riflettono online!).

**NB:** Non usare `beta` per sviluppo normale, solo per operazioni consapevoli (es. popolare dati demo, debugging online, ecc.).

---

### 3. **Ambiente Online (Cloud/Production/Beta)**

-   **Backend online**: Usa SEMPRE le variabili d'ambiente impostate su Render (o piattaforma cloud).
-   **Frontend online**: Usa le variabili impostate su Vercel (o piattaforma scelta).
-   **Deploy**: Si aggiorna solo tramite merge/commit su GitHub.

---

## Comandi rapidi per cambiare ambiente

```powershell
# Attiva ambiente locale
.\switch-env.ps1 local

# Attiva ambiente beta (backend locale → DB cloud!)
.\switch-env.ps1 beta
```

---

## Gestione dei Branch

    Sviluppo e mantenimento
    main: branch di sviluppo principale, contiene sempre il codice più aggiornato e stabile.

    beta: branch separato collegato al deploy beta (sia backend che frontend).

    Serve a testare/mostrare la demo pubblica, senza toccare direttamente il main a meno di volerlo esplicitamente.

    Come aggiornare il branch beta con le novità dal main
    Passaggi consigliati:

# 1. Assicurati di essere su main

    git checkout main

# 2. Aggiorna il main da remoto (opzionale)

    git pull origin main

# 3. Passa al branch beta

    git checkout beta

# 4. Unisci le modifiche di main su beta

    git merge main

# 5. Risolvi eventuali conflitti e testa

# (consigliato: npm run build/test, composer test, ecc.)

# 6. Pusha il branch beta aggiornato

    git push origin beta

In questo modo: sviluppi e testi tutto su main, aggiorni il beta solo quando vuoi, tenendo la demo/beta sempre sotto controllo.

Note di sicurezza
Non usare mai beta per sviluppare: rischio di modificare dati reali!

Attenzione ai comandi artisan migrate/seed/reset su ambiente beta.

Le variabili d'ambiente dei servizi cloud NON vengono mai sovrascritte da quelle locali.

Consiglio:
Aggiungi a .gitignore tutti i file .env\* tranne .env.example!

Se vuoi aggiungere ambienti extra (es. prod, staging) basta copiare il sistema.
yaml

---

