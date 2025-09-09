<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
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

    public function show(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $followedUserIds = $user->following()->pluck('users.id')->push($user->id);

        $posts = $this->getPostsQuery()
            ->whereIn('user_id', $followedUserIds)
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at']);

        return response()->json($this->transformPosts($posts));
    }

    public function showSingle(Post $post): Response
    {
        $post->load(['user', 'attachments', 'reactions', 'comments']);

        return Inertia::render('post-show', [
            'post' => $this->transformPost($post)
        ]);
    }

    public function userPosts(int $user_id): JsonResponse
    {
        $posts = $this->getPostsQuery()
            ->where('user_id', $user_id)
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at']);

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
            'repost_user_id' => $currentUserId,
        ]);

        $originalPost->increment('repost_count');
        $repost->load(['user', 'repostOriginal.user', 'repostOriginal.attachments']);

        return response()->json([
            ...$this->transformPost($originalPost),
            'repost_count' => $originalPost->repost_count,
            'is_reposted' => true
        ]);
    }

    private function getPostsQuery()
    {
        $currentUserId = Auth::id();

        return Post::with([
            'user' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar_path');
            },
            'attachments',
            'repostOriginal.user',
            'repostOriginal.attachments'
        ])
        ->withCount('comments')
        ->addSelect([
            'is_reposted' => Post::selectRaw('COUNT(*) > 0')
                ->whereColumn('repost_of_post_id', 'posts.id')
                ->where('user_id', $currentUserId)
        ]);
    }

    private function transformPost(Post $post): array
    {
        $currentUserId = Auth::id();
        $isRepost = !is_null($post->repost_of_post_id);
        $isReposted = $post->is_reposted;

        $baseData = [
            'id' => $post->id,
            'created_at' => $post->created_at->toDateTimeString(),
            'user' => [
                'id' => $post->user->id,
                'name' => $post->user->name,
                'username' => $post->user->username,
                'avatar_path' => $post->user->avatar_path
            ],
            'repost_count' => $post->repost_count,
            'is_repost' => $isRepost,
            'is_reposted' => $isReposted,
            'like_count' => 0,
            'is_liked' => false,
            'comment_count' => 0
        ];

        if ($isRepost && $post->repostOriginal) {
            $original = $post->repostOriginal;
            $baseData['original_post'] = $this->buildOriginalPostData($original, $currentUserId);
        } else {
            $baseData = array_merge($baseData, $this->buildPostData($post, $currentUserId));
            if ($isRepost) {
                $baseData['is_repost'] = false;
            }
        }

        return $baseData;
    }

    private function buildOriginalPostData(Post $original, int $currentUserId): array
    {
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
            'repost_count' => $original->repost_count
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