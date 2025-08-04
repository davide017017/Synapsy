<?php

return [

    // Percorsi dove Laravel cercherà i file Blade (.blade.php)
    'paths' => [
        resource_path('views'),
    ],

    // Percorso dove verranno salvati i file Blade compilati
    'compiled' => env(
        'VIEW_COMPILED_PATH',
        realpath(storage_path('framework/views'))
    ),

];

