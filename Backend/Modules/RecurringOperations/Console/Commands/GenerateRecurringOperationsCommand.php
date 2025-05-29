<?php

namespace Modules\RecurringOperations\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\RecurringOperations\Jobs\ProcessRecurringOperation;

/**
 * Comando per generare operazioni ricorrenti in base alle regole configurate.
 */
class GenerateRecurringOperationsCommand extends Command
{
    /**
     * Nome e firma del comando.
     *
     * @var string
     */
    protected $signature = 'custom:generate-recurring-operations';

    /**
     * Descrizione del comando.
     *
     * @var string
     */
    protected $description = 'Trova tutte le regole ricorrenti scadute e mette in coda i job per generare le transazioni.';

    /**
     * Esecuzione del comando.
     *
     * @return int
     */
    public function handle(): int
    {
        Log::channel('recurring_operations')->info('Inizio comando custom:generate-recurring-operations alle ' . now());

        $this->info('🔍 Cerco regole ricorrenti scadute...');

        $rulesToProcess = RecurringOperation::where('is_active', true)
            ->where('next_occurrence_date', '<=', Carbon::today()->endOfDay())
            ->get();

        $count = $rulesToProcess->count();

        if ($count === 0) {
            $this->info('✅ Nessuna regola ricorrente scaduta trovata.');
            return Command::SUCCESS;
        }

        $this->info("📦 Trovate {$count} regole scadute. Invio i job...");

        foreach ($rulesToProcess as $rule) {
            ProcessRecurringOperation::dispatch($rule);
            $this->info("➡️  Job messo in coda per la regola ID: {$rule->id}");
        }

        $this->info('🎯 Completato. Tutti i job sono stati inviati.');

        return Command::SUCCESS;
    }
}
