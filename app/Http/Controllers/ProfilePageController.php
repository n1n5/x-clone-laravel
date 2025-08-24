<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfilePageController extends Controller
{
    public function show($username)
    {
        $user = User::where('username', $username)->firstOrFail();

        $coverUrl = $user->cover_path ? asset($user->cover_path) : null;
        $avatarUrl = $user->avatar_path ? asset($user->avatar_path) : null;

        return Inertia::render('profile-page', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'about' => $user->about,
                'created_at' => $user->created_at->toDateTimeString(),
                'cover_path' => $coverUrl,
                'avatar_path' => $avatarUrl
            ],
            'is_own_profile' => Auth::check() && Auth::id() === $user->id,
            'cover_path' => $coverUrl,
            'avatar_path' => $avatarUrl
        ]);
    }

    public function updateCover($username, Request $request)
    {
        $user = User::where('username', $username)->firstOrFail();

        $request->validate([
            'cover_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $coversDir = public_path('covers');
        if (!file_exists($coversDir)) {
            mkdir($coversDir, 0755, true);
        }

        $filename = $user->id . '.png';
        $path = 'covers/' . $filename;
        $fullPath = public_path($path);

        $request->file('cover_image')->move(public_path('covers'), $filename);

        $user->update([
            'cover_path' => $path
        ]);

        return Inertia::location('/profile/' . $username, 302, [
            'replace' => true,
        ]);
    }

    public function updateAvatar($username, Request $request)
    {
        $user = User::where('username', $username)->firstOrFail();

        $request->validate([
            'avatar_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $avatarsDir = public_path('avatars');
        if (!file_exists($avatarsDir)) {
            mkdir($avatarsDir, 0755, true);
        }

        $filename = $user->id . '.png';
        $path = 'avatars/' . $filename;
        $fullPath = public_path($path);

        $request->file('avatar_image')->move(public_path('avatars'), $filename);

        $user->update([
            'avatar_path' => $path
        ]);

        return Inertia::location('/profile/' . $username, 302, [
            'replace' => true,
        ]);
    }
}
