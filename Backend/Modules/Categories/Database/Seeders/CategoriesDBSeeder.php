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
        // 🎨 Mappa categoria → colore e icona
        // =========================================================================
        $categoryMeta = [
            // Spesa
            'Alimentazione'   => ['color' => '#e17055', 'icon' => 'GiKnifeFork'],
            'Trasporti'       => ['color' => '#2980b9', 'icon' => 'FaCar'],
            'Casa'            => ['color' => '#92400e', 'icon' => 'FiHome'],
            'Utenze'          => ['color' => '#00cec9', 'icon' => 'MdOutlineLightbulb'],
            'Svago'           => ['color' => '#e84393', 'icon' => 'FaGamepad'],
            'Salute'          => ['color' => '#8a1022', 'icon' => 'MdLocalHospital'],
            'Istruzione'      => ['color' => '#262693', 'icon' => 'PiStudentBold'],
            'Viaggi'          => ['color' => '#f39c12', 'icon' => 'FaPlane'],
            'Regali'          => ['color' => '#fd79a8', 'icon' => 'FaGift'],
            'Altro (Spesa)'   => ['color' => '#988282', 'icon' => 'FaEllipsisH'],

            // Entrata
            'Stipendio'       => ['color' => '#27ae60', 'icon' => 'FaMoneyBillWave'],
            'Investimenti'    => ['color' => '#1e583b', 'icon' => 'FaChartLine'],
            'Regalo'          => ['color' => '#888848', 'icon' => 'FaGift'],
            'Altro (Entrata)' => ['color' => '#4e5a54', 'icon' => 'FaEllipsisH'],
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
                $meta = $categoryMeta[$nomeCategoria] ?? ['color' => null, 'icon' => null];
                Category::factory()->create([
                    'name'    => $nomeCategoria,
                    'type'    => $tipo,
                    'user_id' => $utente->id,
                    'color'   => $meta['color'],
                    'icon'    => $meta['icon'],
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
