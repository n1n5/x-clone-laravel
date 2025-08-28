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

    public function show(): JsonResponse
    {
        $posts = $this->getPostsQuery()
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at']);

        return response()->json($this->transformPosts($posts));
    }

    public function userPosts(int $user_id): JsonResponse
    {
        $posts = $this->getPostsQuery()
            ->where('user_id', $user_id)
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

    private function getPostsQuery()
    {
        return Post::with([
            'user' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar_path');
            },
            'attachments'
        ]);
    }

    private function transformPosts($posts): array
    {
        $currentUserId = Auth::id();

        return $posts->map(function ($post) use ($currentUserId) {
            $likeCount = $post->reactions()->where('type', 'like')->count();
            $isLiked = $post->reactions()
                ->where('user_id', $currentUserId)
                ->where('type', 'like')
                ->exists();

            return [
                'id' => $post->id,
                'body' => $post->body,
                'created_at' => $post->created_at->toDateTimeString(),
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'username' => $post->user->username,
                    'avatar_path' => $post->user->avatar_path
                ],
                'attachments' => $post->attachments->map(function ($attachment) {
                    return [
                        'path' => $attachment->path,
                        'mime' => $attachment->mime,
                    ];
                }),
                'like_count' => $likeCount,
                'is_liked' => $isLiked
            ];
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
        $file->move(public_path('attachments'), $fileName);
        $path = 'attachments/' . $fileName;

        PostAttachment::create([
            'post_id' => $post->id,
            'path' => $path,
            'mime' => $mimeType,
            'created_by' => Auth::id(),
        ]);
    }
}
