<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Autoload Composer
require __DIR__.'/../vendor/autoload.php';

// Crea app Laravel
$app = require_once __DIR__.'/../bootstrap/app.php';

// Avvia richiesta
$app->handleRequest(Request::capture());
