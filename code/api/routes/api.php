<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BoardThemeController;
use App\Http\Controllers\CardFaceController;
use App\Http\Controllers\CustomizationsController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\ScoreboardController;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users/me', function (Request $request) {
        return $request->user();
    });
    Route::get('/users/me/deck', [UserController::class, 'getEquippedDeck']);
    Route::get('/users/me/avatar', [UserController::class, 'getEquippedAvatar']);
    Route::get('/users/me/matches', function (Request $request) {
        $request->merge(['mine' => 1]);
        return app(MatchController::class)->index($request);
    });

    Route::post('logout', [AuthController::class, 'logout']);

    Route::prefix('users')->group(function () {
        Route::post('/coins/add', [UserController::class, 'addCoins']);
        Route::post('/coins/remove', [UserController::class, 'removeCoins']);
        Route::get('/stats', [UserController::class, 'stats']);
    });

    Route::apiResource('games', GameController::class)->only(['index', 'show', 'store']);
    Route::apiResource('matches', MatchController::class)->only(['index', 'show', 'store', 'update']);
    Route::get('/matches/{match}/games', [MatchController::class, 'games']);

    Route::get('/customizations/owned', [UserController::class, 'getOwnedCustomizations']);
    Route::get('/customizations/{type}', [CustomizationsController::class, 'index']);

    Route::get('/customizations/{customization}/owned', [CustomizationsController::class, 'hasCustomization']);
    Route::post('/customizations/{customization}/purchase', [UserController::class, 'purchaseCustomization']);
    Route::post('/customizations/{customization}/equip', [UserController::class, 'equipCustomization']);

    Route::get('/scoreboard', [ScoreboardController::class, 'index']);

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/', [NotificationController::class, 'store']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/{id}/dismiss', [NotificationController::class, 'dismiss']);
        Route::delete('/clear', [NotificationController::class, 'clearAll']);
    });
});
