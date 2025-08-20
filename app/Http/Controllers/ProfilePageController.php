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

        return Inertia::render('profile-page', [
            'user' => [
                'name' => $user->name,
                'username' => $user->username,
                'about' => $user->about,
                'created_at' => $user->created_at->toDateTimeString(),
            ],
            'is_own_profile' => Auth::check() && Auth::id() === $user->id,
        ]);
    }
}
