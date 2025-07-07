<?php

namespace Modules\Categories\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Modules\Categories\Models\Category;
use Modules\Categories\Services\CategoryService;
use Modules\Categories\Http\Requests\StoreCategoryRequest;
use Modules\Categories\Http\Requests\UpdateCategoryRequest;

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║         CategoriesController — CRUD + API (ora con color & icon)         ║
// ╚════════════════════════════════════════════════════════════════════════════╝
class CategoriesController extends Controller
{
    protected CategoryService $service;

    // Costruttore
    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    // ============================
    // ─── ROTTE WEB (BLADE) ───
    // ============================

    // Index (Blade)
    public function indexWeb(Request $request): View
    {
        $sortBy        = in_array($request->query('sort_by'), ['name', 'type']) ? $request->query('sort_by') : 'type';
        $sortDirection = in_array($request->query('sort_direction'), ['asc', 'desc']) ? $request->query('sort_direction') : 'asc';
        $categories    = $this->service->getAllForUser($sortBy, $sortDirection);

        return view('categories::index', [
            'categories'    => $categories,
            'sortBy'        => $sortBy,
            'sortDirection' => $sortDirection,
        ]);
    }

    // Create (Blade)
    public function createWeb(): View
    {
        return view('categories::create');
    }

    // Show (Blade)
    public function showWeb(Request $request, Category $category): View
    {
        return view('categories::show', compact('category'));
    }

    // Edit (Blade)
    public function editWeb(Category $category): View
    {
        return view('categories::edit', compact('category'));
    }

    // Store (Web)
    public function storeWeb(StoreCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated(); // Contiene anche color e icon
        $this->service->createForUser($data);
        return redirect()->route('categories.web.index')->with('status', 'Categoria aggiunta!');
    }

    // Update (Web)
    public function updateWeb(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $data = $request->validated();
        $this->service->update($category, $data);
        return redirect()->route('categories.web.index')->with('status', 'Categoria aggiornata!');
    }

    // Destroy (Web)
    public function destroyWeb(Request $request, Category $category): RedirectResponse
    {
        $this->service->delete($category);
        return redirect()->route('categories.web.index')->with('status', 'Categoria eliminata!');
    }

    // ============================
    // ─── ROTTE API (JSON) ───
    // ============================

    // Index (API)
    public function indexApi(Request $request): JsonResponse
    {
        $sortBy        = in_array($request->query('sort_by'), ['name', 'type']) ? $request->query('sort_by') : 'type';
        $sortDirection = in_array($request->query('sort_direction'), ['asc', 'desc']) ? $request->query('sort_direction') : 'asc';
        $categories    = $this->service->getAllForUser($sortBy, $sortDirection);
        return response()->json($categories);
    }

    // Show (API)
    public function showApi(Request $request, Category $category): JsonResponse
    {
        return response()->json($category);
    }

    // Store (API)
    public function storeApi(StoreCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $category = $this->service->createForUser($data);
        return response()->json($category, 201);
    }

    // Update (API)
    public function updateApi(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $data = $request->validated();
        $this->service->update($category, $data);
        return response()->json($category);
    }

    // Destroy (API)
    public function destroyApi(Request $request, Category $category): JsonResponse
    {
        $this->service->delete($category);
        return response()->json(['success' => true], 204);
    }
}
