<?php

namespace Modules\FinancialOverview\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Modules\FinancialOverview\Services\FinancialOverviewService;

class FinancialOverviewController extends Controller
{
    // ============================
    // Constructor
    // ============================
    public function __construct(protected FinancialOverviewService $service)
    {
        $this->middleware('auth:sanctum');
    }

    // ============================
    // Index - Show Financial Overview
    // ============================
    public function index(Request $request): View
    {
        $user = $request->user();

        $filters = $request->only(['start_date', 'end_date']);
        $sortBy = in_array($request->query('sort_by'), ['date', 'description', 'amount', 'notes', 'type', 'category']) 
            ? $request->query('sort_by') 
            : 'date';
        $sortDirection = in_array($request->query('sort_direction'), ['asc', 'desc']) 
            ? $request->query('sort_direction') 
            : 'desc';

        $overviewData = $this->service->getOverviewData($user, $filters, $sortBy, $sortDirection);

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
}
