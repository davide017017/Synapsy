<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Modules\User\Models\User;
use Modules\FinancialOverview\Services\FinancialOverviewService;

class Kernel extends ConsoleKernel
{
    /**
     * Definizione dei comandi programmati.
     */
    protected function schedule(Schedule $schedule): void
    {
        // =========================================================================
        // Modulo RecurringOperations – Generazione ricorrenze
        // =========================================================================
        $schedule->command('recurring:generate')
            ->everyMinute()
            ->withoutOverlapping()
            ->appendOutputTo(storage_path('logs/recurring_generate.log'));

        // =========================================================================
        // Modulo FinancialOverview – Snapshot Giornaliero
        // =========================================================================
        $schedule->call(function () {
            $this->forEachUser(fn (User $user) =>
                app(FinancialOverviewService::class)->snapshotDaily($user, now())
            );
        })->dailyAt('23:59');

        // =========================================================================
        // Modulo FinancialOverview – Snapshot Mensile
        // =========================================================================
        $schedule->call(function () {
            $this->forEachUser(fn (User $user) =>
                app(FinancialOverviewService::class)->snapshotMonthly($user, now())
            );
        })->monthlyOn(1, '00:01');

        // =========================================================================
        // Modulo FinancialOverview – Snapshot Annuale
        // =========================================================================
        $schedule->call(function () {
            $this->forEachUser(fn (User $user) =>
                app(FinancialOverviewService::class)->snapshotYearly($user, now())
            );
        })->yearlyOn(12, 31, '23:59');

        // =========================================================================
        // Modulo FinancialOverview – Snapshot Corrente (aggiornato giornalmente)
        // =========================================================================
        $schedule->call(function () {
            $this->forEachUser(fn (User $user) =>
                app(FinancialOverviewService::class)->snapshotCurrent($user)
            );
        })->dailyAt('00:15');
    }

    /**
     * Caricamento dei comandi console personalizzati.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');
    }

    /**
     * Utility: esegue una callback per ogni utente.
     */
    protected function forEachUser(callable $callback): void
    {
        User::all()->each($callback);
    }
}
