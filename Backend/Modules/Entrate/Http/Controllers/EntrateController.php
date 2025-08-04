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

class EntrateController extends Controller
{
    protected EntrateService $service;

    // =========================
    // COSTRUTTORE
    // =========================
    public function __construct(EntrateService $service)
    {
        $this->service = $service;
    }

    // =========================
    // ─── ROTTE WEB (BLADE) ───
    // =========================

    // Lista (Blade)
    public function indexWeb(Request $request): View
    {
        $user = $request->user();
        $filters = $request->only(['start_date', 'end_date', 'description', 'category_id']);
        $sortBy = $request->query('sort_by', 'date');
        $sortDirection = $request->query('sort_direction', 'desc');

        $entrate = $this->service->getFilteredAndSortedForUser($user, $filters, $sortBy, $sortDirection);
        $categories = $this->service->getCategoriesForUser($user);

        return view('entrate::entrate.index', [
            'entrate' => $entrate,
            'categories' => $categories,
            'sortBy' => $sortBy,
            'sortDirection' => $sortDirection,
            'filterStartDate' => $filters['start_date'] ?? null,
            'filterEndDate' => $filters['end_date'] ?? null,
            'filterDescription' => $filters['description'] ?? null,
            'filterCategoryId' => $filters['category_id'] ?? null,
        ]);
    }

    // Form creazione (Blade)
    public function createWeb(Request $request): View
    {
        $categories = $this->service->getCategoriesForUser($request->user());
        return view('entrate::entrate.create', compact('categories'));
    }

    // Form modifica (Blade)
    public function editWeb(Request $request, Entrata $entrata): View
    {
        $categories = $this->service->getCategoriesForUser($request->user());
        return view('entrate::entrate.edit', compact('entrata', 'categories'));
    }

    // Dettaglio (Blade)
    public function showWeb(Request $request, Entrata $entrata): View
    {
        return view('entrate::entrate.show', compact('entrata'));
    }

    // =========================
    // ─── ROTTE API (JSON) ───
    // =========================

    // Lista (API JSON)
    public function indexApi(Request $request): JsonResponse
    {
        $user = $request->user();
        $filters = $request->only(['start_date', 'end_date', 'description', 'category_id']);
        $sortBy = $request->query('sort_by', 'date');
        $sortDirection = $request->query('sort_direction', 'desc');

        $entrate = $this->service->getFilteredAndSortedForUser($user, $filters, $sortBy, $sortDirection);

        return response()->json($entrate);
    }

    // Dettaglio (API JSON)
    public function showApi(Request $request, Entrata $entrata): JsonResponse
    {
        return response()->json($entrata);
    }

    // Store (API JSON)
    public function storeApi(StoreEntrataRequest $request): JsonResponse
    {
        $entrata = $this->service->createForUser($request->validated(), $request->user());
        return response()->json($entrata, 201);
    }

    // Update (API JSON)
    public function updateApi(UpdateEntrataRequest $request, Entrata $entrata): JsonResponse
    {
        $this->service->update($entrata, $request->validated());
        return response()->json($entrata);
    }

    // Destroy (API JSON)
    public function destroyApi(Request $request, Entrata $entrata): JsonResponse
    {
        $this->service->delete($entrata);
        return response()->json(['success' => true], 204);
    }

    // PATCH /api/v1/entrate/move-category
    /**
     * Move entries from one category to another.
     *
     * @param Request $request
     * @return JsonResponse
     */

    public function moveCategory(Request $request): JsonResponse
    {
        $request->validate([
            'oldCategoryId' => 'required|integer',
            'newCategoryId' => 'required|integer',
        ]);

        \Modules\Entrate\Models\Entrata::where('category_id', $request->oldCategoryId)
            ->update(['category_id' => $request->newCategoryId]);

        return response()->json(['status' => 'ok']);
    }

    // =========================
    // ───── WEB: SALVATAGGI (Redirect) ─────
    // =========================

    // Store (Web)
    public function storeWeb(StoreEntrataRequest $request): RedirectResponse
    {
        $entrata = $this->service->createForUser($request->validated(), $request->user());
        return redirect()->route('entrate.web.index')->with('status', 'Entrata aggiunta con successo!');
    }

    // Update (Web)
    public function updateWeb(UpdateEntrataRequest $request, Entrata $entrata): RedirectResponse
    {
        $this->service->update($entrata, $request->validated());
        return redirect()->route('entrate.web.index')->with('status', 'Entrata aggiornata con successo!');
    }

    // Destroy (Web)
    public function destroyWeb(Request $request, Entrata $entrata): RedirectResponse
    {
        $this->service->delete($entrata);
        return redirect()->route('entrate.web.index')->with('status', 'Entrata eliminata con successo!');
    }
}

