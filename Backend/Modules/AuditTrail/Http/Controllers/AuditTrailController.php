<?php

namespace Modules\AuditTrail\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\AuditTrail\Models\AuditLog;

class AuditTrailController extends Controller
{
    // ===========================================
    // Elenco log (dashboard/admin)
    // ===========================================
    public function index(Request $request)
    {
        // Esempio: ordina per data, ricerca per utente/azione/oggetto (espandi come vuoi)
        $query = AuditLog::query()
            ->with('user')    // eager load user (se definito in model)
            ->latest();

        // Filtro per utente
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        // Filtro per azione (created/updated/deleted)
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }
        // Filtro per modello
        if ($request->filled('auditable_type')) {
            $query->where('auditable_type', $request->auditable_type);
        }

        $logs = $query->paginate(30);

        // Se vuoi una view Blade:
        return view('audittrail::index', compact('logs'));
        // Se vuoi API JSON, usa:
        // return response()->json($logs);
    }

    // ===========================================
    // Dettaglio singolo log
    // ===========================================
    public function show($id)
    {
        $log = AuditLog::with('user')->findOrFail($id);
        return view('audittrail::show', compact('log'));
        // return response()->json($log);
    }

    // CRUD NON USATI: per sicurezza li lascio vuoti/disabilitati

    public function create()
    {
        abort(404);
    }
    public function store(Request $request)
    {
        abort(404);
    }
    public function edit($id)
    {
        abort(404);
    }
    public function update(Request $request, $id)
    {
        abort(404);
    }
    public function destroy($id)
    {
        abort(404);
    }
}
// Questo controller gestisce le richieste per visualizzare i log di audit.
// - `index`: mostra l'elenco dei log con filtri opzionali (utente, azione, modello).
// - `show`: mostra i dettagli di un singolo log.
// - Le operazioni di creazione, aggiornamento ed eliminazione sono disabilitate per sicurezza.