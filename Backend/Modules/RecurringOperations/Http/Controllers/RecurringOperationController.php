<?php

// ─────────────────────────────────────────────────────────────────────────────
// Controller: RecurringOperationController
// Dettagli: API JSON per operazioni ricorrenti (index/show/store/update/destroy)
//           + utility: moveCategory, getNextOccurrences
// ─────────────────────────────────────────────────────────────────────────────

namespace Modules\RecurringOperations\Http\Controllers;

use ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\RecurringOperations\Http\Requests\StoreRecurringOperationRequest;
use Modules\RecurringOperations\Http\Requests\UpdateRecurringOperationRequest;
use Modules\RecurringOperations\Jobs\ProcessRecurringOperation;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\RecurringOperations\Services\RecurringOperationService;

class RecurringOperationController extends Controller
{
    // ============================
    // Costruttore
    // ============================
    public function __construct(protected RecurringOperationService $service)
    {
        $this->middleware('auth:sanctum');
        $this->authorizeResource(RecurringOperation::class, 'recurring_operation');
    }

    // ============================
    // Index - Lista operazioni ricorrenti
    // ============================
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $filters = [
            'start_date'                => $request->input('start_date'),
            'end_date'                  => $request->input('end_date'),
            'next_occurrence_start_date' => $request->input('next_occurrence_start_date'),
            'next_occurrence_end_date'  => $request->input('next_occurrence_end_date'),
            'description'               => $request->input('description'),
            'category_id'               => $request->input('category_id'),
            'type'                      => $request->input('type'),
            'is_active'                 => $request->input('is_active'),
        ];

        $sortBy = in_array($request->query('sort_by'), [
            'description',
            'amount',
            'type',
            'start_date',
            'next_occurrence_date',
            'is_active',
        ], true) ? $request->query('sort_by') : 'next_occurrence_date';

        $sortDirection = in_array($request->query('sort_direction'), ['asc', 'desc'], true)
            ? $request->query('sort_direction')
            : 'asc';

        $items = $this->service->getFilteredAndSortedForUser($user, $filters, $sortBy, $sortDirection);

        return ApiResponse::success('Operazioni ricorrenti caricate.', [
            'items' => $items,
            'sort'  => ['by' => $sortBy, 'direction' => $sortDirection],
            'filters' => $filters,
        ]);
    }

    // ============================
    // Store - Crea nuova regola
    // ============================
    public function store(StoreRecurringOperationRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $operation = $this->service->createOperation($validated, $user);

        if ($request->boolean('generate_past_now')) {
            ProcessRecurringOperation::dispatch($operation);
        }

        return ApiResponse::success('Operazione ricorrente creata.', $operation, 201);
    }

    // ============================
    // Show - Dettaglio
    // ============================
    public function show(Request $request, RecurringOperation $recurringOperation): JsonResponse
    {
        $recurringOperation->load('category');

        return ApiResponse::success('Operazione trovata.', $recurringOperation);
    }

    // ============================
    // Update - Aggiorna regola
    // ============================
    public function update(UpdateRecurringOperationRequest $request, RecurringOperation $recurringOperation): JsonResponse
    {
        $validated = $request->validated();

        $this->service->updateOperation($recurringOperation, $validated);

        return ApiResponse::success('Operazione aggiornata.', $recurringOperation);
    }

    // ============================
    // Destroy - Elimina regola
    // ============================
    public function destroy(Request $request, RecurringOperation $recurringOperation): JsonResponse
    {
        $this->service->deleteOperation($recurringOperation);

        return response()->json(null, 204);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Utility: moveCategory (PATCH /api/v1/recurring-operations/move-category)
    // Input:
    //  - ids[] (opzionale): array di ID da spostare; se assente → sposta tutte le tue
    //  - category_id (nullable): nuova categoria o null per rimuoverla
    // Sicurezza:
    //  - filtra sempre per user_id
    //  - nessun ModelNotFound → mai 404
    // ─────────────────────────────────────────────────────────────────────────
    public function moveCategory(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ids'         => ['sometimes', 'array', 'min:1'],
            'ids.*'       => ['integer', 'min:1'],
            'category_id' => ['nullable', 'integer', 'min:1'],
        ]);

        $q = RecurringOperation::query()
            ->where('user_id', $request->user()->id);

        if (! empty($data['ids'])) {
            $q->whereIn('id', $data['ids']);
        }

        $updated = $q->update(['category_id' => $data['category_id'] ?? null]);

        return ApiResponse::success('Categoria aggiornata.', ['updated' => $updated]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Utility: getNextOccurrences (GET /api/v1/recurring-operations/next-occurrences)
    // Input:
    //  - days (int, default 30): orizzonte massimo per cercare next_occurrence_date
    // Output: lista (anche vuota) di occorrenze previste ordinate per data
    // Note: risposta 200 anche se vuota → niente 404
    // ─────────────────────────────────────────────────────────────────────────
    public function getNextOccurrences(Request $request): JsonResponse
    {
        $user = $request->user();
        $days = (int) $request->query('days', 30);
        $days = $days > 0 ? $days : 30;

        $from = now()->startOfDay();
        $to   = now()->addDays($days)->endOfDay();

        // Filtro semplice su next_occurrence_date; se in futuro gestisci cron/recurrence rules,
        // calcola qui le date derivate.
        $operations = RecurringOperation::query()
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->whereNotNull('next_occurrence_date')
            ->whereBetween('next_occurrence_date', [$from, $to])
            ->orderBy('next_occurrence_date')
            ->get(['id', 'description', 'amount', 'type', 'next_occurrence_date', 'category_id']);

        return ApiResponse::success('Prossime occorrenze.', [
            'from' => $from->toDateString(),
            'to'   => $to->toDateString(),
            'items' => $operations,
        ]);
    }
}
