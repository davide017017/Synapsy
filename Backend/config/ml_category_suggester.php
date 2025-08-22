<?php

// ─────────────────────────────────────────────────────────────────────────────
// Config: ML Category Suggester
// Dettagli: URL base del microservizio di suggerimento categoria
// ─────────────────────────────────────────────────────────────────────────────
return [
    'base_url' => env('ML_CATEGORY_SUGGESTER_BASE_URL', 'http://localhost:7001'),
];
