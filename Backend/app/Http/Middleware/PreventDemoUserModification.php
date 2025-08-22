<?php

namespace App\Http\Middleware;

use ApiResponse;
use Closure;
use Illuminate\Http\Request;

class PreventDemoUserModification
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->email === 'demo@synapsy.app' && ! in_array($request->method(), ['GET', 'HEAD'])) {
            $message = "L'utente demo non può essere modificato";

            return $request->expectsJson()
                ? ApiResponse::error($message, null, 403)
                : abort(403, $message);
        }

        return $next($request);
    }
}
