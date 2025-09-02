<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NonFollowedUsersController extends Controller
{
    public function index(): JsonResponse
    {
        $currentUser = Auth::user();
        $nonFollowed = User::whereDoesntHave('followers', function ($query) use ($currentUser) {
            $query->where('follower_id', $currentUser->id);
        })
            ->where('id', '!=', $currentUser->id)
            ->limit(3)
            ->get(['id', 'name', 'username', 'avatar_path']);

        return response()->json($nonFollowed);
    }
}
