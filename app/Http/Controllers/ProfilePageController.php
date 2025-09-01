<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfilePageController extends Controller
{
    public function show(string $username): Response
    {
        /** @var User $user */
        $user = User::where('username', $username)->firstOrFail();
        /** @var User|null $currentUser */
        $currentUser = Auth::user();

        $isOwnProfile = $currentUser && $currentUser->id === $user->id;
        $isFollowing = $currentUser && !$isOwnProfile
            ? $currentUser->following()->where('users.id', $user->id)->exists()
            : false;

        $followerCount = $user->followers()->count();
        $followingCount = $user->following()->count();

        return Inertia::render('profile-page', [
            'user' => $user,
            'is_own_profile' => $isOwnProfile,
            'cover_path' => $user->cover_path,
            'avatar_path' => $user->avatar_path,
            'is_following' => $isFollowing,
            'follower_count' => $followerCount,
            'following_count' => $followingCount,
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
