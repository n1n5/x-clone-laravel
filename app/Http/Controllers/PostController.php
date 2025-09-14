<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Bookmark;
use App\Models\PostAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Concerns\TransformsPosts;

class PostController extends Controller
{
    use TransformsPosts;
    public function create(): Response
    {
        return Inertia::render('post-create');
    }

    public function edit(Post $post): Response
    {
        if (Auth::id() !== $post->user_id) {
            abort(403);
        }

        return Inertia::render('post-edit', [
            'post' => [
                'id' => $post->id,
                'body' => $post->body,
                'created_at' => $post->created_at,
                'user' => $post->user,
                'attachments' => $post->attachments,
            ]
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'body' => 'nullable|string|max:280',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:51200',
        ]);

        if (empty($validated['body']) && !$request->hasFile('media')) {
            return back()->withErrors([
                'message' => 'Post must contain text or an image'
            ]);
        }

        $post = Post::create([
            'body' => $validated['body'],
            'user_id' => Auth::id(),
        ]);

        $this->handleMediaUpload($request, $post);

        return redirect()->route('home');
    }

    public function showSingle(Post $post): Response
    {
        $currentUserId = Auth::id();

        $post->load([
            'user',
            'attachments',
            'reactions',
            'comments',
            'repostOriginal' => function ($query) use ($currentUserId) {
                $query->with(['user', 'attachments'])
                    ->withCount(['comments', 'bookmarks'])
                    ->addSelect([
                        'is_bookmarked' => Bookmark::selectRaw('COUNT(*) > 0')
                            ->whereColumn('post_id', 'posts.id')
                            ->where('user_id', $currentUserId),
                        'bookmark_id' => Bookmark::select('id')
                            ->whereColumn('post_id', 'posts.id')
                            ->where('user_id', $currentUserId)
                            ->limit(1)
                    ]);
            }
        ])
            ->loadCount(['comments', 'bookmarks']);

        $post->is_bookmarked = $post->bookmarks()->where('user_id', $currentUserId)->exists();
        $bookmark = $post->bookmarks()->where('user_id', $currentUserId)->first();
        $post->bookmark_id = $bookmark ? $bookmark->id : null;

        return Inertia::render('post-show', [
            'post' => $this->transformPost($post)
        ]);
    }

    public function show(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $followedUserIds = $user->following()->pluck('users.id')->push($user->id);

        $posts = $this->getPostsQuery()
            ->whereIn('user_id', $followedUserIds)
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at']);

        $this->loadBookmarkData($posts);

        return response()->json($this->transformPosts($posts));
    }

    public function userPosts(int $user_id): JsonResponse
    {
        $posts = $this->getPostsQuery()
            ->where('user_id', $user_id)
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at']);

        $this->loadBookmarkData($posts);

        return response()->json($this->transformPosts($posts));
    }

    public function nonFollowedPosts(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $excludedUserIds = $user->following()
            ->pluck('users.id')
            ->push($user->id);

        $posts = $this->getPostsQuery()
            ->whereNotIn('user_id', $excludedUserIds)
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at']);

        $this->loadBookmarkData($posts);

        return response()->json($this->transformPosts($posts));
    }

    public function update(Request $request, Post $post): JsonResponse
    {
        if (Auth::id() !== $post->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string|max:280'
        ]);

        $post->update($validated);

        return response()->json(['message' => 'Post updated']);
    }

    public function destroy(Post $post): JsonResponse
    {
        if (Auth::id() !== $post->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted']);
    }

    private function getPostsQuery()
    {
        $currentUserId = Auth::id();

        return Post::with([
            'user' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar_path');
            },
            'attachments',
            'repostOriginal' => function ($query) use ($currentUserId) {
                $query->with(['user', 'attachments'])
                    ->withCount(['comments', 'bookmarks'])
                    ->addSelect([
                        'is_bookmarked' => Bookmark::selectRaw('COUNT(*) > 0')
                            ->whereColumn('post_id', 'posts.id')
                            ->where('user_id', $currentUserId),
                        'bookmark_id' => Bookmark::select('id')
                            ->whereColumn('post_id', 'posts.id')
                            ->where('user_id', $currentUserId)
                            ->limit(1)
                    ]);
            }
        ])
            ->withCount(['comments', 'bookmarks'])
            ->addSelect([
                'is_reposted' => Post::selectRaw('COUNT(*) > 0')
                    ->whereColumn('repost_of_post_id', 'posts.id')
                    ->where('user_id', $currentUserId),
                'is_bookmarked' => Bookmark::selectRaw('COUNT(*) > 0')
                    ->whereColumn('post_id', 'posts.id')
                    ->where('user_id', $currentUserId),
                'bookmark_id' => Bookmark::select('id')
                    ->whereColumn('post_id', 'posts.id')
                    ->where('user_id', $currentUserId)
                    ->limit(1)
            ]);
    }

    private function loadBookmarkData($posts)
    {
        $currentUserId = Auth::id();

        if ($posts instanceof \Illuminate\Database\Eloquent\Collection) {
            foreach ($posts as $post) {
                $this->loadBookmarkDataForSinglePost($post, $currentUserId);
            }
        } else {
            $this->loadBookmarkDataForSinglePost($posts, $currentUserId);
        }

        return $posts;
    }

    private function loadBookmarkDataForSinglePost($post, $currentUserId)
    {
        if (!isset($post->is_bookmarked)) {
            $post->is_bookmarked = $post->bookmarks()->where('user_id', $currentUserId)->exists();
        }

        if (!isset($post->bookmark_id) && $post->is_bookmarked) {
            $bookmark = $post->bookmarks()->where('user_id', $currentUserId)->first();
            $post->bookmark_id = $bookmark ? $bookmark->id : null;
        }

        if ($post->repostOriginal && !isset($post->repostOriginal->is_bookmarked)) {
            $post->repostOriginal->is_bookmarked = $post->repostOriginal->bookmarks()
                ->where('user_id', $currentUserId)->exists();

            if ($post->repostOriginal->is_bookmarked) {
                $bookmark = $post->repostOriginal->bookmarks()->where('user_id', $currentUserId)->first();
                $post->repostOriginal->bookmark_id = $bookmark ? $bookmark->id : null;
            }
        }
    }

    private function transformPosts($posts): array
    {
        return $posts->map(function ($post) {
            return $this->transformPost($post);
        })->toArray();
    }

    private function handleMediaUpload(Request $request, Post $post): void
    {
        if (!$request->hasFile('media') || !$request->file('media')->isValid()) {
            return;
        }

        $file = $request->file('media');
        $mimeType = $file->getMimeType();
        $fileName = $post->id . '.png';
        $path = 'attachments/' . $fileName;

        $file->move(public_path('attachments'), $fileName);

        PostAttachment::create([
            'post_id' => $post->id,
            'path' => $path,
            'mime' => $mimeType,
            'created_by' => Auth::id(),
        ]);
    }
}
