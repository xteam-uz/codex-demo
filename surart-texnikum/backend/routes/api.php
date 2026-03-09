<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Admin\AdminAuthController;

Route::middleware('set.locale')->group(function () {
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{slug}', [NewsController::class, 'show']);
    Route::post('/applications', fn () => response()->json(['success' => true, 'message' => 'Application submitted']));
    Route::post('/contacts', fn () => response()->json(['success' => true, 'message' => 'Message sent']));
});

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);
    });
});
