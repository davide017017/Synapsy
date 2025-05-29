<?php

namespace Modules\RecurringOperations\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\RecurringOperations\Services\RecurringOperationService;
use Modules\RecurringOperations\Jobs\ProcessRecurringOperation;
use Illuminate\Validation\Rule;
use ApiResponse;

class RecurringOperationController extends Controller
{
    // ============================
    // Constructor
    // ============================
    public function __construct(protected RecurringOperationService $service)
    {
        $this->middleware('auth:sanctum');
        $this->authorizeResource(RecurringOperation::class, 'recurring_operation');
    }

    // ============================
    // Index - Lista RecurringOperation
    // ============================
    public function index(Request $request): JsonResponse|View
    {
        $user = $request->user();

        // Filtri con valori predefiniti null
        $filters = [
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'next_occurrence_start_date' => $request->input('next_occurrence_start_date'),
            'next_occurrence_end_date' => $request->input('next_occurrence_end_date'),
            'description' => $request->input('description'),
            'category_id' => $request->input('category_id'),
            'type' => $request->input('type'),
            'is_active' => $request->input('is_active'),
        ];

        $sortBy = in_array($request->query('sort_by'), [
            'description', 'amount', 'type', 'start_date', 'next_occurrence_date', 'is_active'
        ]) ? $request->query('sort_by') : 'next_occurrence_date';

        $sortDirection = in_array($request->query('sort_direction'), ['asc', 'desc'])
            ? $request->query('sort_direction')
            : 'asc';

        $recurringOperations = $this->service->getFilteredAndSortedForUser($user, $filters, $sortBy, $sortDirection);
        $categories = $this->service->getCategoriesForUser($user);

        // Mappa i filtri in camelCase per la view
        $viewFilters = [
            'filterStartDate' => $filters['start_date'],
            'filterEndDate' => $filters['end_date'],
            'filterNextOccurrenceStartDate' => $filters['next_occurrence_start_date'],
            'filterNextOccurrenceEndDate' => $filters['next_occurrence_end_date'],
            'filterDescription' => $filters['description'],
            'filterCategoryId' => $filters['category_id'],
            'filterType' => $filters['type'],
            'filterIsActive' => $filters['is_active'],
        ];

        return $request->wantsJson()
            ? ApiResponse::success('Operazioni ricorrenti caricate.', $recurringOperations)
            : view('recurringoperations::index', array_merge([
                'recurringOperations' => $recurringOperations,
                'categories' => $categories,
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
            ], $viewFilters));
    }

    // ============================
    // Create - Show Create Form
    // ============================
    public function create(Request $request): View
    {
        $user = $request->user();

        $operationType = $request->query('type', 'entrata'); // fallback su 'entrata' se non specificato

        if (!in_array($operationType, ['entrata', 'spesa'])) {
            abort(404);
        }

        $categories = $this->service->getCategoriesForUser($user, $operationType);

        return view('recurringoperations::create', [
            'operationType' => $operationType,
            'categories' => $categories,
        ]);
    }

    // ============================
    // Store - Salva nuova regola
    // ============================
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|between:0.01,999999.99',
            'type' => ['required', Rule::in(['entrata', 'spesa'])],
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'frequency' => ['required', Rule::in(['daily', 'weekly', 'monthly', 'annually'])],
            'interval' => 'required|integer|min:1',
            'is_active' => 'required|boolean',
            'notes' => 'nullable|string',
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->where(function ($q) use ($user, $request) {
                    $q->where('user_id', $user->id)->where('type', $request->input('type'));
                }),
            ],
            'generate_past_now' => 'boolean',
        ]);

        $operation = $this->service->createOperation($validated, $user);

        if ($request->boolean('generate_past_now')) {
            ProcessRecurringOperation::dispatch($operation);
        }

        return $request->wantsJson()
            ? ApiResponse::success('Operazione ricorrente creata.', $operation, 201)
            : redirect()->route('recurring-operations.index')->with('status', 'Operazione ricorrente aggiunta con successo!');
    }

    // ============================
    // Show - Dettaglio
    // ============================
    public function show(Request $request, RecurringOperation $recurringOperation): JsonResponse|View
    {
        $recurringOperation->load('category');

        return $request->wantsJson()
            ? ApiResponse::success('Operazione trovata.', $recurringOperation)
            : view('recurringoperations::show', compact('recurringOperation'));
    }

    // ============================
    // Edit - Form modifica
    // ============================
    public function edit(Request $request, RecurringOperation $recurringOperation): View
    {
        $categories = $this->service->getCategoriesForUser($request->user(), $recurringOperation->type);

        return view('recurringoperations::edit', compact('recurringOperation', 'categories'));
    }

    // ============================
    // Update - Aggiorna record
    // ============================
    public function update(Request $request, RecurringOperation $recurringOperation): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|between:0.01,999999.99',
            'type' => ['required', Rule::in(['entrata', 'spesa'])],
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'frequency' => ['required', Rule::in(['daily', 'weekly', 'monthly', 'annually'])],
            'interval' => 'required|integer|min:1',
            'is_active' => 'required|boolean',
            'notes' => 'nullable|string',
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->where(function ($q) use ($user, $request) {
                    $q->where('user_id', $user->id)->where('type', $request->input('type'));
                }),
            ],
        ]);

        $this->service->updateOperation($recurringOperation, $validated);

        return $request->wantsJson()
            ? ApiResponse::success('Operazione aggiornata.', $recurringOperation)
            : redirect()->route('recurring-operations.index')->with('status', 'Operazione ricorrente aggiornata con successo!');
    }

    // ============================
    // Destroy - Elimina record
    // ============================
    public function destroy(Request $request, RecurringOperation $recurringOperation): JsonResponse|RedirectResponse
    {
        $this->service->deleteOperation($recurringOperation);

        return $request->wantsJson()
            ? ApiResponse::success('Operazione eliminata.', null, 204)
            : redirect()->route('recurring-operations.index')->with('status', 'Operazione ricorrente eliminata con successo!');
    }
}
