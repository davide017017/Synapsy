<?php

declare(strict_types=1);

namespace Modules\User\Services;

use Modules\User\Models\User;
use Illuminate\Support\Facades\DB;

class DeleteUserWithAllDataService
{
  /**
   * Elimina DEFINITIVAMENTE un utente e TUTTI i suoi dati collegati.
   * HARD DELETE — irreversibile.
   */
  public static function run(User $user): void
  {
    $userId = $user->id;

    // ─────────────────────────
    // AUDIT LOGS → ANONIMIZZA
    // ─────────────────────────
    if (DB::getSchemaBuilder()->hasTable('audit_logs')) {
      DB::table('audit_logs')
        ->where('user_id', $userId)
        ->update(['user_id' => null]);
    }

    // ─────────────────────────
    // FIGLI
    // ─────────────────────────
    DB::table('financial_snapshots')->where('user_id', $userId)->delete();
    DB::table('spese')->where('user_id', $userId)->delete();
    DB::table('entrate')->where('user_id', $userId)->delete();
    DB::table('recurring_operations')->where('user_id', $userId)->delete();
    DB::table('categories')->where('user_id', $userId)->delete();

    // ─────────────────────────
    // USER (ULTIMO)
    // ─────────────────────────
    $user->forceDelete();
  }
}
