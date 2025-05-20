<?php

namespace Modules\Spese\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Modules\Spese\Models\Spesa;
use Modules\Spese\Services\SpeseService;
use Modules\Spese\Http\Requests\StoreSpesaRequest;
use Modules\Spese\Http\Requests\UpdateSpesaRequest;
use ApiResponse;

class SpeseController extends Controller
{
    // ============================
    // Constructor
    // ============================
    public function __construct(protected SpeseService $service)
    {
        $this->middleware('auth:sanctum');
        $this->authorizeResource(Spesa::class, 'spesa');
    }

    // ============================
    // Index - List Spese
    // ============================
    public function index(Request $request): JsonResponse|View
    {
        $user    = $request->user();
        $filters = $request->only(['start_date', 'end_date', 'description', 'category_id']);
        $sortBy  = in_array($request->query('sort_by'), ['date', 'description', 'amount']) ? $request->query('sort_by') : 'date';
        $sortDirection = in_array($request->query('sort_direction'), ['asc', 'desc']) ? $request->query('sort_direction') : 'desc';

        $spese      = $this->service->getFilteredAndSortedForUser($user, $filters, $sortBy, $sortDirection);
        $categories = $this->service->getCategoriesForUser($user);

        return $request->wantsJson()
            ? ApiResponse::success('Spese caricate.', $spese)
            : view('spese::spese.index', compact('spese', 'categories', 'sortBy', 'sortDirection'))->with([
                'filterStartDate'   => $filters['start_date']   ?? null,
                'filterEndDate'     => $filters['end_date']     ?? null,
                'filterDescription' => $filters['description']  ?? null,
                'filterCategoryId'  => $filters['category_id']  ?? null,
            ]);
    }

    // ============================
    // Create - Show Create Form
    // ============================
    public function create(Request $request): View
    {
        $categories = $this->service->getCategoriesForUser($request->user());
        return view('spese::spese.create', compact('categories'));
    }

    // ============================
    // Store - Save New Spesa
    // ============================
    public function store(StoreSpesaRequest $request): JsonResponse|RedirectResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $spesa = $this->service->createForUser($request->validated(), $request->user());

        return $request->wantsJson()
            ? ApiResponse::success('Spesa creata.', $spesa, 201)
            : redirect()->route('spese.web.index')->with('status', 'Spesa aggiunta con successo!');
    }

    // ============================
    // Show - Spesa Detail
    // ============================
    public function show(Request $request, Spesa $spesa): JsonResponse|View
    {
        return $request->wantsJson()
            ? ApiResponse::success('Spesa trovata.', $spesa)
            : view('spese::spese.show', compact('spesa'));
    }

    // ============================
    // Edit - Show Edit Form
    // ============================
    public function edit(Request $request, Spesa $spesa): View
    {
        $categories = $this->service->getCategoriesForUser($request->user());
        return view('spese::spese.edit', compact('spesa', 'categories'));
    }

    // ============================
    // Update - Modify Spesa
    // ============================
    public function update(UpdateSpesaRequest $request, Spesa $spesa): JsonResponse|RedirectResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $this->service->update($spesa, $request->validated());

        return $request->wantsJson()
            ? ApiResponse::success('Spesa aggiornata.', $spesa)
            : redirect()->route('spese.web.index')->with('status', 'Spesa aggiornata con successo!');
    }

    // ============================
    // Destroy - Delete Spesa
    // ============================
    public function destroy(Request $request, Spesa $spesa): JsonResponse|RedirectResponse
    {
        $this->service->delete($spesa);

        return $request->wantsJson()
            ? ApiResponse::success('Spesa eliminata.', null, 204)
            : redirect()->route('spese.web.index')->with('status', 'Spesa eliminata con successo!');
    }
}
