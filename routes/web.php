<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NonFollowedUsersController;
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
    Route::get('explore', fn() => Inertia::render('explore'))->name('explore');

    Route::prefix('profile/{username}')->group(function () {
        Route::get('/', [ProfilePageController::class, 'show'])->name('profile');
        Route::post('update-cover', [ProfilePageController::class, 'updateCover'])->name('profile.update-cover');
        Route::post('update-avatar', [ProfilePageController::class, 'updateAvatar'])->name('profile.update-avatar');
    });

    Route::prefix('post')->group(function () {
        Route::get('/', [PostController::class, 'create'])->name('post');
        Route::get('{post}', [PostController::class, 'showSingle'])->name('post.show');
    });
});

Route::prefix('api')->middleware('auth')->group(function () {
    Route::prefix('posts')->group(function () {
        Route::get('/', [PostController::class, 'show']);
        Route::get('non-followed', [PostController::class, 'nonFollowedPosts'])->name('posts.non-followed');
        Route::post('/', [PostController::class, 'store'])->name('posts.store');
        Route::put('{post}', [PostController::class, 'update'])->name('posts.update');
        Route::delete('{post}', [PostController::class, 'destroy'])->name('posts.destroy');
        Route::post('{post}/repost', [PostController::class, 'repost'])->name('posts.repost');
        Route::post('{post}/reactions', [PostReactionController::class, 'store'])->name('posts.reactions.store');
        Route::delete('{post}/reactions', [PostReactionController::class, 'destroy'])->name('posts.reactions.destroy');
    });

    Route::prefix('comments')->group(function () {
        Route::get('{post}', [CommentController::class, 'index'])->name('comments.index');
        Route::post('/', [CommentController::class, 'store'])->name('comments.store');
    });

    Route::get('users/{user}/posts', [PostController::class, 'userPosts'])->name('api.users.posts');
    Route::get('non-followed-users', [NonFollowedUsersController::class, 'index'])->name('api.non-followed-users');
    Route::post('follow', [FollowController::class, 'follow'])->name('api.follow');
    Route::post('unfollow', [FollowController::class, 'unfollow'])->name('api.unfollow');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
