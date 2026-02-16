<?php

namespace Modules\FinancialOverview\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\FinancialOverview\Services\FinancialOverviewService;

class FinancialOverviewController extends Controller {
  protected FinancialOverviewService $service;

  public function __construct(FinancialOverviewService $service) {
    $this->service = $service;
  }

  /**
   * ──────────────────────────────────────────────────────
   * View Blade per il backend (accessibile da browser)
   * Route: /backend/financialoverview (web.php)
   * ──────────────────────────────────────────────────────
   */
  public function indexWeb(Request $request) {
    $user = $request->user();

    // Filtri e parametri ordinamento (personalizza se vuoi)
    $filters = $request->only(['start_date', 'end_date']);
    $sortBy = $request->query('sort_by', 'date');
    $sortDirection = $request->query('sort_direction', 'desc');

    // Calcolo overview
    $overviewData = $this->service->getOverviewData($user, $filters, $sortBy, $sortDirection);

    // Restituisci la view Blade
    return view('financialoverview::index', [
      'financialEntries' => $overviewData['financialEntries'],
      'totalEntrate' => $overviewData['totalEntrate'],
      'totalSpese' => $overviewData['totalSpese'],
      'balance' => $overviewData['balance'],
      'sortBy' => $sortBy,
      'sortDirection' => $sortDirection,
      'filterStartDate' => $filters['start_date'] ?? null,
      'filterEndDate' => $filters['end_date'] ?? null,
    ]);
  }

  /**
   * ──────────────────────────────────────────────────────
   * Endpoint API JSON (usato da Next.js, app, mobile...)
   * Route: /api/v1/financialoverview (api.php)
   * ──────────────────────────────────────────────────────
   */
  public function indexApi(Request $request) {
    $validated = $request->validate([
      'start_date' => 'date|nullable',
      'end_date' => 'date|nullable',
      'description' => 'string|nullable',
      'category_id' => 'integer|nullable',
      'sort' => 'string|nullable',
    ]);

    $sort = $validated['sort'] ?? '-date';

    $filters = $request->only([
      'start_date',
      'end_date',
      'description',
      'category_id'
    ]);

    $rows = $this->service->getOverviewEntries(
      $request->user(),
      $filters,
      $sort
    );

    $data = $rows->map(function ($row) {
      return [
        'id' => $row->id,
        'type' => $row->type,
        'date' => $row->date,
        'amount' => $row->amount,
        'description' => $row->description,
        'category' => [
          'id' => $row->category_id,
          'name' => $row->category_name,
          'type' => $row->category_type,
          'color' => $row->category_color,
          'icon' => $row->category_icon,
        ],
      ];
    });

    return response()->json($data);
  }
};
