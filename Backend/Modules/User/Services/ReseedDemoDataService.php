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

class ReseedDemoDataService
{
    private int $userId;
    private Carbon $oggi;
    private Carbon $inizioStorico;

    /** @var array<string, int> nome_categoria => id */
    private array $cat = [];

    private function __construct(private readonly User $user)
    {
        $this->userId        = $user->id;
        $this->oggi          = Carbon::today();
        $this->inizioStorico = Carbon::create(2025, 1, 1);
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
    public static function run(User $user): array
    {
        return (new self($user))->execute();
    }

    private function execute(): array
    {
        // ── Reset connessione preventivo ──────────────────────────────────────
        // Se la connessione era già in stato "aborted" da una transazione precedente,
        // questo ROLLBACK la riporta in stato pulito prima di iniziare.
        // L'errore viene ignorato: se non c'era nessuna transazione aperta,
        // PostgreSQL risponde con un warning che possiamo scartare.
        try {
            DB::statement('ROLLBACK');
        } catch (\Throwable) {
            // Intenzionalmente vuoto — solo reset preventivo.
        }

        // ── DB::listen() — cattura ogni SQL prima che esploda ─────────────────
        // TEMPORANEO: logga su storage/logs/laravel.log ogni query eseguita
        // con bindings, ms e blocco di appartenenza. Rimuovere dopo il debug.
        DB::listen(function (\Illuminate\Database\Events\QueryExecuted $query): void {
            Log::debug('[DemoReseed] SQL', [
                'sql'      => $query->sql,
                'bindings' => $query->bindings,
                'time_ms'  => $query->time,
            ]);
        });

        // ── Fase 1: pulizia FUORI transazione ────────────────────────────────
        $cleanup = $this->pulisciDati();

        $categorieRimaste = DB::table('categories')->where('user_id', $this->userId)->count();
        if ($categorieRimaste > 0) {
            throw new \RuntimeException(
                "Pulizia categorie fallita: rimasti {$categorieRimaste} record per user_id {$this->userId}."
            );
        }

        // ── Fase 2: insert SENZA transazione — un try/catch per blocco ────────
        // TEMPORANEO: ogni blocco è isolato così il primo errore reale emerge
        // senza essere mascherato dal cascade 25P02.
        // Ripristinare DB::beginTransaction() dopo aver identificato la causa.

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
    }

    /**
     * Risale la catena getPrevious() fino alla causa radice,
     * logga su file il dettaglio completo e rilancia con contesto leggibile.
     */
    private function wrapConDettagli(string $blocco, \Throwable $e): \RuntimeException
    {
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
    private function pulisciDati(): array
    {
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

    private function ricreaCategorie(): void
    {
        CreateDefaultCategoriesForUser::run($this->user);
    }

    private function caricaCategorie(): void
    {
        $this->cat = Category::where('user_id', $this->userId)
            ->pluck('id', 'name')
            ->toArray();
    }

    private function catId(string $nome): ?int
    {
        return $this->cat[$nome] ?? null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GENERAZIONE TRANSAZIONI (ciclo mensile)
    // ─────────────────────────────────────────────────────────────────────────

    /** @return list<array{label: string, n_spese: int, n_entrate: int, tot_spese: float, tot_entrate: float, periodo_inizio: string, periodo_fine: string}> */
    private function generaTransazioni(): array
    {
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
    private function generaMese(Carbon $inizio, Carbon $fine): array
    {
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
            $speseRaw[] = $this->inserisciSpesa('Affitto appartamento', rand(750, 950), $d, 'Casa');
        }

        if ($d = $giorno(1, 5)) {
            $speseRaw[] = $this->inserisciSpesa('Abbonamento streaming', rand(13, 18), $d, 'Svago');
        }

        if (rand(1, 100) <= 85 && ($d = $giorno(1, 7))) {
            $speseRaw[] = $this->inserisciSpesa('Abbonamento palestra', rand(30, 50), $d, 'Svago');
        }

        if ($d = $giorno(5, 20)) {
            $speseRaw[] = $this->inserisciSpesa('Bolletta telefono', rand(15, 25), $d, 'Utenze');
        }

        // Bolletta luce/gas: solo mesi pari (Feb, Apr, Giu, Ago, Ott, Dic)
        if ($meseNum % 2 === 0 && ($d = $giorno(8, 20))) {
            $speseRaw[] = $this->inserisciSpesa('Bolletta luce e gas', rand(55, 130), $d, 'Utenze');
        }

        // ── SPESE VARIABILI ───────────────────────────────────────────────────

        // Supermercato: 3-4 volte (duplicati di giorno consentiti, unique constraint droppato)
        $nSuper = rand(3, 4);
        for ($i = 0; $i < $nSuper; $i++) {
            if ($d = $giorno(1, $maxGiorno)) {
                $speseRaw[] = $this->inserisciSpesa('Spesa supermercato', rand(55, 120), $d, 'Alimentazione');
            }
        }

        // Carburante: 2 volte
        for ($i = 1; $i <= 2; $i++) {
            $desc = $i === 2 ? 'Carburante auto (bis)' : 'Carburante auto';
            if ($d = $giorno(3, $maxGiorno)) {
                $speseRaw[] = $this->inserisciSpesa($desc, rand(45, 75), $d, 'Trasporti');
            }
        }

        // Ristorante: 1-2 volte, preferibilmente venerdì o sabato
        $venSab = $this->giorniVenSab($inizio, $fine);
        shuffle($venSab);
        $nRisto = rand(1, 2);
        for ($i = 0; $i < min($nRisto, count($venSab)); $i++) {
            $speseRaw[] = $this->inserisciSpesa('Cena al ristorante', rand(28, 65), $venSab[$i], 'Alimentazione');
        }
        // Fallback se nessun ven/sab disponibile nel mese parziale
        if (empty($venSab) && ($d = $giorno(1, $maxGiorno))) {
            $speseRaw[] = $this->inserisciSpesa('Cena al ristorante', rand(28, 65), $d, 'Alimentazione');
        }

        // Bar e caffè: 2-4 volte
        $nBar = rand(2, 4);
        for ($i = 0; $i < $nBar; $i++) {
            if ($d = $giorno(1, $maxGiorno)) {
                $speseRaw[] = $this->inserisciSpesa('Bar e caffè', rand(5, 15), $d, 'Alimentazione');
            }
        }

        // Farmacia: 1-2 volte nel 40% dei mesi
        if (rand(1, 100) <= 40) {
            $nFarmacia = rand(1, 2);
            for ($i = 0; $i < $nFarmacia; $i++) {
                if ($d = $giorno(1, $maxGiorno)) {
                    $speseRaw[] = $this->inserisciSpesa('Farmacia', rand(12, 55), $d, 'Salute');
                }
            }
        }

        // Acquisti online: 1-2 volte
        $nOnline = rand(1, 2);
        for ($i = 0; $i < $nOnline; $i++) {
            if ($d = $giorno(1, $maxGiorno)) {
                $speseRaw[] = $this->inserisciSpesa('Acquisti online', rand(20, 90), $d, 'Altro (Spesa)');
            }
        }

        // Cinema/svago: opzionale (50%)
        if (rand(1, 100) <= 50 && ($d = $giorno(1, $maxGiorno))) {
            $speseRaw[] = $this->inserisciSpesa('Cinema e svago', rand(15, 40), $d, 'Svago');
        }

        // ── ENTRATE ───────────────────────────────────────────────────────────

        // Stipendio: giorno 25-28
        if ($d = $giorno(25, 28)) {
            $entrateRaw[] = $this->inserisciEntrata('Stipendio', rand(1850, 2150), $d, 'Stipendio');
        }

        // Rimborso spese lavoro: ~15% dei mesi
        if (rand(1, 100) <= 15 && ($d = $giorno(5, 25))) {
            $entrateRaw[] = $this->inserisciEntrata('Rimborso spese lavoro', rand(80, 250), $d, 'Altro (Entrata)');
        }

        // ── AGGREGAZIONE ──────────────────────────────────────────────────────

        $speseRaw   = array_values(array_filter($speseRaw));
        $entrateRaw = array_values(array_filter($entrateRaw));

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
    // INSERIMENTO SINGOLE TRANSAZIONI
    // ─────────────────────────────────────────────────────────────────────────

    /** @return array{amount: float}|null */
    private function inserisciSpesa(string $desc, float $importo, Carbon $data, string $categoria): ?array
    {
        if ($data->gt($this->oggi)) {
            return null;
        }

        Spesa::create([
            'user_id'     => $this->userId,
            'category_id' => $this->catId($categoria),
            'description' => $desc,
            'amount'      => $importo,
            'date'        => $data->format('Y-m-d'),
        ]);

        return ['amount' => $importo];
    }

    /** @return array{amount: float}|null */
    private function inserisciEntrata(string $desc, float $importo, Carbon $data, string $categoria): ?array
    {
        if ($data->gt($this->oggi)) {
            return null;
        }

        Entrata::create([
            'user_id'     => $this->userId,
            'category_id' => $this->catId($categoria),
            'description' => $desc,
            'amount'      => $importo,
            'date'        => $data->format('Y-m-d'),
        ]);

        return ['amount' => $importo];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /** @return Carbon[] */
    private function giorniVenSab(Carbon $inizio, Carbon $fine): array
    {
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

    private function labelMese(Carbon $inizio): string
    {
        $nomi = [
            1 => 'Gennaio',   2 => 'Febbraio', 3 => 'Marzo',    4 => 'Aprile',
            5 => 'Maggio',    6 => 'Giugno',   7 => 'Luglio',   8 => 'Agosto',
            9 => 'Settembre', 10 => 'Ottobre', 11 => 'Novembre', 12 => 'Dicembre',
        ];

        return $nomi[$inizio->month] . ' ' . $inizio->year;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RICORRENZE
    // ─────────────────────────────────────────────────────────────────────────

    private function creaRicorrenze(): int
    {
        // next_occurrence_date sempre futura → il job non le elabora immediatamente
        $prossimoMese = $this->oggi->copy()->addMonth()->startOfMonth();

        $ricorrenze = [
            [
                'description'          => 'Affitto appartamento',
                'amount'               => rand(750, 950),
                'type'                 => 'spesa',
                'category'             => 'Casa',
                'frequency'            => 'monthly',
                'interval'             => 1,
                'start_date'           => '2025-01-01',
                'next_occurrence_date' => $prossimoMese->copy()->setDay(2)->format('Y-m-d'),
            ],
            [
                'description'          => 'Abbonamento streaming',
                'amount'               => rand(13, 18),
                'type'                 => 'spesa',
                'category'             => 'Svago',
                'frequency'            => 'monthly',
                'interval'             => 1,
                'start_date'           => '2025-01-01',
                'next_occurrence_date' => $prossimoMese->copy()->setDay(3)->format('Y-m-d'),
            ],
            [
                'description'          => 'Stipendio mensile',
                'amount'               => rand(1850, 2150),
                'type'                 => 'entrata',
                'category'             => 'Stipendio',
                'frequency'            => 'monthly',
                'interval'             => 1,
                'start_date'           => '2025-01-01',
                'next_occurrence_date' => $prossimoMese->copy()->setDay(26)->format('Y-m-d'),
            ],
            [
                'description'          => 'Abbonamento palestra',
                'amount'               => rand(30, 50),
                'type'                 => 'spesa',
                'category'             => 'Svago',
                'frequency'            => 'monthly',
                'interval'             => 1,
                'start_date'           => '2025-01-01',
                'next_occurrence_date' => $prossimoMese->copy()->setDay(5)->format('Y-m-d'),
            ],
            [
                'description'          => 'Bolletta luce e gas',
                'amount'               => rand(55, 130),
                'type'                 => 'spesa',
                'category'             => 'Utenze',
                'frequency'            => 'monthly',
                'interval'             => 2,     // ogni 2 mesi
                'start_date'           => '2025-02-01',
                'next_occurrence_date' => $this->prossimaScadenzaBollette()->format('Y-m-d'),
            ],
        ];

        foreach ($ricorrenze as $r) {
            RecurringOperation::create([
                'user_id'              => $this->userId,
                'category_id'          => $this->catId($r['category']),
                'description'          => $r['description'],
                'amount'               => $r['amount'],
                'type'                 => $r['type'],
                'frequency'            => $r['frequency'],
                'interval'             => $r['interval'],
                'start_date'           => $r['start_date'],
                'next_occurrence_date' => $r['next_occurrence_date'],
                'is_active'            => true,
            ]);
        }

        return count($ricorrenze);
    }

    private function prossimaScadenzaBollette(): Carbon
    {
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

    private function creaSnapshot(array $mesi): int
    {
        $count = 0;

        foreach ($mesi as $mese) {
            FinancialSnapshot::updateOrCreate(
                [
                    'user_id'           => $this->userId,
                    'period_type'       => 'monthly',
                    'period_start_date' => $mese['periodo_inizio'],
                ],
                [
                    'period_end_date' => $mese['periodo_fine'],
                    'total_income'    => round($mese['tot_entrate'], 2),
                    'total_expense'   => round($mese['tot_spese'], 2),
                    'balance'         => round($mese['tot_entrate'] - $mese['tot_spese'], 2),
                ]
            );

            $count++;
        }

        return $count;
    }
}
