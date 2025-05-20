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
use ApiResponse;

class CategoriesController extends Controller
{
    // ============================
    // Constructor
    // ============================
    public function __construct(protected CategoryService $service)
    {
        $this->middleware('auth:sanctum');
        $this->authorizeResource(Category::class, 'category');
    }

    // ============================
    // Index - List Categories
    // ============================
    public function index(Request $request): JsonResponse|View
    {
        $sortBy        = in_array($request->query('sort_by'), ['name', 'type']) ? $request->query('sort_by') : 'type';
        $sortDirection = in_array($request->query('sort_direction'), ['asc', 'desc']) ? $request->query('sort_direction') : 'asc';

        $categories = $this->service->getAllForUser($sortBy, $sortDirection);

        return $request->wantsJson()
            ? ApiResponse::success('Categorie caricate.', $categories)
            : view('categories::index', compact('categories', 'sortBy', 'sortDirection'));
    }

    // ============================
    // Create - Show Create Form
    // ============================
    public function create(): View
    {
        return view('categories::create');
    }

    // ============================
    // Store - Save New Category
    // ============================
    public function store(StoreCategoryRequest $request): JsonResponse|RedirectResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $category = $this->service->createForUser($request->validated());

        return $request->wantsJson()
            ? ApiResponse::success('Categoria creata.', $category, 201)
            : redirect()->route('categories.web.index')->with('status', 'Categoria aggiunta!');
    }

    // ============================
    // Show - Category Detail
    // ============================
    public function show(Request $request, Category $category): JsonResponse|View
    {
        return $request->wantsJson()
            ? ApiResponse::success('Categoria trovata.', $category)
            : view('categories::show', compact('category'));
    }

    // ============================
    // Edit - Show Edit Form
    // ============================
    public function edit(Category $category): View
    {
        return view('categories::edit', compact('category'));
    }

    // ============================
    // Update - Modify Category
    // ============================
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse|RedirectResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $this->service->update($category, $request->validated());

        return $request->wantsJson()
            ? ApiResponse::success('Categoria aggiornata.', $category)
            : redirect()->route('categories.web.index')->with('status', 'Categoria aggiornata!');
    }

    // ============================
    // Destroy - Delete Category
    // ============================
    public function destroy(Request $request, Category $category): JsonResponse|RedirectResponse
    {
        $this->service->delete($category);

        return $request->wantsJson()
            ? ApiResponse::success('Categoria eliminata.', null, 204)
            : redirect()->route('categories.web.index')->with('status', 'Categoria eliminata!');
    }
}
