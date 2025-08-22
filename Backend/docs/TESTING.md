# 🧪 Testing

Guida ai test automatici dell'API.

---

## ▶️ Esecuzione

```
bash
php artisan test                      # tutti i test
php artisan test --filter=NomeTest    # esegui 1 test/suite
php artisan test --testsuite=Feature  # solo Feature
php artisan test --coverage           # test + copertura (lenta con Xdebug)
vendor/bin/phpunit -v                 # alternativa diretta a phpunit
```

---

## ⚡ Run VELOCE senza Xdebug (CLI/test)

> Evita l’overhead: test **molto** più rapidi e niente warning “Time-out connecting…”.

### PowerShell

```
powershell
$env:XDEBUG_MODE = "off"; php artisan test
```

### Bash/CMD

```
bash
XDEBUG_MODE=off php artisan test
php -d xdebug.mode=off artisan test
```

> **Consigliato**: spegnilo a livello di test in `phpunit.xml` (vedi sotto).

---

## 📁 Struttura

-   `tests/Feature` → test end-to-end delle rotte
-   `tests/Unit` → logica isolata
-   `Modules/*/tests` → test per singoli moduli

---

## ✍️ Scrivere nuovi test

```
bash
php artisan make:test NomeTest --unit        # unit
php artisan make:test NomeFeatureTest        # feature
# (se hai un generatore custom)
# php artisan make:custom-api-test NomeTest
```

-   Metodi `test_*`
-   Verifica **status code** e **shape** JSON (`assertJson`, `assertJsonPath`, `assertJsonCount`)
-   Usa **factory** e **Sanctum** per autenticazione nei Feature

---

## 🧠 Xdebug: perché OFF di default?

**Pro (quando acceso)**

-   Debug **step-by-step** (breakpoint, variabili, stack)
-   Stack trace/`var_dump` migliori (`mode=develop`)
-   **Coverage** affidabile (`mode=coverage`)
-   **Profiling**/trace per performance

**Contro (se sempre acceso)**

-   **Lentezza**: test/CLI anche **2–5×** più lenti
-   **Rumore**: warning “Time-out connecting…”
-   **I/O** extra con profiler/trace
-   **Mai** in produzione

👉 **Strategia**: **OFF di default**; **ON solo quando serve**.

---

## 🔧 Configurazione consigliata Xdebug

```
ini
; ── xdebug.ini (sviluppo) ───────────────────────────────────────────────────
; Avvio solo su richiesta → niente warning/lentezze finché non lo attivi tu
xdebug.start_with_request = trigger

; Modalità di base leggere (niente debug attivo sempre)
xdebug.mode = develop

; Impostazioni comuni
xdebug.client_port = 9003
xdebug.discover_client_host = 0
xdebug.log_level = 0
; ────────────────────────────────────────────────────────────────────────────
```

> Quando ti serve il debug a step, aggiungi temporaneamente `XDEBUG_TRIGGER=1` e `XDEBUG_MODE=debug,develop` (vedi sotto).

---

## 🐞 Debug step-by-step (quando serve)

### PowerShell

```
powershell
# attiva SOLO per questo comando
$env:XDEBUG_TRIGGER = "1"
$env:XDEBUG_MODE    = "debug,develop"
php artisan tinker  # o qualunque comando/rotta stai debuggando
```

**In VS Code**

-   Estensione **PHP Debug**
-   Avvia **Run and Debug → Listen for Xdebug** (porta 9003)
-   Metti breakpoint → l’esecuzione si ferma

---

## 📊 Coverage: con cosa farla

**Opzioni**

-   **Xdebug (coverage)**: accurata, ma più lenta
    ```
    bash
    XDEBUG_MODE=coverage php artisan test --coverage
    php -d xdebug.mode=coverage artisan test --coverage-html coverage
    ```
-   **PCOV**: alternativa più veloce (solo coverage), se disponibile

**Tip**: in CI fai coverage; in locale usalo solo quando serve.

---

## 🧵 Profiling mirato (performance)

```
bash
# genera file cachegrind.out.* nella cartella corrente
php -d xdebug.mode=profile -d xdebug.start_with_request=yes artisan route:list
```

-   Apri i file con **QCacheGrind/KCacheGrind**
-   **Usalo solo per un run mirato** (file grandi!)

---

## 🎛️ Composer scripts (scorciatoie)

```
json
{
  "scripts": {
    "test":      "php -d xdebug.mode=off vendor/bin/phpunit",
    "test:cov":  "php -d xdebug.mode=coverage vendor/bin/phpunit --coverage-text",
    "debug":     "XDEBUG_TRIGGER=1 XDEBUG_MODE=debug,develop php artisan tinker",
    "profile":   "php -d xdebug.mode=profile -d xdebug.start_with_request=yes artisan route:list"
  }
}
```

---

## ⚙️ phpunit.xml (spegnere Xdebug nei test)

```
xml
<!-- ── phpunit.xml ────────────────────────────────────────────────────────── -->
<php>
  <!-- Test veloci per default -->
  <env name="XDEBUG_MODE" value="off"/>
  <!-- DB in memoria, se usi SQLite (opzionale)
  <env name="DB_CONNECTION" value="sqlite"/>
  <env name="DB_DATABASE"   value=":memory:"/>
  -->
</php>
```

---

## 🆘 Troubleshooting Xdebug

-   **“Time-out connecting to debugging client”**  
    → Spegni Xdebug: `XDEBUG_MODE=off php artisan test` **oppure** ascolta con VS Code (porta 9003).  
    → Imposta `start_with_request=trigger` per farlo partire **solo su trigger**.

-   **Test lenti**  
    → Verifica di **non** avere `xdebug.mode=debug/coverage/profile` attivo di default.

-   **Non si ferma sui breakpoint**  
    → VS Code deve “ascoltare”, stessa **porta 9003**, e `XDEBUG_TRIGGER=1` impostato.

---

## ❓ FAQ

-   **Database:** usa SQLite in memoria configurato in `phpunit.xml` (opzionale)
-   **Coverage HTML:** `php artisan test --coverage-html coverage`
-   **Eseguire 1 metodo di test:** `php artisan test --filter='::nome_metodo'`
-   **Random order (scova dipendenze):** `php artisan test --order-by=random`

---

## 🧷 TL;DR

-   **Test quotidiani:** **XDEBUG_MODE=off** → veloci e silenziosi
-   **Debug difficile:** `XDEBUG_TRIGGER=1` + `XDEBUG_MODE=debug,develop` + VS Code in ascolto
-   **Coverage/Profiling:** attivali **solo** quando ti servono, poi spegni
