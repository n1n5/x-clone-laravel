<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;

trait TransformsPosts
{
    private function transformPost(Post $post): array
    {
        $currentUserId = Auth::id();
        $isRepost = !is_null($post->repost_of_post_id);

        $originalPostId = $isRepost ? $post->repost_of_post_id : $post->id;

        $isReposted = Post::where('user_id', $currentUserId)
            ->where('repost_of_post_id', $originalPostId)
            ->exists();

        $baseData = [
            'id' => $post->id,
            'created_at' => $post->created_at->toDateTimeString(),
            'user' => [
                'id' => $post->user->id,
                'name' => $post->user->name,
                'username' => $post->user->username,
                'avatar_path' => $post->user->avatar_path
            ],
            'is_repost' => $isRepost,
            'is_reposted' => $isReposted,
            'repost_count' => $isRepost && $post->repostOriginal
                ? $post->repostOriginal->repost_count
                : $post->repost_count,
            'like_count' => 0,
            'is_liked' => false,
            'comment_count' => 0,
            'bookmark_count' => $post->bookmarks_count ?? $post->bookmarks()->count(),
            'is_bookmarked' => $post->is_bookmarked ?? false,
            'bookmark_id' => $post->bookmark_id ?? null,
        ];

        if ($isRepost && $post->repostOriginal) {
            $baseData['original_post'] = $this->buildOriginalPostData($post->repostOriginal, $currentUserId);
        } else {
            $postData = $this->buildPostData($post, $currentUserId);
            $baseData = array_merge($baseData, $postData);
        }

        return $baseData;
    }

    private function buildOriginalPostData(Post $original, int $currentUserId): array
    {
        $isReposted = Post::where('user_id', $currentUserId)
            ->where('repost_of_post_id', $original->id)
            ->exists();

        $bookmarkCount = $original->bookmarks_count ?? $original->bookmarks()->count();
        $isBookmarked = $original->is_bookmarked ?? $original->bookmarks()->where('user_id', $currentUserId)->exists();
        $bookmarkId = $original->bookmark_id;

        if ($isBookmarked && !$bookmarkId) {
            $bookmark = $original->bookmarks()->where('user_id', $currentUserId)->first();
            $bookmarkId = $bookmark ? $bookmark->id : null;
        }

        return [
            'id' => $original->id,
            'body' => $original->body,
            'created_at' => $original->created_at->toDateTimeString(),
            'user' => [
                'id' => $original->user->id,
                'name' => $original->user->name,
                'username' => $original->user->username,
                'avatar_path' => $original->user->avatar_path
            ],
            'attachments' => $original->attachments->map(fn($a) => [
                'path' => $a->path,
                'mime' => $a->mime
            ]),
            'like_count' => $original->reactions()->where('type', 'like')->count(),
            'is_liked' => $original->reactions()
                ->where('user_id', $currentUserId)
                ->where('type', 'like')
                ->exists(),
            'comment_count' => $original->comments()->count(),
            'repost_count' => $original->repost_count,
            'is_reposted' => $isReposted,
            'bookmark_count' => $bookmarkCount,
            'is_bookmarked' => $isBookmarked,
            'bookmark_id' => $bookmarkId,
        ];
    }

    private function buildPostData(Post $post, int $currentUserId): array
    {
        return [
            'body' => $post->body,
            'attachments' => $post->attachments->map(fn($a) => [
                'path' => $a->path,
                'mime' => $a->mime
            ]),
            'like_count' => $post->reactions()->where('type', 'like')->count(),
            'is_liked' => $post->reactions()
                ->where('user_id', $currentUserId)
                ->where('type', 'like')
                ->exists(),
            'comment_count' => $post->comments()->count()
        ];
    }
}
