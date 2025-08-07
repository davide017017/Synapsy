# 💼 Synapsy Finance — Backend API

Gestione avanzata di entrate, spese e operazioni ricorrenti tramite API REST modulari Laravel.

---

## ⚙️ Panoramica
- CRUD completo per **Entrate** e **Spese**
- Gestione **ricorrenze** e **categorie** personalizzate
- API protette con **Laravel Sanctum**
- Suite di test automatizzati con SQLite in memoria

---

## 🚀 Avvio rapido
```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

---

## 🔒 Protezione utente demo
Un middleware centralizzato (`PreventDemoUserModification`) blocca qualsiasi richiesta di scrittura per l'utente `demo@synapsy.app`. Il middleware è registrato in `bootstrap/app.php` e applicato a rotte API, web, auth e reset password. Test automatici in `tests/Feature/DemoUserProtectionTest.php` verificano il blocco.

---

## 📚 Documentazione
- [📜 Rotte API](API_ROUTES.md)
- [🔐 Autenticazione](AUTH_FLOW.md)
- [🧪 Testing](TESTING.md)
- [🏗️ Architettura](ARCHITECTURE.md)
- [🗃️ Modelli dati](DATA_MODELS.md)
- [🔄 Flussi operativi](WORKFLOWS.md)
- [🛡️ Sicurezza](SECURITY.md)
- [📦 Migrations](MIGRATIONS.md)

---

## 📄 Licenza
Distribuito sotto licenza MIT.
