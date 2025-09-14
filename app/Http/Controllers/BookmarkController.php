<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $bookmarks = Bookmark::where('user_id', $user->id)
            ->with([
                'post.user',
                'post.attachments',
                'post.reactions',
                'post.comments'
            ])
            ->latest()
            ->paginate(20);

        $bookmarks->getCollection()->transform(function ($bookmark) use ($user) {
            $post = $bookmark->post;

            $post->bookmark_count = $post->bookmarks()->count();
            $post->is_bookmarked = true;
            $post->bookmark_id = $bookmark->id;

            $post->like_count = $post->reactions()->where('type', 'like')->count();
            $post->is_liked = $post->reactions()
                ->where('user_id', $user->id)
                ->where('type', 'like')
                ->exists();

            $post->comment_count = $post->comments()->count();

            $post->repost_count = $post->reposts()->count();
            $post->is_reposted = Post::where('user_id', $user->id)
                ->where('repost_of_post_id', $post->id)
                ->exists();

            return $bookmark;
        });

        return response()->json($bookmarks);
    }

    public function store(Post $post)
    {
        $userId = Auth::id();

        $existingBookmark = Bookmark::where([
            'user_id' => $userId,
            'post_id' => $post->id
        ])->first();

        if ($existingBookmark) {
            return response()->json([
                'message' => 'Post already bookmarked',
                'bookmark_id' => $existingBookmark->id,
                'bookmark_count' => $post->bookmarks()->count(),
                'is_bookmarked' => true
            ]);
        }

        $bookmark = Bookmark::create([
            'user_id' => $userId,
            'post_id' => $post->id
        ]);

        return response()->json([
            'message' => 'Post bookmarked',
            'bookmark_id' => $bookmark->id,
            'bookmark_count' => $post->bookmarks()->count(),
            'is_bookmarked' => true
        ]);
    }

    public function destroy(Bookmark $bookmark)
    {

        $post = $bookmark->post;
        $bookmark->delete();

        return response()->json([
            'message' => 'Bookmark removed',
            'bookmark_count' => $post->bookmarks()->count(),
            'is_bookmarked' => false
        ]);
    }

    public function destroyByPost(Post $post)
    {
        $bookmark = Bookmark::where('user_id', Auth::id())
            ->where('post_id', $post->id)
            ->first();

        if (!$bookmark) {
            return response()->json([
                'message' => 'Bookmark not found',
                'bookmark_count' => $post->bookmarks()->count(),
                'is_bookmarked' => false
            ], 404);
        }

        return $this->destroy($bookmark);
    }
}
