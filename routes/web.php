<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('/', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('home', function () {
        return Inertia::render('home');
    })->name('home');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
