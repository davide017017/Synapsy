<?php

namespace Modules\DBCore\Console\Commands;

use Illuminate\Console\Command;
use Modules\User\Models\User;
use Modules\User\Services\ReseedDemoDataService;

class DemoReseedCommand extends Command
{
    protected $signature = 'demo:reseed';

    protected $description = 'Cancella e ripopola i dati di demo@synapsy.app con transazioni realistiche dal 01/01/2025 ad oggi.';

    public function handle(): int
    {
        $this->newLine();
        $this->line('🔄 <fg=cyan;options=bold>Demo Reseed — Synapsy</>');
        $this->line('─────────────────────────────────────────────────────────────────');
        $this->newLine();

        // ── Verifica utente demo ──────────────────────────────────────────────

        $user = User::where('email', 'demo@synapsy.app')->first();

        if (! $user) {
            $this->error('❌ Utente demo@synapsy.app non trovato. Esegui prima il seeding base.');
            return Command::FAILURE;
        }

        $this->line("👤 Utente demo trovato (ID: {$user->id})");
        $this->newLine();

        // ── Esecuzione ────────────────────────────────────────────────────────

        $inizio    = microtime(true);
        $risultato = ReseedDemoDataService::run($user);
        $fineMs    = round((microtime(true) - $inizio) * 1000);

        // ── Riepilogo pulizia ─────────────────────────────────────────────────

        $this->line('🧹 <fg=yellow>Pulizia dati precedenti:</>');
        foreach ($risultato['cleanup'] as $tabella => $n) {
            $this->line("   <fg=gray>✓</> {$tabella}: <fg=red>{$n}</> righe eliminate");
        }
        $this->newLine();

        // ── Riepilogo mensile ─────────────────────────────────────────────────

        $this->line('📅 <fg=yellow>Generazione dati 01/01/2025 → oggi:</>');
        $this->newLine();

        $totSpeseTot   = 0.0;
        $totEntrateTot = 0.0;

        foreach ($risultato['mesi'] as $mese) {
            $label      = str_pad($mese['label'], 16);
            $nSpese     = str_pad((string) $mese['n_spese'], 2, ' ', STR_PAD_LEFT);
            $nEntrate   = str_pad((string) $mese['n_entrate'], 1, ' ', STR_PAD_LEFT);
            $totSpesa   = number_format($mese['tot_spese'], 2, ',', '.');
            $totEntrata = number_format($mese['tot_entrate'], 2, ',', '.');
            $saldo      = $mese['tot_entrate'] - $mese['tot_spese'];
            $saldoStr   = ($saldo >= 0 ? '+' : '') . number_format($saldo, 2, ',', '.');
            $saldoColor = $saldo >= 0 ? 'green' : 'red';

            $this->line(
                "   {$label} │ {$nSpese} spese │ {$nEntrate} entrate │ " .
                "uscite <fg=red>-€{$totSpesa}</> │ entrate <fg=green>+€{$totEntrata}</> │ " .
                "saldo <fg={$saldoColor}>{$saldoStr}€</>"
            );

            $totSpeseTot   += $mese['tot_spese'];
            $totEntrateTot += $mese['tot_entrate'];
        }

        // ── Totali complessivi ────────────────────────────────────────────────

        $this->newLine();
        $this->line('─────────────────────────────────────────────────────────────────');

        $saldoTot      = $totEntrateTot - $totSpeseTot;
        $saldoTotStr   = ($saldoTot >= 0 ? '+' : '') . number_format($saldoTot, 2, ',', '.');
        $saldoTotColor = $saldoTot >= 0 ? 'green' : 'red';

        $this->line(
            '   <options=bold>TOTALE</options>           │ uscite <fg=red>-€' . number_format($totSpeseTot, 2, ',', '.') . '</> │ ' .
            'entrate <fg=green>+€' . number_format($totEntrateTot, 2, ',', '.') . '</> │ ' .
            'saldo <fg=' . $saldoTotColor . '>' . $saldoTotStr . '€</>'
        );

        $this->line('─────────────────────────────────────────────────────────────────');
        $this->newLine();

        // ── Riepilogo strutture ───────────────────────────────────────────────

        $this->line("📊 Ricorrenze create: <fg=cyan>{$risultato['n_ricorrenze']}</>");
        $this->line("📸 Snapshot mensili creati: <fg=cyan>{$risultato['n_snapshots']}</>");
        $this->newLine();
        $this->info("✅ Demo reseed completato in {$fineMs}ms.");
        $this->newLine();

        return Command::SUCCESS;
    }
}
