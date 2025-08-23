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
}
