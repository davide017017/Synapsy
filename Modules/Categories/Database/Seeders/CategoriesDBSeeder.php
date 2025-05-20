<?php

namespace Modules\Categories\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Categories\Models\Category;
use Modules\User\Models\User;
use App\Traits\TruncatesTable;
use App\Traits\LogsSeederOutput;

class CategoriesDBSeeder extends Seeder
{
    use TruncatesTable, LogsSeederOutput;

    public function run(): void
    {
        $this->initOutput();

        // =========================================================================
        // 🔄 Pulizia tabella
        // =========================================================================
        $this->logInfo('Categories', 'Pulizia tabella `categories`...', '🧹');
        $this->clearTable(Category::class);

        // =========================================================================
        // 📋 Categorie standard
        // =========================================================================
        $categorieStandard = [
            'Alimentazione'     => 'spesa',
            'Trasporti'         => 'spesa',
            'Casa'              => 'spesa',
            'Utenze'            => 'spesa',
            'Svago'             => 'spesa',
            'Salute'            => 'spesa',
            'Istruzione'        => 'spesa',
            'Viaggi'            => 'spesa',
            'Regali'            => 'spesa',
            'Altro (Spesa)'     => 'spesa',
            'Stipendio'         => 'entrata',
            'Investimenti'      => 'entrata',
            'Regalo'            => 'entrata',
            'Altro (Entrata)'   => 'entrata',
        ];

        // =========================================================================
        // 👥 Recupero utenti
        // =========================================================================
        $utenti = User::all();
        if ($utenti->isEmpty()) {
            $this->logWarning('Categories', 'Nessun utente trovato. Creazione utente seed...', '⚠️');
            $utenti = collect([
                User::factory()->create([
                    'email'    => 'seed@example.com',
                    'password' => bcrypt('password123'),
                ])
            ]);
        }

        // =========================================================================
        // 🏷️ Assegnazione categorie
        // =========================================================================
        foreach ($utenti as $utente) {
            foreach ($categorieStandard as $nomeCategoria => $tipo) {
                Category::factory()->create([
                    'name'    => $nomeCategoria,
                    'type'    => $tipo,
                    'user_id' => $utente->id,
                ]);
            }
            $this->logInfo('Categories', "Categorie standard generate per utente ID {$utente->id}", '➕');
        }

        // =========================================================================
        // ✅ Fine seeding
        // =========================================================================
        $this->logSuccess('Categories', 'Tutti gli utenti hanno le categorie standard.');
        $this->logNewLine();
    }
}
