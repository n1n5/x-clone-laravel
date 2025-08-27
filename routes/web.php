<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostReactionController;
use App\Http\Controllers\ProfilePageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('/', [AuthenticatedSessionController::class, 'create'])->name('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('home', fn() => Inertia::render('home'))->name('home');

    Route::prefix('/profile/{username}')->group(function () {
        Route::get('/', [ProfilePageController::class, 'show'])->name('profile');
        Route::post('/update-cover', [ProfilePageController::class, 'updateCover'])->name('profile.update-cover');
        Route::post('/update-avatar', [ProfilePageController::class, 'updateAvatar'])->name('profile.update-avatar');
    });

    Route::get('/post', [PostController::class, 'create'])->name('post');
});

Route::prefix('api')->middleware('auth')->group(function () {
    Route::prefix('/posts')->group(function () {
        Route::get('/', [PostController::class, 'show']);
        Route::post('/', [PostController::class, 'store'])->name('posts.store');
        Route::put('/{post}', [PostController::class, 'update'])->name('posts.update');
        Route::delete('/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
        Route::post('/{post}/reactions', [PostReactionController::class, 'store'])->name('posts.reactions.store');
        Route::delete('/{post}/reactions', [PostReactionController::class, 'destroy'])->name('posts.reactions.destroy');
    });

    Route::get('/users/{user}/posts', [PostController::class, 'userPosts'])->name('api.users.posts');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';