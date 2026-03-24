<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Game;
use App\Models\Matches;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScoreboardController extends Controller
{
    /**
     * Get the current #1 player by wins
     */
    public static function getTopWinsLeader()
    {
        return User::select('users.id', 'users.name', 'users.nickname')
            ->selectRaw('COUNT(matches.id) as wins')
            ->leftJoin('matches', 'users.id', '=', 'matches.winner_user_id')
            ->whereNull('users.deleted_at')
            ->groupBy('users.id', 'users.name', 'users.nickname')
            ->orderByDesc('wins')
            ->orderBy('users.id')
            ->first();
    }

    /**
     * Get the current #1 player by coins
     */
    public static function getTopCoinsLeader()
    {
        return User::select('id', 'name', 'nickname', 'coins_balance')
            ->whereNull('deleted_at')
            ->orderByDesc('coins_balance')
            ->orderBy('id')
            ->first();
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        $offset = ($page - 1) * $perPage;
        $currentUser = $request->user();
        $totalUsers = User::whereNull('deleted_at')->count();

        // Most wins ranking - full list for position calculation
        $winsRanking = User::select('users.id', 'users.name', 'users.nickname', 'users.current_avatar_customization_id')
            ->selectRaw('COUNT(matches.id) as wins')
            ->leftJoin('matches', 'users.id', '=', 'matches.winner_user_id')
            ->whereNull('users.deleted_at')
            ->groupBy('users.id', 'users.name', 'users.nickname', 'users.current_avatar_customization_id')
            ->orderByDesc('wins')
            ->orderBy('users.id')
            ->get();

        $mostWins = $winsRanking->skip($offset)->take($perPage)->values()->map(function ($user, $index) use ($offset) {
            return [
                'rank' => $offset + $index + 1,
                'id' => $user->id,
                'name' => $user->nickname ?? $user->name,
                'current_avatar_customization_id' => $user->current_avatar_customization_id,
                'value' => (int) $user->wins,
            ];
        });

        // Find current user's position in wins ranking
        $userWinsPosition = null;
        if ($currentUser) {
            $userWinsIndex = $winsRanking->search(fn($u) => $u->id === $currentUser->id);
            if ($userWinsIndex !== false) {
                $userWinsPosition = [
                    'rank' => $userWinsIndex + 1,
                    'id' => $currentUser->id,
                    'name' => $currentUser->nickname ?? $currentUser->name,
                    'current_avatar_customization_id' => $currentUser->current_avatar_customization_id,
                    'value' => (int) $winsRanking[$userWinsIndex]->wins,
                    'total' => $totalUsers,
                ];
            }
        }

        // Most coins ranking
        $coinsRanking = User::select('id', 'name', 'nickname', 'current_avatar_customization_id', 'coins_balance')
            ->whereNull('deleted_at')
            ->orderByDesc('coins_balance')
            ->orderBy('id')
            ->get();

        $mostCoins = $coinsRanking->skip($offset)->take($perPage)->values()->map(function ($user, $index) use ($offset) {
            return [
                'rank' => $offset + $index + 1,
                'id' => $user->id,
                'name' => $user->nickname ?? $user->name,
                'current_avatar_customization_id' => $user->current_avatar_customization_id,
                'value' => (int) ($user->coins_balance ?? 0),
            ];
        });

        // Find current user's position in coins ranking
        $userCoinsPosition = null;
        if ($currentUser) {
            $userCoinsIndex = $coinsRanking->search(fn($u) => $u->id === $currentUser->id);
            if ($userCoinsIndex !== false) {
                $userCoinsPosition = [
                    'rank' => $userCoinsIndex + 1,
                    'id' => $currentUser->id,
                    'name' => $currentUser->nickname ?? $currentUser->name,
                    'current_avatar_customization_id' => $currentUser->current_avatar_customization_id,
                    'value' => (int) ($coinsRanking[$userCoinsIndex]->coins_balance ?? 0),
                    'total' => $totalUsers,
                ];
            }
        }

        // Calculate pagination metadata
        $winsTotal = $winsRanking->count();
        $coinsTotal = $coinsRanking->count();

        return response()->json([
            'most_wins' => [
                'items' => $mostWins,
                'my_position' => $userWinsPosition,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total' => $winsTotal,
                    'last_page' => (int) ceil($winsTotal / $perPage),
                    'has_more' => $page * $perPage < $winsTotal,
                ],
            ],
            'most_coins' => [
                'items' => $mostCoins,
                'my_position' => $userCoinsPosition,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total' => $coinsTotal,
                    'last_page' => (int) ceil($coinsTotal / $perPage),
                    'has_more' => $page * $perPage < $coinsTotal,
                ],
            ],
        ]);
    }
}
