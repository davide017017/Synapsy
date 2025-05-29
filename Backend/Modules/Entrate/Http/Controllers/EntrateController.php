<?php

namespace Modules\Entrate\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Modules\Entrate\Models\Entrata;
use Modules\Entrate\Services\EntrateService;
use Modules\Entrate\Http\Requests\StoreEntrataRequest;
use Modules\Entrate\Http\Requests\UpdateEntrataRequest;
use ApiResponse;

class EntrateController extends Controller
{
    // ============================
    // Constructor
    // ============================
    public function __construct(protected EntrateService $service)
    {
        $this->middleware('auth:sanctum');
        $this->authorizeResource(Entrata::class, 'entrata');
    }

    // ============================
    // Index - List Entrate
    // ============================
    public function index(Request $request): JsonResponse|View
    {
        $user    = $request->user();
        $filters = $request->only(['start_date', 'end_date', 'description', 'category_id']);
        $sortBy  = in_array($request->query('sort_by'), ['date', 'description', 'amount']) ? $request->query('sort_by') : 'date';
        $sortDirection = in_array($request->query('sort_direction'), ['asc', 'desc']) ? $request->query('sort_direction') : 'desc';

        $entrate    = $this->service->getFilteredAndSortedForUser($user, $filters, $sortBy, $sortDirection);
        $categories = $this->service->getCategoriesForUser($user);

        return $request->wantsJson()
            ? ApiResponse::success('Entrate caricate.', $entrate)
            : view('entrate::entrate.index', compact('entrate', 'categories', 'sortBy', 'sortDirection'))->with([
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
        return view('entrate::entrate.create', compact('categories'));
    }

    // ============================
    // Store - Save New Entrata
    // ============================
    public function store(StoreEntrataRequest $request): JsonResponse|RedirectResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $entrata = $this->service->createForUser($request->validated(), $request->user());

        return $request->wantsJson()
            ? ApiResponse::success('Entrata creata.', $entrata, 201)
            : redirect()->route('entrate.web.index')->with('status', 'Entrata aggiunta con successo!');
    }

    // ============================
    // Show - Entrata Detail
    // ============================
    public function show(Request $request, Entrata $entrata): JsonResponse|View
    {
        return $request->wantsJson()
            ? ApiResponse::success('Entrata trovata.', $entrata)
            : view('entrate::entrate.show', compact('entrata'));
    }

    // ============================
    // Edit - Show Edit Form
    // ============================
    public function edit(Request $request, Entrata $entrata): View
    {
        $categories = $this->service->getCategoriesForUser($request->user());
        return view('entrate::entrate.edit', compact('entrata', 'categories'));
    }

    // ============================
    // Update - Modify Entrata
    // ============================
    public function update(UpdateEntrataRequest $request, Entrata $entrata): JsonResponse|RedirectResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $this->service->update($entrata, $request->validated());

        return $request->wantsJson()
            ? ApiResponse::success('Entrata aggiornata.', $entrata)
            : redirect()->route('entrate.web.index')->with('status', 'Entrata aggiornata con successo!');
    }

    // ============================
    // Destroy - Delete Entrata
    // ============================
    public function destroy(Request $request, Entrata $entrata): JsonResponse|RedirectResponse
    {
        $this->service->delete($entrata);

        return $request->wantsJson()
            ? ApiResponse::success('Entrata eliminata.', null, 204)
            : redirect()->route('entrate.web.index')->with('status', 'Entrata eliminata con successo!');
    }
}
