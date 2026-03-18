<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Modules\RecurringOperations\Jobs\ProcessRecurringOperation;
use Modules\RecurringOperations\Models\RecurringOperation;

/**
 * Controller per il trigger esterno delle operazioni ricorrenti.
 *
 * Questo endpoint è pensato per Render.com free tier (o qualsiasi
 * hosting con sleep automatico) dove lo scheduler Laravel non gira
 * in modo affidabile. Un servizio esterno gratuito (es. cron-job.org)
 * chiama questo endpoint ogni 5-10 minuti:
 *
 *   GET /api/v1/internal/process-recurring
 *   Header: X-Cron-Token: <CRON_SECRET>
 *
 * Effetti collaterali:
 *   1. Sveglia il server Render.com dal sleep (cold start)
 *   2. Trova e processa tutte le ricorrenti scadute (catch-up loop incluso)
 *
 * IMPORTANTE: l'endpoint è protetto da token segreto definito in .env.
 * Non richiede autenticazione Sanctum — è per uso machine-to-machine.
 */
class RecurringWebhookController extends Controller
{
    public function process(Request $request): JsonResponse
    {
        // ── Autenticazione via token segreto ──────────────────────────────
        $expectedToken = config('app.cron_secret');

        if (! $expectedToken) {
            Log::warning('[RecurringWebhook] CRON_SECRET non configurato.');
            return response()->json(['error' => 'Endpoint non configurato'], 500);
        }

        $providedToken = $request->header('X-Cron-Token')
            ?? $request->query('token'); // fallback query param per servizi che non supportano header

        if (! hash_equals((string) $expectedToken, (string) $providedToken)) {
            Log::warning('[RecurringWebhook] Token non valido.', ['ip' => $request->ip()]);
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // ── Trova le regole scadute ────────────────────────────────────────
        $rules = RecurringOperation::where('is_active', true)
            ->where('next_occurrence_date', '<=', Carbon::today()->endOfDay())
            ->get();

        $count = $rules->count();

        if ($count === 0) {
            return response()->json([
                'status'    => 'ok',
                'processed' => 0,
                'message'   => 'Nessuna ricorrente scaduta.',
            ]);
        }

        // ── Processa in modo SINCRONO (nessun queue:work necessario) ──────
        // Su Render.com free non possiamo fare affidamento sul queue worker.
        // Eseguiamo il job inline: il loop catch-up gestisce eventuali date arretrate.
        $processed = 0;
        $errors    = 0;

        foreach ($rules as $rule) {
            try {
                (new ProcessRecurringOperation($rule))->handle();
                $processed++;
            } catch (\Throwable $e) {
                $errors++;
                Log::error("[RecurringWebhook] Errore su regola ID {$rule->id}: {$e->getMessage()}");
            }
        }

        Log::info("[RecurringWebhook] Completato: {$processed} ok, {$errors} errori.");

        return response()->json([
            'status'    => 'ok',
            'processed' => $processed,
            'errors'    => $errors,
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
