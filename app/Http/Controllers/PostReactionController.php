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

    public function repost(Post $post): JsonResponse
    {
        $originalPost = $post->repost_of_post_id ? $post->repostOriginal : $post;
        $currentUserId = Auth::id();

        $existingRepost = Post::where('user_id', $currentUserId)
            ->where('repost_of_post_id', $originalPost->id)
            ->first();

        if ($existingRepost) {
            $existingRepost->delete();
            $originalPost->decrement('repost_count');

            return response()->json([
                'message' => 'Post unreposted',
                'repost_count' => $originalPost->repost_count,
                'is_reposted' => false
            ]);
        }

        $repost = Post::create([
            'user_id' => $currentUserId,
            'repost_of_post_id' => $originalPost->id,
            'is_repost' => true,
        ]);

        $originalPost->increment('repost_count');

        return response()->json([
            'message' => 'Post reposted',
            'repost_count' => $originalPost->repost_count,
            'is_reposted' => true
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
