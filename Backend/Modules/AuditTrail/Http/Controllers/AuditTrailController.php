<?php

namespace Modules\AuditTrail\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\AuditTrail\Models\AuditLog;

// ─────────────────────────────────────────────────────────────────────────────
// Controller: AuditTrailController
// Dettagli: gestione CRUD dei log di audit via API JSON
// ─────────────────────────────────────────────────────────────────────────────
class AuditTrailController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: index
    // Dettagli: lista paginata (id, user_id, action, created_at)
    // ─────────────────────────────────────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $logs = AuditLog::select('id', 'user_id', 'action', 'created_at')
            ->latest()
            ->paginate($request->query('per_page', 30));

        return response()->json($logs);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: show
    // Dettagli: dettaglio singolo record
    // ─────────────────────────────────────────────────────────────────────────────
    public function show(int $id): JsonResponse
    {
        $log = AuditLog::findOrFail($id);

        return response()->json($log);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: store
    // Dettagli: crea un nuovo log
    // ─────────────────────────────────────────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'action' => 'required|string',
            'auditable_type' => 'required|string',
            'auditable_id' => 'required|integer',
            'meta' => 'array|nullable',
        ]);

        $log = AuditLog::create([
            'user_id' => $validated['user_id'] ?? null,
            'action' => $validated['action'],
            'auditable_type' => $validated['auditable_type'],
            'auditable_id' => $validated['auditable_id'],
            'new_values' => $validated['meta'] ?? null,
        ]);

        return response()->json($log, 201);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: update
    // Dettagli: aggiorna i campi ammessi
    // ─────────────────────────────────────────────────────────────────────────────
    public function update(Request $request, int $id): JsonResponse
    {
        $log = AuditLog::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'action' => 'sometimes|string',
            'auditable_type' => 'sometimes|string',
            'auditable_id' => 'sometimes|integer',
            'meta' => 'array|nullable',
        ]);

        $log->update([
            'user_id' => $validated['user_id'] ?? $log->user_id,
            'action' => $validated['action'] ?? $log->action,
            'auditable_type' => $validated['auditable_type'] ?? $log->auditable_type,
            'auditable_id' => $validated['auditable_id'] ?? $log->auditable_id,
            'new_values' => $validated['meta'] ?? $log->new_values,
        ]);

        return response()->json($log);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Metodo: destroy
    // Dettagli: elimina un record
    // ─────────────────────────────────────────────────────────────────────────────
    public function destroy(int $id): JsonResponse
    {
        $log = AuditLog::findOrFail($id);
        $log->delete();

        return response()->json(null, 204);
    }
}
