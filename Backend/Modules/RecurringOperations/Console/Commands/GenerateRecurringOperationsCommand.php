<?php

namespace Modules\RecurringOperations\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Modules\RecurringOperations\Jobs\ProcessRecurringOperation;
use Modules\RecurringOperations\Models\RecurringOperation;

/**
 * Comando per generare operazioni ricorrenti in base alle regole configurate.
 *
 * STATO: non schedulato (rimosso da app/Console/Kernel.php — dead code su
 * Render free tier, nessun worker queue persistente per processare i job
 * accodati). Generazione ora via webhook cron-job.org
 * (RecurringWebhookController) + catch-up al login (RecurringCatchUpController).
 * Lasciato nel repo, invocabile manualmente, per eventuale riattivazione
 * futura su un piano con worker queue persistente.
 */
class GenerateRecurringOperationsCommand extends Command {
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
   */
  public function handle(): int {
    Log::channel('recurring_operations')->info('Inizio comando custom:generate-recurring-operations alle ' . now());

    $this->info('🔍 Cerco regole ricorrenti scadute...');

    $rulesToProcess = RecurringOperation::whereRaw('is_active = true')
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
