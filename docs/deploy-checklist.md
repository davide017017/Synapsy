# ✅ Deploy & CI Checklist

> Verifica da eseguire prima di rilasciare in produzione o staging.

---

## ✅ Test e Dipendenze

- [ ] **Tutti i test superati:** Assicurati che l'intera suite di test passi senza errori.
    ```bash
    php artisan test
    ```
- [ ] **Dipendenze installate senza dev:** Installa le dipendenze per l'ambiente di produzione, escludendo quelle di sviluppo.
    ```bash
    composer install --no-dev
    ```

---

## ⚙️ Configurazione Ambiente

- [ ] **File `.env` configurato correttamente:** Verifica che il file `.env` sia ottimizzato per l'ambiente di `production`.
- [ ] **Cache di configurazione:** Ottimizza le performance dell'applicazione con la cache.
    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

---

## 🧱 Assets e Permessi

- [ ] **Assets compilati:** Compila i tuoi asset frontend (CSS, JS, ecc.).
    ```bash
    npm run build
    ```
- [ ] **Permessi su storage e logs:** Assicurati che le directory `storage` e `logs` abbiano i permessi di scrittura corretti.
    ```bash
    chmod -R 775 storage
    ```

---

## 🗃️ Database

- [ ] **Migrazioni eseguite (se necessario):** Applica le migrazioni del database se ci sono nuove tabelle o modifiche allo schema.
    ```bash
    php artisan migrate
    ```
- [ ] **Seeder eseguiti (se richiesto):** Esegui i seeder se è necessario popolare il database con dati iniziali.
    ```bash
    php artisan db:seed
    ```

---

## 🛡️ Monitoraggio

- [ ] **Sistema di monitoraggio attivo:** Verifica che il sistema di monitoraggio (es. Laravel Telescope, Sentry, ecc.) sia configurato e funzionante per rilevare eventuali problemi.