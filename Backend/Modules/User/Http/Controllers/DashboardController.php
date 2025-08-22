<?php

namespace Modules\User\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Modules\Entrate\Models\Entrata;
use Modules\Spese\Models\Spesa;

// ─────────────────────────────────────────────────────────────────────────────
// Controller: DashboardController
// Dettagli: restituisce riepilogo del mese corrente in formato JSON
// ─────────────────────────────────────────────────────────────────────────────
class DashboardController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: index
    // Dettagli: totali e conteggi delle operazioni del mese corrente
    // ─────────────────────────────────────────────────────────────────────────────
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $start = now()->startOfMonth()->toDateString();
        $end = now()->toDateString();

        $entrateSum = Entrata::where('user_id', $user->id)
            ->whereBetween('date', [$start, $end])
            ->sum('amount');
        $speseSum = Spesa::where('user_id', $user->id)
            ->whereBetween('date', [$start, $end])
            ->sum('amount');

        $entrateCount = Entrata::where('user_id', $user->id)
            ->whereBetween('date', [$start, $end])
            ->count();
        $speseCount = Spesa::where('user_id', $user->id)
            ->whereBetween('date', [$start, $end])
            ->count();

        return response()->json([
            'period' => [
                'start' => $start,
                'end' => $end,
            ],
            'totals' => [
                'entrate_month' => $entrateSum,
                'spese_month' => $speseSum,
                'balance_month' => $entrateSum - $speseSum,
            ],
            'counts' => [
                'entrate' => $entrateCount,
                'spese' => $speseCount,
            ],
        ]);
    }
}
