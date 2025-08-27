<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostReaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PostReactionController extends Controller
{
    public function store(Post $post): JsonResponse
    {
        $existingReaction = $this->findUserReaction($post);

        if ($existingReaction) {
            return response()->json(['message' => 'Already liked'], 409);
        }

        PostReaction::create([
            'post_id' => $post->id,
            'user_id' => Auth::id(),
            'type' => 'like',
        ]);

        return response()->json([
            'message' => 'Post liked',
            'like_count' => $post->reactions()->count()
        ]);
    }

    public function destroy(Post $post): JsonResponse
    {
        $reaction = $this->findUserReaction($post);

        if (!$reaction) {
            return response()->json(['message' => 'Reaction not found'], 404);
        }

        $reaction->delete();

        return response()->json([
            'message' => 'Post unliked',
            'like_count' => $post->reactions()->count()
        ]);
    }

    private function findUserReaction(Post $post): ?PostReaction
    {
        return PostReaction::where('post_id', $post->id)
            ->where('user_id', Auth::id())
            ->where('type', 'like')
            ->first();
    }
}