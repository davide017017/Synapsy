<?php

namespace Modules\FinancialOverview\Services;

use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Modules\FinancialOverview\Models\FinancialSnapshot;
use Modules\User\Models\User;

/**
 * Servizio per la gestione delle panoramiche finanziarie.
 * Fornisce riepiloghi aggregati e snapshot persistenti.
 */
class FinancialOverviewService
{
    // ─────────────────────────────────────────────────────────────────────────
    // Entries paginati (UNION ALL spese+entrate) con filtri e sort whitelist
    // sort es: "-date,amount" | allowed: date, amount, type
    // ─────────────────────────────────────────────────────────────────────────
    public function getOverviewEntriesPaginated($user, array $filters, string $sort, int $page, int $perPage): LengthAwarePaginator
    {
        $uid = $user->id;

        $spese = DB::table('spese')->select([
            'id',
            'user_id',
            'date',
            'amount',
            'category_id',
            'description',
            DB::raw("'spesa' as type"),
        ])->where('user_id', $uid);

        $entrate = DB::table('entrate')->select([
            'id',
            'user_id',
            'date',
            'amount',
            'category_id',
            'description',
            DB::raw("'entrata' as type"),
        ])->where('user_id', $uid);

        $apply = function ($q) use ($filters) {
            if (! empty($filters['start_date'])) {
                $q->whereDate('date', '>=', $filters['start_date']);
            }
            if (! empty($filters['end_date'])) {
                $q->whereDate('date', '<=', $filters['end_date']);
            }
            if (! empty($filters['category_id'])) {
                $q->where('category_id', $filters['category_id']);
            }
            if (! empty($filters['description'])) {
                $q->where('description', 'like', "%{$filters['description']}%");
            }
        };
        $apply($spese);
        $apply($entrate);

        $union = $spese->unionAll($entrate);
        $q = DB::query()->fromSub($union, 't');
        // ── unisci categorie per avere campi name/type/color ───────────────
        $q = DB::query()
            ->fromSub($union, 't')
            ->leftJoin('categories as c', 'c.id', '=', 't.category_id')
            ->select(
                't.id',
                't.user_id',
                't.date',
                't.amount',
                't.category_id',
                't.description',
                't.type',
                // ── campi categoria (aggiunto icon) ─────────────────────────
                'c.name  as category_name',
                'c.type  as category_type',
                'c.color as category_color',
                'c.icon  as category_icon'
            );

        $allowed = ['date', 'amount', 'type'];
        $parts = array_filter(explode(',', $sort ?: '-date'));
        foreach ($parts as $s) {
            $dir = str_starts_with($s, '-') ? 'desc' : 'asc';
            $col = ltrim($s, '-');
            if (in_array($col, $allowed, true)) {
                $q->orderBy($col, $dir);
            }
        }
        if (empty($parts)) {
            $q->orderBy('date', 'desc');
        }

        return $q->paginate($perPage, ['*'], 'page', $page);
    }

    // ============================
    // Query methods
    // ============================

    /**
     * Restituisce la panoramica aggregata di entrate e spese con filtri e ordinamento.
     */
    public function getOverviewData(User $user, array $filters, string $sortBy = 'date', string $sortDirection = 'desc'): array
    {
        $cacheKey = $this->makeCacheKey($user->id, $filters, $sortBy, $sortDirection);

        return Cache::tags(['financial_overview', 'user:' . $user->id])
            ->remember($cacheKey, now()->addMinutes(10), function () use ($user, $filters, $sortBy, $sortDirection) {
                $entrateQuery = $user->entrate()->with('category');
                $speseQuery = $user->spese()->with('category');

                if (! empty($filters['start_date'])) {
                    $entrateQuery->whereDate('date', '>=', $filters['start_date']);
                    $speseQuery->whereDate('date', '>=', $filters['start_date']);
                }

                if (! empty($filters['end_date'])) {
                    $entrateQuery->whereDate('date', '<=', $filters['end_date']);
                    $speseQuery->whereDate('date', '<=', $filters['end_date']);
                }

                // --------------------------------------------------
                // Recupera entrate e spese ordinate dalla più recente
                // --------------------------------------------------
                $entrate = $entrateQuery->orderByDesc('date')->get();
                $spese = $speseQuery->orderByDesc('date')->get();

                // --------------------------------------------------
                // Unisce e ordina i risultati (fallback su created_at)
                // --------------------------------------------------
                $financialEntries = $entrate
                    ->concat($spese)
                    ->sortBy(
                        function ($item) use ($sortBy) {
                            return match ($sortBy) {
                                'type' => class_basename($item),
                                'category' => $item->category?->name ?? '',
                                default => $item->{$sortBy} ?? $item->created_at,
                            };
                        },
                        SORT_REGULAR,
                        $sortDirection === 'desc'
                    )
                    ->values(); // Reindicizza per preservare l'ordine JSON

                return [
                    'financialEntries' => $financialEntries,
                    'totalEntrate' => $entrate->sum('amount'),
                    'totalSpese' => $spese->sum('amount'),
                    'balance' => $entrate->sum('amount') - $spese->sum('amount'),
                ];
            });
    }

    protected function makeCacheKey(int $userId, array $filters, string $sortBy, string $sortDirection): string
    {
        $filtersKey = md5(json_encode($filters));

        return "financial_overview:{$userId}:{$filtersKey}:{$sortBy}:{$sortDirection}";
    }

    // ============================
    // Snapshot methods
    // ============================

    /**
     * Crea o aggiorna uno snapshot mensile.
     */
    public function snapshotMonthly(User $user, Carbon $date): FinancialSnapshot
    {
        $start = $date->copy()->startOfMonth();
        $end = $date->copy()->endOfMonth();

        return $this->generateSnapshot($user, 'monthly', $start, $end);
    }

    /**
     * Crea o aggiorna uno snapshot giornaliero.
     */
    public function snapshotDaily(User $user, Carbon $date): FinancialSnapshot
    {
        $start = $date->copy()->startOfDay();
        $end = $date->copy()->endOfDay();

        return $this->generateSnapshot($user, 'daily', $start, $end);
    }

    /**
     * Crea o aggiorna uno snapshot annuale.
     */
    public function snapshotYearly(User $user, Carbon $date): FinancialSnapshot
    {
        $start = $date->copy()->startOfYear();
        $end = $date->copy()->endOfYear();

        return $this->generateSnapshot($user, 'yearly', $start, $end);
    }

    /**
     * Crea o aggiorna uno snapshot dell’anno in corso fino ad oggi.
     */
    public function snapshotCurrent(User $user): FinancialSnapshot
    {
        $start = now()->copy()->startOfYear();
        $end = now()->copy()->endOfDay();

        return $this->generateSnapshot($user, 'current', $start, $end);
    }

    // ============================
    // Internal snapshot builder
    // ============================

    /**
     * Metodo interno riutilizzabile per generare snapshot.
     */
    protected function generateSnapshot(User $user, string $periodType, Carbon $start, Carbon $end): FinancialSnapshot
    {
        $entrateQuery = $user->entrate()->whereBetween('date', [$start, $end]);
        $speseQuery = $user->spese()->whereBetween('date', [$start, $end]);

        $income = round($entrateQuery->sum('amount'), 2);
        $expense = round($speseQuery->sum('amount'), 2);
        $balance = round($income - $expense, 2);

        return FinancialSnapshot::updateOrCreate(
            [
                'user_id' => $user->id,
                'period_type' => $periodType,
                'period_start_date' => $start->toDateString(),
            ],
            [
                'period_end_date' => $end->toDateString(),
                'total_income' => $income,
                'total_expense' => $expense,
                'balance' => $balance,
            ]
        );
    }
}
