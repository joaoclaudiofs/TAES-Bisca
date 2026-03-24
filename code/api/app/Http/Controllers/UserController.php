<?php

namespace App\Http\Controllers;

use App\Models\Customization;
use App\Models\User;
use App\Models\UserCustomization;
use Illuminate\Support\Facades\DB;
use App\Models\Game;
use App\Models\Matches;
use App\Models\Notification;
use App\Http\Controllers\ScoreboardController;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $user = User::create($request->all());
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $user->update($request->all());
        return response()->json($user);
    }

    public function destroy(string $id)
    {
        //
    }

    public function addCoins(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
        ]);

        // Get previous #1 player by coins before updating
        $previousCoinsLeader = ScoreboardController::getTopCoinsLeader();

        $user->coins_balance = ($user->coins_balance ?? 0) + $validated['amount'];
        $user->save();

        // Check if coin leaderboard top 1 changed
        $newCoinsLeader = ScoreboardController::getTopCoinsLeader();

        // If there's a new leader and they're different from the previous one
        if ($newCoinsLeader && $previousCoinsLeader && $newCoinsLeader->id !== $previousCoinsLeader->id) {
            $leaderName = $newCoinsLeader->nickname ?? $newCoinsLeader->name;

            Notification::create([
                'type' => 'scoreboard_leader',
                'title' => 'New Coins Leader!',
                'message' => "{$leaderName} is now #1 in coins on the leaderboard!",
                'route' => '/scoreboard',
                'data' => json_encode([
                    'new_leader_id' => $newCoinsLeader->id,
                    'new_leader_name' => $leaderName,
                    'coins' => (int) ($newCoinsLeader->coins_balance ?? 0),
                    'leaderboard_type' => 'coins'
                ]),
                'is_global' => true,
                'created_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Coins added successfully.',
            'user' => $user,
        ]);
    }

    public function removeCoins(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
        ]);

        $current = $user->coins_balance ?? 0;

        if ($validated['amount'] > $current) {
            return response()->json([
                'message' => 'Insufficient coins.',
                'current_coins' => $current,
            ], 422);
        }

        $user->coins_balance = $current - $validated['amount'];
        $user->save();

        return response()->json([
            'message' => 'Coins removed successfully.',
            'user' => $user,
        ]);
    }

    public function purchaseCustomization(Request $request, Customization $customization)
    {

        $user = $request->user();

        if (
            DB::table('user_customizations')->where('user_id', $user->id)->where('customization_id', $customization->id)->exists() ||
            ($customization->price == 0)
        ) {
            return response()->json(['message' => 'Already owned'], 409);
        }

        if (($user->coins_balance ?? 0) < $customization->price) {
            return response()->json(['message' => 'Insufficient coins'], 422);
        }

        $user->coins_balance -= $customization->price;
        $user->save();

        DB::table('user_customizations')->insert([
            'user_id' => $user->id,
            'customization_id' => $customization->id,
            'purchased_at' => now(),
        ]);

        return response()->json(['message' => 'Purchased', 'coins_balance' => $user->coins_balance]);
    }

    public function equipCustomization(Request $request, Customization $customization)
    {

        $user = $request->user();

        $isOwner = UserCustomization::where('user_id', $user->id)
            ->where('customization_id', $customization->id)
            ->exists()
            || $customization->price == 0;

        if (!$isOwner) {
            return response()->json(['message' => 'Not owned'], 409);
        }

        $type = $customization->type;

        if ($type === 'avatar') {
            $user->current_avatar_customization_id = $customization->id;
        } else if ($type === 'deck') {
            $user->current_deck_customization_id = $customization->id;
        } else {
            return response()->json(['message' => 'Invalid type'], 400);
        }

        $user->save();

        return response()->json(['message' => 'Equipped']);
    }

    public function stats(Request $request)
    {
        $user = $request->user();

        $wins = Matches::where('winner_user_id', $user->id)->where('status', 'Ended')->where('type', 9)->count();
        $losses = Matches::where('loser_user_id', $user->id)->where('status', 'Ended')->where('type', 9)->count();

        $totalMatches = $wins + $losses;
        $winRate = $totalMatches > 0 ? round(($wins / $totalMatches) * 100, 1) : 0;

        $pointsAsPlayer1 = Matches::where('player1_user_id', $user->id)->where('type', 9)->sum('player1_points');
        $pointsAsPlayer2 = Matches::where('player2_user_id', $user->id)->where('type', 9)->sum('player2_points');
        $totalPoints = $pointsAsPlayer1 + $pointsAsPlayer2;

        $avgPoints = $totalMatches > 0 ? round($totalPoints / $totalMatches, 1) : 0;

        // Recent matches (last 10)
        $recentMatches = Matches::where(function ($q) use ($user) {
                $q->where('player1_user_id', $user->id)
                  ->orWhere('player2_user_id', $user->id);
            })
            ->where('type', 9)
            ->with(['player1:id,name,nickname', 'player2:id,name,nickname'])
            ->where('status', 'Ended')
            ->orderBy('ended_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($match) use ($user) {
                $isP1 = $match->player1_user_id === $user->id;
                $userPoints = $isP1 ? $match->player1_points : $match->player2_points;
                $opponentPoints = $isP1 ? $match->player2_points : $match->player1_points;
                $opponent = $isP1 ? $match->player2 : $match->player1;

                $winnerId = $match->winner_user_id;
                $result = null;
                if ($user) {
                    $result = ($winnerId == $user->id) ? 'win' : 'loss';
                }

                return [
                    'id' => $match->id,
                    'result' => $result,
                    'user_points' => $userPoints,
                    'opponent_points' => $opponentPoints,
                    'opponent_name' => $opponent?->nickname ?? $opponent?->name ?? 'Bot',
                    'played_at' => $match->ended_at,
                    'duration' => $match->total_time,
                ];
            });

        return response()->json([
            'wins' => $wins,
            'losses' => $losses,
            'total_matches' => $totalMatches,
            'win_rate' => $winRate,
            'total_points' => $totalPoints,
            'avg_points' => $avgPoints,
            'recent_matches' => $recentMatches,
        ]);
    }

    public function getEquippedDeck(Request $request)
    {
        $user = $request->user();

        if (!$user->current_deck_customization_id) {
            //deck padrão
            $deck = Customization::where('type', 'deck')->where('price', 0)->first();
        } else {
            $deck = Customization::find($user->current_deck_customization_id);
        }

        return response()->json($deck);
    }

    public function getEquippedAvatar(Request $request)
    {
        $user = $request->user();

        if (!$user->current_avatar_customization_id) {
            //avatar padrão
            $avatar = Customization::where('type', 'avatar')->where('price', 0)->first();
        } else {
            $avatar = Customization::find($user->current_avatar_customization_id);
        }

        return response()->json($avatar);
    }

    public function getOwnedCustomizations(Request $request)
    {
        $user = $request->user();

        $ownedCustomizations = UserCustomization::where('user_id', $user->id)
            ->pluck('customization_id')
            ->toArray();

        return response()->json($ownedCustomizations);
    }
}
