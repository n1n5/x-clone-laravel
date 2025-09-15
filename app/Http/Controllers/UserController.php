<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');
        $currentUserId = $request->user()->id;

        $users = User::where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
                ->orWhere('username', 'like', "%{$query}%");
        })
            ->where('id', '!=', $currentUserId)
            ->select('id', 'name', 'username', 'avatar_path')
            ->limit(10)
            ->get();

        return response()->json($users);
    }
}
