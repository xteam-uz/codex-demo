<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class NewsController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => [],
            'meta' => ['current_page' => 1, 'last_page' => 1, 'per_page' => 12, 'total' => 0],
            'message' => 'OK',
        ]);
    }

    public function show(string $slug)
    {
        return response()->json([
            'success' => true,
            'data' => ['slug' => $slug],
            'message' => 'OK',
        ]);
    }
}
