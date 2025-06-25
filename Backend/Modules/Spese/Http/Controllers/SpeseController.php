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

// ─────────────────────────────────────────────
// Controller unico per Web (Blade) + API (JSON)
// ─────────────────────────────────────────────
class SpeseController extends Controller
{
    protected SpeseService $service;

    // =========================
    // COSTRUTTORE
    // =========================
    public function __construct(SpeseService $service)
    {
        $this->service = $service;
    }

    // =========================
    // ─── ROTTE WEB (BLADE) ───
    // =========================

    // Index (Blade)
    public function indexWeb(Request $request): View
    {
        $user = $request->user();
        $filters = $request->only(['start_date', 'end_date', 'description', 'category_id']);
        $sortBy = $request->query('sort_by', 'date');
        $sortDirection = $request->query('sort_direction', 'desc');

        $spese = $this->service->getFilteredAndSortedForUser($user, $filters, $sortBy, $sortDirection);
        $categories = $this->service->getCategoriesForUser($user);

        return view('spese::spese.index', [
            'spese' => $spese,
            'categories' => $categories,
            'sortBy' => $sortBy,
            'sortDirection' => $sortDirection,
            'filterStartDate' => $filters['start_date'] ?? null,
            'filterEndDate' => $filters['end_date'] ?? null,
            'filterDescription' => $filters['description'] ?? null,
            'filterCategoryId' => $filters['category_id'] ?? null,
        ]);
    }

    // Create (Blade)
    public function createWeb(Request $request): View
    {
        $categories = $this->service->getCategoriesForUser($request->user());
        return view('spese::spese.create', compact('categories'));
    }

    // Edit (Blade)
    public function editWeb(Request $request, Spesa $spesa): View
    {
        $categories = $this->service->getCategoriesForUser($request->user());
        return view('spese::spese.edit', compact('spesa', 'categories'));
    }

    // Show (Blade)
    public function showWeb(Request $request, Spesa $spesa): View
    {
        return view('spese::spese.show', compact('spesa'));
    }

    // Store (Web)
    public function storeWeb(StoreSpesaRequest $request): RedirectResponse
    {
        $spesa = $this->service->createForUser($request->validated(), $request->user());
        return redirect()->route('spese.web.index')->with('status', 'Spesa aggiunta con successo!');
    }

    // Update (Web)
    public function updateWeb(UpdateSpesaRequest $request, Spesa $spesa): RedirectResponse
    {
        $this->service->update($spesa, $request->validated());
        return redirect()->route('spese.web.index')->with('status', 'Spesa aggiornata con successo!');
    }

    // Destroy (Web)
    public function destroyWeb(Request $request, Spesa $spesa): RedirectResponse
    {
        $this->service->delete($spesa);
        return redirect()->route('spese.web.index')->with('status', 'Spesa eliminata con successo!');
    }

    // =========================
    // ─── ROTTE API (JSON) ───
    // =========================

    // Index (API)
    public function indexApi(Request $request): JsonResponse
    {
        $user = $request->user();
        $filters = $request->only(['start_date', 'end_date', 'description', 'category_id']);
        $sortBy = $request->query('sort_by', 'date');
        $sortDirection = $request->query('sort_direction', 'desc');

        $spese = $this->service->getFilteredAndSortedForUser($user, $filters, $sortBy, $sortDirection);
        return response()->json($spese);
    }

    // Show (API)
    public function showApi(Request $request, Spesa $spesa): JsonResponse
    {
        return response()->json($spesa);
    }

    // Store (API)
    public function storeApi(StoreSpesaRequest $request): JsonResponse
    {
        $spesa = $this->service->createForUser($request->validated(), $request->user());
        return response()->json($spesa, 201);
    }

    // Update (API)
    public function updateApi(UpdateSpesaRequest $request, Spesa $spesa): JsonResponse
    {
        $this->service->update($spesa, $request->validated());
        return response()->json($spesa);
    }

    // Destroy (API)
    public function destroyApi(Request $request, Spesa $spesa): JsonResponse
    {
        $this->service->delete($spesa);
        return response()->json(['success' => true], 204);
    }
}