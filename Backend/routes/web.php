<?php

use Illuminate\Support\Facades\Route;

// Homepage pubblica
Route::get('/', fn () => view('welcome'));

