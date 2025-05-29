<?php

namespace Modules\Spese\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\Spese\Models\Spesa;
use App\Traits\TruncatesTable;
use App\Traits\LogsSeederOutput;

class SpeseDBSeeder extends Seeder
{
    use TruncatesTable, LogsSeederOutput;

    public function run(): void
    {
        $this->initOutput();

        Model::withoutEvents(function () {
            // =========================================================================
            // 🔄 Pulizia tabella
            // =========================================================================
            $this->logInfo('Spese', 'Pulizia tabella `spese`...', '🧹');
            $this->clearTable(Spesa::class);

            // =========================================================================
            // 👥 Recupero utenti
            // =========================================================================
            $users = User::all();
            if ($users->isEmpty()) {
                $this->logSkip('Spese', 'Nessun utente trovato. Seeder ignorato.');
                return;
            }

            // =========================================================================
            // 🔢 Parametri
            // =========================================================================
            $spesePerCategoria = 2;
            $totali = 0;

            // =========================================================================
            // 🧾 Creazione spese
            // =========================================================================
            foreach ($users as $user) {
                $categories = $user->categories()->where('type', 'spesa')->get();
                if ($categories->isEmpty()) {
                    continue;
                }

                foreach ($categories as $category) {
                    Spesa::factory()
                        ->count($spesePerCategoria)
                        ->create([
                            'user_id'     => $user->id,
                            'category_id' => $category->id,
                        ]);

                    $totali += $spesePerCategoria;
                }

                $this->logInfo('Spese', "Spese generate per utente: {$user->name} (ID: {$user->id})", '➕');
            }

            // =========================================================================
            // ✅ Fine seeding
            // =========================================================================
            $this->logSuccess('Spese', "{$totali} spese generate in totale.");
            $this->logNewLine();
        });
    }
}
