<?php

namespace App\Http\Controllers;

use App\Models\Follower;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function follow(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        /** @var User $follower */
        $follower = Auth::user();
        /** @var User $following */
        $following = User::findOrFail($request->user_id);

        if ($follower->following()->where('users.id', $following->id)->exists()) {
            return response()->json(['message' => 'Already following this user'], 400);
        }

        Follower::create([
            'user_id' => $following->id,
            'follower_id' => $follower->id,
        ]);

        return response()->json(['message' => 'Successfully followed user']);
    }

    public function unfollow(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        /** @var User $follower */
        $follower = Auth::user();
        /** @var User $following */
        $following = User::findOrFail($request->user_id);

        $followRecord = Follower::where('user_id', $following->id)
            ->where('follower_id', $follower->id)
            ->first();

        if (!$followRecord) {
            return response()->json(['message' => 'Not following this user'], 400);
        }

        $followRecord->delete();

        return response()->json(['message' => 'Successfully unfollowed user']);
    }
}
