<?php

namespace Modules\FinancialOverview\Services;

use Carbon\Carbon;
use Modules\FinancialOverview\Models\FinancialSnapshot;
use Modules\User\Models\User;


/**
 * Servizio per la gestione delle panoramiche finanziarie.
 * Fornisce riepiloghi aggregati e snapshot persistenti.
 */
class FinancialOverviewService
{
    // ============================
    // Query methods
    // ============================

    /**
     * Restituisce la panoramica aggregata di entrate e spese con filtri e ordinamento.
     */
    public function getOverviewData(User $user, array $filters, string $sortBy = 'date', string $sortDirection = 'desc'): array
    {
        $entrateQuery = $user->entrate()->with('category');
        $speseQuery   = $user->spese()->with('category');

        if (!empty($filters['start_date'])) {
            $entrateQuery->whereDate('date', '>=', $filters['start_date']);
            $speseQuery->whereDate('date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $entrateQuery->whereDate('date', '<=', $filters['end_date']);
            $speseQuery->whereDate('date', '<=', $filters['end_date']);
        }

        $entrate = $entrateQuery->get();
        $spese   = $speseQuery->get();

        $financialEntries = $entrate->concat($spese)->sortBy(function ($item) use ($sortBy) {
            return match ($sortBy) {
                'type'     => class_basename($item),
                'category' => $item->category->name ?? '',
                default    => $item->{$sortBy}
            };
        }, SORT_REGULAR, $sortDirection === 'desc');

        return [
            'financialEntries' => $financialEntries,
            'totalEntrate'     => $entrate->sum('amount'),
            'totalSpese'       => $spese->sum('amount'),
            'balance'          => $entrate->sum('amount') - $spese->sum('amount'),
        ];
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
        $end   = $date->copy()->endOfMonth();

        return $this->generateSnapshot($user, 'monthly', $start, $end);
    }

    /**
     * Crea o aggiorna uno snapshot giornaliero.
     */
    public function snapshotDaily(User $user, Carbon $date): FinancialSnapshot
    {
        $start = $date->copy()->startOfDay();
        $end   = $date->copy()->endOfDay();

        return $this->generateSnapshot($user, 'daily', $start, $end);
    }

    /**
     * Crea o aggiorna uno snapshot annuale.
     */
    public function snapshotYearly(User $user, Carbon $date): FinancialSnapshot
    {
        $start = $date->copy()->startOfYear();
        $end   = $date->copy()->endOfYear();

        return $this->generateSnapshot($user, 'yearly', $start, $end);
    }

    /**
     * Crea o aggiorna uno snapshot dell’anno in corso fino ad oggi.
     */
    public function snapshotCurrent(User $user): FinancialSnapshot
    {
        $start = now()->copy()->startOfYear();
        $end   = now()->copy()->endOfDay();

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
        $speseQuery   = $user->spese()->whereBetween('date', [$start, $end]);

        $income  = round($entrateQuery->sum('amount'), 2);
        $expense = round($speseQuery->sum('amount'), 2);
        $balance = round($income - $expense, 2);

        return FinancialSnapshot::updateOrCreate(
            [
                'user_id'           => $user->id,
                'period_type'       => $periodType,
                'period_start_date' => $start->toDateString(),
            ],
            [
                'period_end_date'   => $end->toDateString(),
                'total_income'      => $income,
                'total_expense'     => $expense,
                'balance'           => $balance,
            ]
        );
    }
}
