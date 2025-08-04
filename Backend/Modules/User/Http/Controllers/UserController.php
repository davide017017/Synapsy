<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // ============================
    // Index - Lista utenti
    // ============================

    /**
     * Mostra la lista degli utenti.
     */
    public function index()
    {
        return view('user::index');
    }

    // ============================
    // Create - Nuovo utente
    // ============================

    /**
     * Mostra il form per creare un nuovo utente.
     */
    public function create()
    {
        return view('user::create');
    }

    /**
     * Salva un nuovo utente.
     */
    public function store(Request $request)
    {
        // Da implementare
    }

    // ============================
    // Show - Dettaglio utente
    // ============================

    /**
     * Mostra i dettagli di un utente.
     */
    public function show($id)
    {
        return view('user::show');
    }

    // ============================
    // Edit - Modifica utente
    // ============================

    /**
     * Mostra il form per modificare un utente.
     */
    public function edit($id)
    {
        return view('user::edit');
    }

    /**
     * Aggiorna un utente esistente.
     */
    public function update(Request $request, $id)
    {
        // Da implementare
    }

    // ============================
    // Destroy - Elimina utente
    // ============================

    /**
     * Elimina un utente.
     */
    public function destroy($id)
    {
        // Da implementare
    }
}

