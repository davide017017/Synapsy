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
            'Alimentazione'   => ['color' => '#f5e9da', 'icon' => 'GiKnifeFork'],           // beige pastello, cibo
            'Trasporti'       => ['color' => '#b3c6f8', 'icon' => 'FaCar'],                 // blu pastello, auto
            'Casa'            => ['color' => '#d6bfa7', 'icon' => 'FiHome'],                // marroncino/beige, casa
            'Utenze'          => ['color' => '#b8e0ea', 'icon' => 'MdOutlineLightbulb'],    // ciano pastello, lampadina
            'Svago'           => ['color' => '#f7c5e0', 'icon' => 'FaGamepad'],             // rosa chiarissimo, joystick
            'Salute'          => ['color' => '#ffb3b3', 'icon' => 'MdLocalHospital'],       // rosso pastello, croce
            'Istruzione'      => ['color' => '#8b9dc3', 'icon' => 'PiStudentBold'],         // blu scuro soft, cappello laurea
            'Viaggi'          => ['color' => '#b3ecf6', 'icon' => 'FaPlane'],               // azzurro cielo, aereo
            'Regali'          => ['color' => '#cbb4d4', 'icon' => 'FaGift'],                // viola pastello, regalo
            'Altro (Spesa)'   => ['color' => '#e0d6d1', 'icon' => 'FaEllipsisH'],           // misto rosato/grigio, puntini
            'Stipendio'       => ['color' => '#89b99b', 'icon' => 'FaMoneyBillWave'],       // verde scuro/grigio, soldi
            'Investimenti'    => ['color' => '#c3f6e5', 'icon' => 'FaChartLine'],           // verde menta, grafico
            'Regalo'          => ['color' => '#b7e2d1', 'icon' => 'FaGift'],                // verde menta/viola, regalo
            'Altro (Entrata)' => ['color' => '#cdd7ce', 'icon' => 'FaEllipsisH'],           // misto verde-grigio, puntini

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
