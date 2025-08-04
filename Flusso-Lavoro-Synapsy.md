# 🚦 Flusso di Lavoro Synapsi - Main/Beta, DB, Backend, Frontend

## 1. Database

-   **DB Online (cloud):**
    -   Modificabile solo **switchando l’ambiente backend su `.env.beta`** e lanciando eventuali migration/seeder/operazioni mirate.
-   **DB Locale:**
    -   Usato sempre durante lo sviluppo locale, con `.env.local`.

---

## 2. Backend (Laravel)

-   **Deploy e aggiornamento:**
    -   Il backend online si aggiorna **solo** quando fai push sul branch `beta` di GitHub (collegato al deploy cloud).
-   **Sviluppo:**
    -   Quando lavori in locale, salvi sempre su `main`.
    -   Il backend online (beta) **NON viene mai toccato** dal tuo sviluppo locale, se resti su `main`.

---

## 3. Frontend (Next.js)

-   **Deploy e aggiornamento:**
    -   Il frontend online si aggiorna **solo** quando fai push sul branch `beta` di GitHub (collegato al deploy cloud).
-   **Sviluppo:**
    -   Sviluppi e committi sempre su `main`.
    -   Il frontend online (beta) **NON viene mai toccato** dal tuo sviluppo locale, se resti su `main`.

---

## 4. Flusso consigliato

1. **Sviluppo normale:**

    - Stai su branch `main` sia backend che frontend.
    - Usi `.env.local` → lavori su DB locale.
    - Modifichi/correggi/testi senza toccare la versione beta online.

2. **Aggiornamento della beta (deploy):**

    - Quando sei sicuro, **passi sul branch `beta`**:
        git checkout beta
        git merge main
        git push origin beta
    - Così **sincronizzi la beta** con tutte le modifiche più recenti.
    - Il backend e frontend online si aggiornano col nuovo deploy.

3. **Torna su `main`** per continuare lo sviluppo quotidiano:

    git checkout main

---

## 5. Note importanti

-   **Mai lavorare direttamente su `beta`!**  
    Sviluppa solo su `main`, il branch beta serve solo per aggiornare la demo/deploy.
-   **Lo switch dell'ambiente (`.env.local`/`.env.beta`) serve solo per decidere su quale DB lavorare!**
-   **Usa sempre il DB locale durante lo sviluppo**, e switcha su beta solo se vuoi aggiornare/popolare/resetare il DB online.

---

## Riepilogo comandi utili

```bash
# Switch ambiente backend (PowerShell)
.\switch-env.ps1 local   # ambiente locale (DB locale)
.\switch-env.ps1 beta    # ambiente beta  (DB online)

# Aggiorna la beta (deploy branch beta)
git checkout beta
git merge main
git push origin beta

# Torna a sviluppare su main
git checkout main
```

