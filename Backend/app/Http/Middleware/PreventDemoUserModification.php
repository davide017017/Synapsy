<?php

namespace App\Http\Middleware;

use ApiResponse;
use Closure;
use Illuminate\Http\Request;

class PreventDemoUserModification
{
    /**
     * Blocca le operazioni di scrittura per l'utente demo.
     *
     * Usa la colonna is_demo invece del fragile confronto sull'email,
     * in modo da supportare futuri utenti demo senza toccare il middleware.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->is_demo && ! in_array($request->method(), ['GET', 'HEAD'])) {
            $message = "L'utente demo non può essere modificato";

            return $request->expectsJson()
                ? ApiResponse::error($message, null, 403)
                : abort(403, $message);
        }

        return $next($request);
    }
}
