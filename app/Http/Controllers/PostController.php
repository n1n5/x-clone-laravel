<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    public function create()
    {
        return Inertia::render('post-create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:280',
        ]);

        $post = new Post([
            'body' => $validated['body'],
            'user_id' => Auth::id(),
        ]);

        $post->save();

        return Inertia::render('home');;
    }

    public function api()
    {
        $posts = Post::with(['user' => function ($query) {
            $query->select('id', 'name', 'username', 'avatar_path');
        }])
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at'])
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'body' => $post->body,
                    'created_at' => $post->created_at->toDateTimeString(),
                    'user' => [
                        'id' => $post->user->id,
                        'name' => $post->user->name,
                        'username' => $post->user->username,
                        'avatar_path' => $post->user->avatar_path
                    ]
                ];
            });

        return response()->json($posts);
    }

    public function userPosts($user_id)
    {
        $posts = Post::with(['user' => function ($query) {
            $query->select('id', 'name', 'username', 'avatar_path');
        }])
            ->where('user_id', $user_id)
            ->latest()
            ->get(['id', 'body', 'user_id', 'created_at'])
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'body' => $post->body,
                    'created_at' => $post->created_at->toDateTimeString(),
                    'user' => [
                        'id' => $post->user->id,
                        'name' => $post->user->name,
                        'username' => $post->user->username,
                        'avatar_path' => $post->user->avatar_path
                    ]
                ];
            });

        return response()->json($posts);
    }
}
