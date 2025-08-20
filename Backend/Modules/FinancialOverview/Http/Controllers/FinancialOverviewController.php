<?php

namespace Modules\FinancialOverview\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\FinancialOverview\Services\FinancialOverviewService;

class FinancialOverviewController extends Controller
{
    protected FinancialOverviewService $service;

    public function __construct(FinancialOverviewService $service)
    {
        $this->service = $service;
    }

    /**
     * ──────────────────────────────────────────────────────
     * View Blade per il backend (accessibile da browser)
     * Route: /backend/financialoverview (web.php)
     * ──────────────────────────────────────────────────────
     */
    public function indexWeb(Request $request)
    {
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
            'totalEntrate'     => $overviewData['totalEntrate'],
            'totalSpese'       => $overviewData['totalSpese'],
            'balance'          => $overviewData['balance'],
            'sortBy'           => $sortBy,
            'sortDirection'    => $sortDirection,
            'filterStartDate'  => $filters['start_date'] ?? null,
            'filterEndDate'    => $filters['end_date'] ?? null,
        ]);
    }

    /**
     * ──────────────────────────────────────────────────────
     * Endpoint API JSON (usato da Next.js, app, mobile...)
     * Route: /api/v1/financialoverview (api.php)
     * ──────────────────────────────────────────────────────
     */
    public function indexApi(Request $request)
    {
        // ── valida query ─────────────────────────────────────────────────────
        $validated = $request->validate([
            'start_date'  => 'date|nullable',
            'end_date'    => 'date|nullable',
            'description' => 'string|nullable',
            'category_id' => 'integer|nullable',
            'sort'        => 'string|nullable',   // es: "-date,amount"
            'page'        => 'integer|min:1|nullable',
            'per_page'    => 'integer|min:1|max:100|nullable',
        ]);
        // ── compat sort legacy ───────────────────────────────────────────────
        $sort = $validated['sort'] ?? null;
        if ($sort === null) {
            $legacyCol = $request->query('sort_by');
            $legacyDir = $request->query('sort_direction', 'desc');
            if ($legacyCol) $sort = ($legacyDir === 'desc' ? '-' : '') . $legacyCol;
        }
        $sort    = $sort ?: '-date';
        $page    = (int)($validated['page'] ?? 1);
        $perPage = (int)($validated['per_page'] ?? 50);

        $filters = $request->only(['start_date', 'end_date', 'description', 'category_id']);
        $pageData = $this->service->getOverviewEntriesPaginated($request->user(), $filters, $sort, $page, $perPage);
        // ── rimodella: category come oggetto {id,name,type,color} ───────────
        $pageData->setCollection(
            $pageData->getCollection()->map(function ($row) {
                return [
                    'id'          => $row->id,
                    'type'        => $row->type,
                    'date'        => $row->date,
                    'amount'      => $row->amount,
                    'description' => $row->description,
                    'category'    => [
                        'id'    => $row->category_id,
                        'name'  => $row->category_name,
                        'type'  => $row->category_type,
                        'color' => $row->category_color,
                        'icon'  => $row->category_icon,
                    ],
                ];
            })
        );
        // ── compat legacy: se non passi page/per_page → lista flat ──────────
        $legacy = !$request->hasAny(['page', 'per_page']) || $request->boolean('legacy', false);
        return response()->json($legacy ? $pageData->items() : $pageData);
    }
}
