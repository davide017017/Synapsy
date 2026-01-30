<?php

declare(strict_types=1);

namespace Modules\Categories\Services;

// ────────────────────────────────────────────────────────────────
// CategoryDefaults — definizione categorie standard + meta
// ────────────────────────────────────────────────────────────────
class CategoryDefaults
{
  // ------------------------------------------------------------
  // Categorie standard: nome => tipo
  // ------------------------------------------------------------
  public static function standard(): array
  {
    return [
      'Alimentazione' => 'spesa',
      'Trasporti' => 'spesa',
      'Casa' => 'spesa',
      'Utenze' => 'spesa',
      'Svago' => 'spesa',
      'Salute' => 'spesa',
      'Istruzione' => 'spesa',
      'Viaggi' => 'spesa',
      'Regali' => 'spesa',
      'Altro (Spesa)' => 'spesa',
      'Stipendio' => 'entrata',
      'Investimenti' => 'entrata',
      'Regalo' => 'entrata',
      'Altro (Entrata)' => 'entrata',
    ];
  }

  // ------------------------------------------------------------
  // Meta: nome => [color, icon]
  // ------------------------------------------------------------
  public static function meta(): array
  {
    return [
      // Spesa
      'Alimentazione' => ['color' => '#e17055', 'icon' => 'GiKnifeFork'],
      'Trasporti' => ['color' => '#2980b9', 'icon' => 'FaCar'],
      'Casa' => ['color' => '#92400e', 'icon' => 'FiHome'],
      'Utenze' => ['color' => '#00cec9', 'icon' => 'MdOutlineLightbulb'],
      'Svago' => ['color' => '#e84393', 'icon' => 'FaGamepad'],
      'Salute' => ['color' => '#8a1022', 'icon' => 'MdLocalHospital'],
      'Istruzione' => ['color' => '#262693', 'icon' => 'PiStudentBold'],
      'Viaggi' => ['color' => '#f39c12', 'icon' => 'FaPlane'],
      'Regali' => ['color' => '#fd79a8', 'icon' => 'FaGift'],
      'Altro (Spesa)' => ['color' => '#988282', 'icon' => 'FaEllipsisH'],

      // Entrata
      'Stipendio' => ['color' => '#27ae60', 'icon' => 'FaMoneyBillWave'],
      'Investimenti' => ['color' => '#1e583b', 'icon' => 'FaChartLine'],
      'Regalo' => ['color' => '#888848', 'icon' => 'FaGift'],
      'Altro (Entrata)' => ['color' => '#4e5a54', 'icon' => 'FaEllipsisH'],
    ];
  }
}

/* ===================================================
File: CategoryDefaults.php
Scopo: centralizza la lista di categorie standard e la loro meta (color/icon).
Come: espone due metodi statici (standard e meta) usabili sia da seed che da bootstrap utente.
=================================================== */
