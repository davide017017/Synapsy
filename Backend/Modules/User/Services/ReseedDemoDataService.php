<?php

declare(strict_types=1);

namespace Modules\User\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Categories\Models\Category;
use Modules\Categories\Services\CreateDefaultCategoriesForUser;
use Modules\Entrate\Models\Entrata;
use Modules\FinancialOverview\Models\FinancialSnapshot;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\Spese\Models\Spesa;
use Modules\User\Models\User;

class ReseedDemoDataService {
  private int $userId;
  private Carbon $oggi;
  private Carbon $inizioStorico;

  /** @var array<string, int> nome_categoria => id */
  private array $cat = [];

  /** Timestamp unico condiviso da tutte le righe bulk-insert di questo reseed. */
  private string $nowSql;

  /** @var list<array<string, mixed>> buffer spese del mese corrente, svuotato ad ogni generaMese() */
  private array $speseBuffer = [];

  /** @var list<array<string, mixed>> buffer entrate del mese corrente, svuotato ad ogni generaMese() */
  private array $entrateBuffer = [];

  // ─────────────────────────────────────────────────────────────────────────
  // PARAMETRI CONFIGURABILI (quantità, importi, probabilità)
  // ─────────────────────────────────────────────────────────────────────────

  // ── STORICO ──
  private const MESI_STORICO = 12;

  // ── SPESE FISSE ── (importi min/max e probabilità dove presente)
  private const AFFITTO_MIN = 750;
  private const AFFITTO_MAX = 950;
  private const STREAMING_MIN = 13;
  private const STREAMING_MAX = 18;
  private const PALESTRA_PROBABILITA = 85; // %
  private const PALESTRA_MIN = 30;
  private const PALESTRA_MAX = 50;
  private const TELEFONO_MIN = 15;
  private const TELEFONO_MAX = 25;
  private const LUCE_GAS_MIN = 55;
  private const LUCE_GAS_MAX = 130;

  // ── SPESE VARIABILI ── (pool a riempimento — vedi generaMese() — + importi)
  private const SPESE_PER_MESE = 50;
  private const ENTRATE_PER_MESE = 10;
  private const SUPERMERCATO_MIN = 55;
  private const SUPERMERCATO_MAX = 120;
  private const CARBURANTE_MIN = 45;
  private const CARBURANTE_MAX = 75;
  private const RISTORANTE_MIN = 28;
  private const RISTORANTE_MAX = 65;
  private const BAR_MIN = 5;
  private const BAR_MAX = 15;
  private const FARMACIA_MIN = 12;
  private const FARMACIA_MAX = 55;
  private const ONLINE_MIN = 20;
  private const ONLINE_MAX = 90;
  private const CINEMA_MIN = 15;
  private const CINEMA_MAX = 40;

  // ── ENTRATE ──
  private const STIPENDIO_MIN = 1850;
  private const STIPENDIO_MAX = 2150;
  private const RIMBORSO_PROBABILITA = 15; // %
  private const RIMBORSO_MIN = 80;
  private const RIMBORSO_MAX = 250;
  private const INVESTIMENTI_MIN = 50;
  private const INVESTIMENTI_MAX = 300;
  private const REGALO_MIN = 20;
  private const REGALO_MAX = 150;

  // ── RICORRENZE ──
  // I 5 importi fissi di creaRicorrenze() riusano le costanti sopra (stessi
  // range delle spese fisse/entrate corrispondenti: affitto, streaming,
  // stipendio, palestra, bolletta luce/gas).

  private function __construct(private readonly User $user) {
    $this->userId        = $user->id;
    $this->oggi          = Carbon::today();
    $this->inizioStorico = $this->oggi->copy()->subMonths(self::MESI_STORICO);
    $this->nowSql        = Carbon::now()->format('Y-m-d H:i:s');
  }

    // ─────────────────────────────────────────────────────────────────────────
    // ENTRY POINT
    // ─────────────────────────────────────────────────────────────────────────

  /**
   * @return array{
   *   cleanup: array<string, int>,
   *   mesi: list<array{label: string, n_spese: int, n_entrate: int, tot_spese: float, tot_entrate: float, periodo_inizio: string, periodo_fine: string}>,
   *   n_ricorrenze: int,
   *   n_snapshots: int
   * }
   */
  public static function run(User $user): array {
    return (new self($user))->execute();
  }

  private function execute(): array {
    // ── Reset connessione preventivo ──────────────────────────────────────
    // Se la connessione era già in stato "aborted" da una transazione precedente
    // (connessione riutilizzata dopo un errore non ripulito), questo ROLLBACK
    // la riporta in stato pulito PRIMA di aprire la transazione qui sotto.
    // Deve restare fuori da DB::transaction(): un BEGIN su una connessione già
    // "aborted" non la ripulisce, quindi va fatto un ROLLBACK esplicito prima.
    // L'errore viene ignorato: se non c'era nessuna transazione aperta,
    // PostgreSQL risponde con un warning che possiamo scartare.
    try {
      DB::statement('ROLLBACK');
    } catch (\Throwable) {
      // Intenzionalmente vuoto — solo reset preventivo.
    }

    // ── Intero reseed in un'unica transazione ──────────────────────────────
    // Un solo commit finale invece di uno per operazione; in caso di errore
    // in qualunque blocco, rollback automatico e nessun dato parziale resta
    // scritto. I try/catch per blocco restano solo per etichettare l'errore
    // (wrapConDettagli) prima che DB::transaction() esegua il rollback.
    return DB::transaction(function (): array {
      $cleanup = $this->pulisciDati();

      $categorieRimaste = DB::table('categories')->where('user_id', $this->userId)->count();
      if ($categorieRimaste > 0) {
        throw new \RuntimeException(
          "Pulizia categorie fallita: rimasti {$categorieRimaste} record per user_id {$this->userId}."
        );
      }

      $mesi        = [];
      $nRicorrenze = 0;
      $nSnapshots  = 0;

      try {
        $this->ricreaCategorie();
        $this->caricaCategorie();
      } catch (\Throwable $e) {
        throw $this->wrapConDettagli('Blocco A — categorie', $e);
      }

      try {
        $mesi = $this->generaTransazioni();
      } catch (\Throwable $e) {
        throw $this->wrapConDettagli('Blocco B — spese/entrate', $e);
      }

      try {
        $nRicorrenze = $this->creaRicorrenze();
      } catch (\Throwable $e) {
        throw $this->wrapConDettagli('Blocco C — ricorrenze', $e);
      }

      try {
        $nSnapshots = $this->creaSnapshot($mesi);
      } catch (\Throwable $e) {
        throw $this->wrapConDettagli('Blocco D — snapshot', $e);
      }

      return [
        'cleanup'      => $cleanup,
        'mesi'         => $mesi,
        'n_ricorrenze' => $nRicorrenze,
        'n_snapshots'  => $nSnapshots,
      ];
    });
  }

  /**
   * Risale la catena getPrevious() fino alla causa radice,
   * logga su file il dettaglio completo e rilancia con contesto leggibile.
   */
  private function wrapConDettagli(string $blocco, \Throwable $e): \RuntimeException {
    $radice = $e;
    while ($radice->getPrevious() !== null) {
      $radice = $radice->getPrevious();
    }

    $dettaglio = sprintf(
      "Demo reseed fallito in [%s].\n" .
        "  Classe eccezione : %s\n" .
        "  SQLSTATE / Codice: %s\n" .
        "  Messaggio        : %s\n" .
        "  File             : %s:%d",
      $blocco,
      get_class($radice),
      $radice->getCode(),
      $radice->getMessage(),
      $radice->getFile(),
      $radice->getLine()
    );

    Log::error('[DemoReseed] ' . $dettaglio);

    return new \RuntimeException($dettaglio, 0, $e);
  }

    // ─────────────────────────────────────────────────────────────────────────
    // PULIZIA
    // ─────────────────────────────────────────────────────────────────────────

  /** @return array<string, int> */
  private function pulisciDati(): array {
    // Ordine obbligatorio: prima le tabelle figlie, poi categories
    $tabelle = [
      'financial_snapshots',
      'spese',
      'entrate',
      'recurring_operations',
      'categories',
    ];

    $counts = [];
    foreach ($tabelle as $tabella) {
      $counts[$tabella] = DB::table($tabella)->where('user_id', $this->userId)->count();
      DB::table($tabella)->where('user_id', $this->userId)->delete();
    }

    return $counts;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CATEGORIE
  // ─────────────────────────────────────────────────────────────────────────

  private function ricreaCategorie(): void {
    CreateDefaultCategoriesForUser::run($this->user);
  }

  private function caricaCategorie(): void {
    $this->cat = Category::where('user_id', $this->userId)
      ->pluck('id', 'name')
      ->toArray();
  }

  private function catId(string $nome): ?int {
    return $this->cat[$nome] ?? null;
  }

    // ─────────────────────────────────────────────────────────────────────────
    // GENERAZIONE TRANSAZIONI (ciclo mensile)
    // ─────────────────────────────────────────────────────────────────────────

  /** @return list<array{label: string, n_spese: int, n_entrate: int, tot_spese: float, tot_entrate: float, periodo_inizio: string, periodo_fine: string}> */
  private function generaTransazioni(): array {
    $mesi   = [];
    $cursor = $this->inizioStorico->copy()->startOfMonth();

    while ($cursor->lte($this->oggi)) {
      $inizio = $cursor->copy()->startOfMonth();
      $fine   = $cursor->copy()->endOfMonth();

      if ($fine->gt($this->oggi)) {
        $fine = $this->oggi->copy();
      }

      $mesi[] = $this->generaMese($inizio, $fine);

      $cursor->addMonth()->startOfMonth();
    }

    return $mesi;
  }

  /**
   * Genera tutte le spese e le entrate per un singolo mese.
   *
   * @return array{label: string, n_spese: int, n_entrate: int, tot_spese: float, tot_entrate: float, periodo_inizio: string, periodo_fine: string}
   */
  private function generaMese(Carbon $inizio, Carbon $fine): array {
    // Buffer del mese: azzerati qui, riempiti da inserisciSpesa/inserisciEntrata,
    // scritti in un'unica query bulk a fine metodo invece che riga per riga.
    $this->speseBuffer   = [];
    $this->entrateBuffer = [];

    $maxGiorno = $fine->day;
    $meseNum   = $inizio->month;

    // Ritorna un Carbon casuale in [min, maxGiorno] o null se il mese non copre $min
    $giorno = function (int $min, int $max) use ($inizio, $maxGiorno): ?Carbon {
      if ($min > $maxGiorno) {
        return null;
      }

      return $inizio->copy()->setDay(rand($min, min($max, $maxGiorno)));
    };

    $speseRaw   = [];
    $entrateRaw = [];

    // ── SPESE FISSE ───────────────────────────────────────────────────────

    if ($d = $giorno(1, 3)) {
      $speseRaw[] = $this->inserisciSpesa('Affitto appartamento', rand(self::AFFITTO_MIN, self::AFFITTO_MAX), $d, 'Casa');
    }

    if ($d = $giorno(1, 5)) {
      $speseRaw[] = $this->inserisciSpesa('Abbonamento streaming', rand(self::STREAMING_MIN, self::STREAMING_MAX), $d, 'Svago');
    }

    if (rand(1, 100) <= self::PALESTRA_PROBABILITA && ($d = $giorno(1, 7))) {
      $speseRaw[] = $this->inserisciSpesa('Abbonamento palestra', rand(self::PALESTRA_MIN, self::PALESTRA_MAX), $d, 'Svago');
    }

    if ($d = $giorno(5, 20)) {
      $speseRaw[] = $this->inserisciSpesa('Bolletta telefono', rand(self::TELEFONO_MIN, self::TELEFONO_MAX), $d, 'Utenze');
    }

    // Bolletta luce/gas: solo mesi pari (Feb, Apr, Giu, Ago, Ott, Dic)
    if ($meseNum % 2 === 0 && ($d = $giorno(8, 20))) {
      $speseRaw[] = $this->inserisciSpesa('Bolletta luce e gas', rand(self::LUCE_GAS_MIN, self::LUCE_GAS_MAX), $d, 'Utenze');
    }

    // ── SPESE VARIABILI (riempimento a target) ──────────────────────────────
    // Pool unico da cui si pesca uniformemente (nessun peso) finché il totale
    // spese del mese non raggiunge SPESE_PER_MESE. Le fisse sopra sono già
    // dentro $speseRaw: max(0, ...) evita un target negativo se lo superassero.
    $poolSpese = [
      ['Spesa supermercato', 'Alimentazione', self::SUPERMERCATO_MIN, self::SUPERMERCATO_MAX],
      ['Carburante auto', 'Trasporti', self::CARBURANTE_MIN, self::CARBURANTE_MAX],
      ['Cena al ristorante', 'Alimentazione', self::RISTORANTE_MIN, self::RISTORANTE_MAX],
      ['Bar e caffè', 'Alimentazione', self::BAR_MIN, self::BAR_MAX],
      ['Farmacia', 'Salute', self::FARMACIA_MIN, self::FARMACIA_MAX],
      ['Acquisti online', 'Altro (Spesa)', self::ONLINE_MIN, self::ONLINE_MAX],
      ['Cinema e svago', 'Svago', self::CINEMA_MIN, self::CINEMA_MAX],
    ];

    // Giorni di venerdì/sabato del mese, mescolati: quando il pool pesca "Cena
    // al ristorante" si usa il prossimo di questi finché non si esauriscono,
    // poi si ricade su un giorno qualunque — stessa preferenza di prima.
    $venSab = $this->giorniVenSab($inizio, $fine);
    shuffle($venSab);
    $venSabIndex = 0;

    // Conta le estrazioni per descrizione-base, azzerato ad ogni generaMese()
    // (variabile locale, quindi già "fresca" ad ogni chiamata). Dalla 2ª
    // estrazione della stessa voce in poi, la descrizione viene numerata.
    $contatoriSpesePool = [];

    $restantiSpese = max(0, self::SPESE_PER_MESE - count($speseRaw));
    for ($i = 0; $i < $restantiSpese; $i++) {
      [$desc, $categoria, $min, $max] = $poolSpese[array_rand($poolSpese)];

      if ($desc === 'Cena al ristorante' && $venSabIndex < count($venSab)) {
        $d = $venSab[$venSabIndex];
        $venSabIndex++;
      } else {
        $d = $giorno(1, $maxGiorno);
      }

      if ($d) {
        $contatoriSpesePool[$desc] = ($contatoriSpesePool[$desc] ?? 0) + 1;
        $descEtichettata = $contatoriSpesePool[$desc] > 1
          ? "{$desc} ({$contatoriSpesePool[$desc]})"
          : $desc;

        $speseRaw[] = $this->inserisciSpesa($descEtichettata, rand($min, $max), $d, $categoria);
      }
    }

    // ── ENTRATE ───────────────────────────────────────────────────────────

    // Stipendio: giorno 25-28
    if ($d = $giorno(25, 28)) {
      $entrateRaw[] = $this->inserisciEntrata('Stipendio', rand(self::STIPENDIO_MIN, self::STIPENDIO_MAX), $d, 'Stipendio');
    }

    // Rimborso spese lavoro: ~15% dei mesi
    if (rand(1, 100) <= self::RIMBORSO_PROBABILITA && ($d = $giorno(5, 25))) {
      $entrateRaw[] = $this->inserisciEntrata('Rimborso spese lavoro', rand(self::RIMBORSO_MIN, self::RIMBORSO_MAX), $d, 'Altro (Entrata)');
    }

    // ── ENTRATE (riempimento a target) ──────────────────────────────────────
    // Pool da cui si pesca uniformemente (stesso schema del pool spese) finché
    // il totale entrate del mese non raggiunge ENTRATE_PER_MESE.
    $poolEntrate = [
      ['Rimborso spese lavoro', 'Altro (Entrata)', self::RIMBORSO_MIN, self::RIMBORSO_MAX],
      ['Dividendi investimento', 'Investimenti', self::INVESTIMENTI_MIN, self::INVESTIMENTI_MAX],
      ['Regalo ricevuto', 'Regalo', self::REGALO_MIN, self::REGALO_MAX],
    ];

    // Stesso schema di numerazione del pool spese, contatore indipendente.
    $contatoriEntratePool = [];

    $restantiEntrate = max(0, self::ENTRATE_PER_MESE - count($entrateRaw));
    for ($i = 0; $i < $restantiEntrate; $i++) {
      [$desc, $categoria, $min, $max] = $poolEntrate[array_rand($poolEntrate)];
      if ($d = $giorno(1, $maxGiorno)) {
        $contatoriEntratePool[$desc] = ($contatoriEntratePool[$desc] ?? 0) + 1;
        $descEtichettata = $contatoriEntratePool[$desc] > 1
          ? "{$desc} ({$contatoriEntratePool[$desc]})"
          : $desc;

        $entrateRaw[] = $this->inserisciEntrata($descEtichettata, rand($min, $max), $d, $categoria);
      }
    }

    // ── AGGREGAZIONE ──────────────────────────────────────────────────────

    $speseRaw   = array_values(array_filter($speseRaw));
    $entrateRaw = array_values(array_filter($entrateRaw));

    // ── Scrittura bulk del mese ──────────────────────────────────────────
    // Un INSERT multi-riga per tabella invece di N create() singoli.
    if ($this->speseBuffer !== []) {
      Spesa::insert($this->speseBuffer);
    }
    if ($this->entrateBuffer !== []) {
      Entrata::insert($this->entrateBuffer);
    }

    return [
      'label'          => $this->labelMese($inizio),
      'n_spese'        => count($speseRaw),
      'n_entrate'      => count($entrateRaw),
      'tot_spese'      => (float) array_sum(array_column($speseRaw, 'amount')),
      'tot_entrate'    => (float) array_sum(array_column($entrateRaw, 'amount')),
      'periodo_inizio' => $inizio->format('Y-m-d'),
      'periodo_fine'   => $fine->format('Y-m-d'),
    ];
  }

    // ─────────────────────────────────────────────────────────────────────────
    // ACCODAMENTO SINGOLE TRANSAZIONI (bulk insert a fine mese, vedi generaMese)
    // ─────────────────────────────────────────────────────────────────────────

  /**
   * Accoda una spesa al buffer del mese corrente (nessuna query qui).
   *
   * NB: bypassando Eloquent::create(), l'evento "created" di SpesaObserver
   * non scatta e non viene generata una riga di audit trail per questa spesa
   * (dato demo, non tracciato — vedi nota di consegna).
   *
   * @return array{amount: float}|null
   */
  private function inserisciSpesa(string $desc, float $importo, Carbon $data, string $categoria): ?array {
    if ($data->gt($this->oggi)) {
      return null;
    }

    $this->speseBuffer[] = [
      'user_id'     => $this->userId,
      'category_id' => $this->catId($categoria),
      'description' => $desc,
      'amount'      => $importo,
      'date'        => $data->format('Y-m-d'),
      'created_at'  => $this->nowSql,
      'updated_at'  => $this->nowSql,
    ];

    return ['amount' => $importo];
  }

  /**
   * Accoda un'entrata al buffer del mese corrente (nessuna query qui).
   *
   * NB: bypassando Eloquent::create(), l'evento "created" di EntrataObserver
   * non scatta e non viene generata una riga di audit trail per questa entrata
   * (dato demo, non tracciato — vedi nota di consegna).
   *
   * @return array{amount: float}|null
   */
  private function inserisciEntrata(string $desc, float $importo, Carbon $data, string $categoria): ?array {
    if ($data->gt($this->oggi)) {
      return null;
    }

    $this->entrateBuffer[] = [
      'user_id'     => $this->userId,
      'category_id' => $this->catId($categoria),
      'description' => $desc,
      'amount'      => $importo,
      'date'        => $data->format('Y-m-d'),
      'created_at'  => $this->nowSql,
      'updated_at'  => $this->nowSql,
    ];

    return ['amount' => $importo];
  }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

  /** @return Carbon[] */
  private function giorniVenSab(Carbon $inizio, Carbon $fine): array {
    $giorni = [];
    $cursor = $inizio->copy();

    while ($cursor->lte($fine)) {
      if (in_array($cursor->dayOfWeek, [Carbon::FRIDAY, Carbon::SATURDAY])) {
        $giorni[] = $cursor->copy();
      }
      $cursor->addDay();
    }

    return $giorni;
  }

  private function labelMese(Carbon $inizio): string {
    $nomi = [
      1 => 'Gennaio',
      2 => 'Febbraio',
      3 => 'Marzo',
      4 => 'Aprile',
      5 => 'Maggio',
      6 => 'Giugno',
      7 => 'Luglio',
      8 => 'Agosto',
      9 => 'Settembre',
      10 => 'Ottobre',
      11 => 'Novembre',
      12 => 'Dicembre',
    ];

    return $nomi[$inizio->month] . ' ' . $inizio->year;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RICORRENZE
  // ─────────────────────────────────────────────────────────────────────────

  private function creaRicorrenze(): int {
    // next_occurrence_date sempre futura → il job non le elabora immediatamente
    $prossimoMese = $this->oggi->copy()->addMonth()->startOfMonth();

    $ricorrenze = [
      [
        'description'          => 'Affitto appartamento',
        'amount'               => rand(self::AFFITTO_MIN, self::AFFITTO_MAX),
        'type'                 => 'spesa',
        'category'             => 'Casa',
        'frequency'            => 'monthly',
        'interval'             => 1,
        'start_date'           => '2025-01-01',
        'next_occurrence_date' => $prossimoMese->copy()->setDay(2)->format('Y-m-d'),
      ],
      [
        'description'          => 'Abbonamento streaming',
        'amount'               => rand(self::STREAMING_MIN, self::STREAMING_MAX),
        'type'                 => 'spesa',
        'category'             => 'Svago',
        'frequency'            => 'monthly',
        'interval'             => 1,
        'start_date'           => '2025-01-01',
        'next_occurrence_date' => $prossimoMese->copy()->setDay(3)->format('Y-m-d'),
      ],
      [
        'description'          => 'Stipendio mensile',
        'amount'               => rand(self::STIPENDIO_MIN, self::STIPENDIO_MAX),
        'type'                 => 'entrata',
        'category'             => 'Stipendio',
        'frequency'            => 'monthly',
        'interval'             => 1,
        'start_date'           => '2025-01-01',
        'next_occurrence_date' => $prossimoMese->copy()->setDay(26)->format('Y-m-d'),
      ],
      [
        'description'          => 'Abbonamento palestra',
        'amount'               => rand(self::PALESTRA_MIN, self::PALESTRA_MAX),
        'type'                 => 'spesa',
        'category'             => 'Svago',
        'frequency'            => 'monthly',
        'interval'             => 1,
        'start_date'           => '2025-01-01',
        'next_occurrence_date' => $prossimoMese->copy()->setDay(5)->format('Y-m-d'),
      ],
      [
        'description'          => 'Bolletta luce e gas',
        'amount'               => rand(self::LUCE_GAS_MIN, self::LUCE_GAS_MAX),
        'type'                 => 'spesa',
        'category'             => 'Utenze',
        'frequency'            => 'monthly',
        'interval'             => 2,     // ogni 2 mesi
        'start_date'           => '2025-02-01',
        'next_occurrence_date' => $this->prossimaScadenzaBollette()->format('Y-m-d'),
      ],
    ];

    // Bulk insert: un'unica query invece di 5 create() singoli. Come per
    // spese/entrate, questo salta RecurringOperationObserver — nessuna riga
    // di audit trail per queste ricorrenze demo (vedi nota di consegna).
    $rows = [];
    foreach ($ricorrenze as $r) {
      $rows[] = [
        'user_id'              => $this->userId,
        'category_id'          => $this->catId($r['category']),
        'description'          => $r['description'],
        'amount'               => $r['amount'],
        'type'                 => $r['type'],
        'frequency'            => $r['frequency'],
        'interval'             => $r['interval'],
        'start_date'           => $r['start_date'],
        'next_occurrence_date' => $r['next_occurrence_date'],
        // DB::raw(): Connection::prepareBindings() converte SEMPRE i bool PHP in
        // interi (1/0) prima del bind PDO — anche passando qui il letterale `true`,
        // arriverebbe a Postgres come intero e "is_active" (colonna boolean) lo
        // rifiuterebbe con 42804. L'espressione raw bypassa il binding e inietta
        // il literal SQL "true" direttamente, senza passare da PDO::PARAM_INT.
        'is_active'            => DB::raw('true'),
        'created_at'           => $this->nowSql,
        'updated_at'           => $this->nowSql,
      ];
    }

    RecurringOperation::insert($rows);

    return count($rows);
  }

  private function prossimaScadenzaBollette(): Carbon {
    // Bollette ogni 2 mesi su mesi pari → prossimo mese pari futuro, giorno 15
    $prossimo = $this->oggi->copy()->addMonth()->startOfMonth();

    while ($prossimo->month % 2 !== 0) {
      $prossimo->addMonth();
    }

    return $prossimo->setDay(15);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FINANCIAL SNAPSHOTS
  // ─────────────────────────────────────────────────────────────────────────

  private function creaSnapshot(array $mesi): int {
    if ($mesi === []) {
      return 0;
    }

    // Bulk insert invece di updateOrCreate per riga: pulisciDati() ha già
    // cancellato tutti gli snapshot di questo utente in questa stessa
    // transazione, quindi il controllo "esiste già?" di updateOrCreate
    // (SELECT + INSERT per riga) è ridondante — non può esistere collisione.
    $rows = [];
    foreach ($mesi as $mese) {
      $rows[] = [
        'user_id'           => $this->userId,
        'period_type'       => 'monthly',
        'period_start_date' => $mese['periodo_inizio'],
        'period_end_date'   => $mese['periodo_fine'],
        'total_income'      => round($mese['tot_entrate'], 2),
        'total_expense'     => round($mese['tot_spese'], 2),
        'balance'           => round($mese['tot_entrate'] - $mese['tot_spese'], 2),
        'created_at'        => $this->nowSql,
        'updated_at'        => $this->nowSql,
      ];
    }

    FinancialSnapshot::insert($rows);

    return count($rows);
  }
}
