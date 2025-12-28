<?php

namespace Modules\User\Observers;

use Modules\User\Models\User;

/**
 * UserObserver
 * - Imposta avatar di default
 * - Assegna categorie standard complete (name, type, color, icon)
 */
class UserObserver
{
  public function created(User $user): void
  {
    // --------------------------------------------------
    // Skip durante i test
    // --------------------------------------------------
    if (app()->runningUnitTests()) {
      return;
    }

    // --------------------------------------------------
    // Avatar di default
    // --------------------------------------------------
    if (! $user->avatar) {
      $user->avatar = 'images/avatars/avatar_01_boy.webp';
      $user->save();
    }


    if (! $user->theme) {
      $user->theme = 'dark';
      $user->save();
    }

    // --------------------------------------------------
    // Categorie standard (stesso mapping del Seeder)
    // --------------------------------------------------
    $categories = [
      // ───── SPESE ─────
      ['name' => 'Alimentazione', 'type' => 'spesa', 'color' => '#e17055', 'icon' => 'GiKnifeFork'],
      ['name' => 'Trasporti', 'type' => 'spesa', 'color' => '#2980b9', 'icon' => 'FaCar'],
      ['name' => 'Casa', 'type' => 'spesa', 'color' => '#92400e', 'icon' => 'FiHome'],
      ['name' => 'Utenze', 'type' => 'spesa', 'color' => '#00cec9', 'icon' => 'MdOutlineLightbulb'],
      ['name' => 'Svago', 'type' => 'spesa', 'color' => '#e84393', 'icon' => 'FaGamepad'],
      ['name' => 'Salute', 'type' => 'spesa', 'color' => '#8a1022', 'icon' => 'MdLocalHospital'],
      ['name' => 'Istruzione', 'type' => 'spesa', 'color' => '#262693', 'icon' => 'PiStudentBold'],
      ['name' => 'Viaggi', 'type' => 'spesa', 'color' => '#f39c12', 'icon' => 'FaPlane'],
      ['name' => 'Regali', 'type' => 'spesa', 'color' => '#fd79a8', 'icon' => 'FaGift'],
      ['name' => 'Altro (Spesa)', 'type' => 'spesa', 'color' => '#988282', 'icon' => 'FaEllipsisH'],

      // ───── ENTRATE ─────
      ['name' => 'Stipendio', 'type' => 'entrata', 'color' => '#27ae60', 'icon' => 'FaMoneyBillWave'],
      ['name' => 'Investimenti', 'type' => 'entrata', 'color' => '#1e583b', 'icon' => 'FaChartLine'],
      ['name' => 'Regalo', 'type' => 'entrata', 'color' => '#888848', 'icon' => 'FaGift'],
      ['name' => 'Altro (Entrata)', 'type' => 'entrata', 'color' => '#4e5a54', 'icon' => 'FaEllipsisH'],
    ];

    // --------------------------------------------------
    // Creazione categorie (idempotente)
    // --------------------------------------------------
    foreach ($categories as $cat) {
      $user->categories()->firstOrCreate(
        [
          'name' => $cat['name'],
          'type' => $cat['type'],
        ],
        [
          'color' => $cat['color'],
          'icon'  => $cat['icon'],
        ]
      );
    }
  }
}

/* ------------------------------------------------------
Descrizione file:
Observer utente che intercetta la creazione di un nuovo User
e inizializza:
- avatar di default
- categorie standard complete (name, type, color, icon)

Allineato al CategoriesDBSeeder.
Idempotente (firstOrCreate).
------------------------------------------------------ */
