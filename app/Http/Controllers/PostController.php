<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostAttachment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function create()
    {
        return Inertia::render('post-create');
    }

    public function edit(Post $post)
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

    public function store(Request $request)
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

        $post = new Post([
            'body' => $validated['body'],
            'user_id' => Auth::id(),
        ]);

        $post->save();

        if ($request->hasFile('media') && $request->file('media')->isValid()) {
            $file = $request->file('media');
            $mimeType = $file->getMimeType();
            $fileName = $post->id . '.png';
            $file->move(public_path('attachments'), $fileName);
            $path = 'attachments/' . $fileName;

            $attachment = new PostAttachment([
                'post_id' => $post->id,
                'path' => $path,
                'mime' => $mimeType,
                'created_by' => Auth::id(),
            ]);
            $attachment->save();
        }

        return Inertia::render('home');
    }

    public function show()
    {
        $posts = $this->getPostsQuery()
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at']);

        return response()->json($this->transformPosts($posts));
    }

    public function userPosts($user_id)
    {
        $posts = $this->getPostsQuery()
            ->where('user_id', $user_id)
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at']);

        return response()->json($this->transformPosts($posts));
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

    private function transformPosts($posts)
    {
        return $posts->map(function ($post) {
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
                })
            ];
        });
    }

    public function update(Request $request, Post $post)
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

    public function destroy(Post $post)
    {
        if (Auth::id() !== $post->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();
        return response()->json(['message' => 'Post deleted']);
    }
}