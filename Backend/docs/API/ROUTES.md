<!-- ─────────────────────────────────────────────────────────────────────────────
  Documento: docs/API/ROUTES.md
  Scopo: elenco rotte API (generato automaticamente) — non modificare a mano
────────────────────────────────────────────────────────────────────────────── -->

> ⚠️ **Documento generato automaticamente**
> Rigenera con:

```bash
php artisan routes:export-api-json --path=docs/API/ROUTES.json --prefix=/api/v1
php artisan routes:export-api-md   --path=docs/API/ROUTES.md   --prefix=/api/v1
```

# 📜 API Routes

## 🧩 Modulo: `audittrails`

---

| Method     | URI                              | Name                    | Action                                                             |
| ---------- | -------------------------------- | ----------------------- | ------------------------------------------------------------------ |
| GET        | `api/v1/audittrails`             | api.audittrails.index   | `Modules\AuditTrail\Http\Controllers\AuditTrailController@index`   |
| POST       | `api/v1/audittrails`             | api.audittrails.store   | `Modules\AuditTrail\Http\Controllers\AuditTrailController@store`   |
| GET        | `api/v1/audittrails/{audit_log}` | api.audittrails.show    | `Modules\AuditTrail\Http\Controllers\AuditTrailController@show`    |
| PUT\|PATCH | `api/v1/audittrails/{audit_log}` | api.audittrails.update  | `Modules\AuditTrail\Http\Controllers\AuditTrailController@update`  |
| DELETE     | `api/v1/audittrails/{audit_log}` | api.audittrails.destroy | `Modules\AuditTrail\Http\Controllers\AuditTrailController@destroy` |

## 🧩 Modulo: `avatars`

---

| Method | URI              | Name | Action    |
| ------ | ---------------- | ---- | --------- |
| GET    | `api/v1/avatars` | api. | `Closure` |

## 🧩 Modulo: `categories`

---

| Method | URI                            | Name                   | Action                                                                |
| ------ | ------------------------------ | ---------------------- | --------------------------------------------------------------------- |
| GET    | `api/v1/categories`            | api.categories.index   | `Modules\Categories\Http\Controllers\CategoriesController@indexApi`   |
| POST   | `api/v1/categories`            | api.categories.store   | `Modules\Categories\Http\Controllers\CategoriesController@storeApi`   |
| GET    | `api/v1/categories/{category}` | api.categories.show    | `Modules\Categories\Http\Controllers\CategoriesController@showApi`    |
| PUT    | `api/v1/categories/{category}` | api.categories.update  | `Modules\Categories\Http\Controllers\CategoriesController@updateApi`  |
| DELETE | `api/v1/categories/{category}` | api.categories.destroy | `Modules\Categories\Http\Controllers\CategoriesController@destroyApi` |

## 🧩 Modulo: `dashboard`

---

| Method | URI                | Name                | Action                                                    |
| ------ | ------------------ | ------------------- | --------------------------------------------------------- |
| GET    | `api/v1/dashboard` | api.dashboard.index | `Modules\User\Http\Controllers\DashboardController@index` |

## 🧩 Modulo: `entrate`

---

| Method | URI                            | Name                      | Action                                                            |
| ------ | ------------------------------ | ------------------------- | ----------------------------------------------------------------- |
| GET    | `api/v1/entrate`               | api.entrate.index         | `Modules\Entrate\Http\Controllers\EntrateController@indexApi`     |
| POST   | `api/v1/entrate`               | api.entrate.store         | `Modules\Entrate\Http\Controllers\EntrateController@storeApi`     |
| PATCH  | `api/v1/entrate/move-category` | api.entrate.move-category | `Modules\Entrate\Http\Controllers\EntrateController@moveCategory` |
| GET    | `api/v1/entrate/{entrata}`     | api.entrate.show          | `Modules\Entrate\Http\Controllers\EntrateController@showApi`      |
| PUT    | `api/v1/entrate/{entrata}`     | api.entrate.update        | `Modules\Entrate\Http\Controllers\EntrateController@updateApi`    |
| DELETE | `api/v1/entrate/{entrata}`     | api.entrate.destroy       | `Modules\Entrate\Http\Controllers\EntrateController@destroyApi`   |

## 🧩 Modulo: `financialoverview`

---

| Method | URI                        | Name                        | Action                                                                            |
| ------ | -------------------------- | --------------------------- | --------------------------------------------------------------------------------- |
| GET    | `api/v1/financialoverview` | api.financialoverview.index | `Modules\FinancialOverview\Http\Controllers\FinancialOverviewController@indexApi` |

## 🧩 Modulo: `forgot-password`

---

| Method | URI                      | Name                | Action                                                                    |
| ------ | ------------------------ | ------------------- | ------------------------------------------------------------------------- |
| POST   | `api/v1/forgot-password` | api.forgot-password | `Modules\User\Http\Controllers\ApiForgotPasswordController@sendResetLink` |

## 🧩 Modulo: `login`

---

| Method | URI            | Name      | Action                                                   |
| ------ | -------------- | --------- | -------------------------------------------------------- |
| POST   | `api/v1/login` | api.login | `Modules\User\Http\Controllers\ApiLoginController@login` |

## 🧩 Modulo: `logout`

---

| Method | URI             | Name       | Action                                                    |
| ------ | --------------- | ---------- | --------------------------------------------------------- |
| POST   | `api/v1/logout` | api.logout | `Modules\User\Http\Controllers\ApiLoginController@logout` |

## 🧩 Modulo: `me`

---

| Method | URI         | Name        | Action    |
| ------ | ----------- | ----------- | --------- |
| GET    | `api/v1/me` | api.me.show | `Closure` |

## 🧩 Modulo: `profile`

---

| Method | URI                                   | Name                             | Action                                                               |
| ------ | ------------------------------------- | -------------------------------- | -------------------------------------------------------------------- |
| PUT    | `api/v1/profile`                      | api.profile.update               | `Modules\User\Http\Controllers\ProfileController@update`             |
| DELETE | `api/v1/profile`                      | api.profile.destroy              | `Modules\User\Http\Controllers\ProfileController@destroy`            |
| GET    | `api/v1/profile`                      | api.profile.show                 | `Modules\User\Http\Controllers\ProfileController@show`               |
| DELETE | `api/v1/profile/pending-email`        | api.profile.pending-email.cancel | `Modules\User\Http\Controllers\ProfileController@cancelPendingEmail` |
| POST   | `api/v1/profile/pending-email/resend` | api.profile.pending-email.resend | `Modules\User\Http\Controllers\ProfileController@resendPendingEmail` |

## 🧩 Modulo: `recurring-operations`

---

| Method     | URI                                                 | Name                                      | Action                                                                                         |
| ---------- | --------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| GET        | `api/v1/recurring-operations`                       | api.recurring-operations.index            | `Modules\RecurringOperations\Http\Controllers\RecurringOperationController@index`              |
| POST       | `api/v1/recurring-operations`                       | api.recurring-operations.store            | `Modules\RecurringOperations\Http\Controllers\RecurringOperationController@store`              |
| PATCH      | `api/v1/recurring-operations/move-category`         | api.recurring-operations.move-category    | `Modules\RecurringOperations\Http\Controllers\RecurringOperationController@moveCategory`       |
| GET        | `api/v1/recurring-operations/next-occurrences`      | api.recurring-operations.next-occurrences | `Modules\RecurringOperations\Http\Controllers\RecurringOperationController@getNextOccurrences` |
| GET        | `api/v1/recurring-operations/{recurring_operation}` | api.recurring-operations.show             | `Modules\RecurringOperations\Http\Controllers\RecurringOperationController@show`               |
| PUT\|PATCH | `api/v1/recurring-operations/{recurring_operation}` | api.recurring-operations.update           | `Modules\RecurringOperations\Http\Controllers\RecurringOperationController@update`             |
| DELETE     | `api/v1/recurring-operations/{recurring_operation}` | api.recurring-operations.destroy          | `Modules\RecurringOperations\Http\Controllers\RecurringOperationController@destroy`            |

## 🧩 Modulo: `register`

---

| Method | URI               | Name         | Action                                                         |
| ------ | ----------------- | ------------ | -------------------------------------------------------------- |
| POST   | `api/v1/register` | api.register | `Modules\User\Http\Controllers\ApiRegisterController@register` |

## 🧩 Modulo: `reset-password`

---

| Method | URI                     | Name               | Action                                                           |
| ------ | ----------------------- | ------------------ | ---------------------------------------------------------------- |
| POST   | `api/v1/reset-password` | api.reset-password | `Modules\User\Http\Controllers\ApiResetPasswordController@reset` |

## 🧩 Modulo: `spese`

---

| Method | URI                          | Name                    | Action                                                        |
| ------ | ---------------------------- | ----------------------- | ------------------------------------------------------------- |
| GET    | `api/v1/spese`               | api.spese.index         | `Modules\Spese\Http\Controllers\SpeseController@indexApi`     |
| POST   | `api/v1/spese`               | api.spese.store         | `Modules\Spese\Http\Controllers\SpeseController@storeApi`     |
| PATCH  | `api/v1/spese/move-category` | api.spese.move-category | `Modules\Spese\Http\Controllers\SpeseController@moveCategory` |
| GET    | `api/v1/spese/{spesa}`       | api.spese.show          | `Modules\Spese\Http\Controllers\SpeseController@showApi`      |
| PUT    | `api/v1/spese/{spesa}`       | api.spese.update        | `Modules\Spese\Http\Controllers\SpeseController@updateApi`    |
| DELETE | `api/v1/spese/{spesa}`       | api.spese.destroy       | `Modules\Spese\Http\Controllers\SpeseController@destroyApi`   |

## 🧩 Modulo: `users`

---

| Method     | URI                   | Name              | Action                                                 |
| ---------- | --------------------- | ----------------- | ------------------------------------------------------ |
| GET        | `api/v1/users`        | api.users.index   | `Modules\User\Http\Controllers\UserController@index`   |
| POST       | `api/v1/users`        | api.users.store   | `Modules\User\Http\Controllers\UserController@store`   |
| GET        | `api/v1/users/{user}` | api.users.show    | `Modules\User\Http\Controllers\UserController@show`    |
| PUT\|PATCH | `api/v1/users/{user}` | api.users.update  | `Modules\User\Http\Controllers\UserController@update`  |
| DELETE     | `api/v1/users/{user}` | api.users.destroy | `Modules\User\Http\Controllers\UserController@destroy` |

## 🧩 Modulo: `verify-email`

---

| Method | URI                               | Name                    | Action                                                   |
| ------ | --------------------------------- | ----------------------- | -------------------------------------------------------- |
| GET    | `api/v1/verify-email/{id}/{hash}` | api.verification.verify | `Modules\User\Http\Controllers\ApiVerifyEmailController` |

## 🧩 Modulo: `verify-new-email`

---

| Method | URI                                   | Name                           | Action                                                       |
| ------ | ------------------------------------- | ------------------------------ | ------------------------------------------------------------ |
| GET    | `api/v1/verify-new-email/{id}/{hash}` | api.verification.pending-email | `Modules\User\Http\Controllers\VerifyPendingEmailController` |
