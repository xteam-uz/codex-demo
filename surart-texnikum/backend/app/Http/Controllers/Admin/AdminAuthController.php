<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'token' => 'demo-token',
                'user' => ['id' => 1, 'name' => 'Admin'],
            ],
            'message' => 'OK',
        ]);
    }

    public function logout()
    {
        return response()->json(['success' => true, 'message' => 'Logged out']);
    }

    public function me()
    {
        return response()->json(['success' => true, 'data' => ['id' => 1, 'name' => 'Admin'], 'message' => 'OK']);
    }
}
