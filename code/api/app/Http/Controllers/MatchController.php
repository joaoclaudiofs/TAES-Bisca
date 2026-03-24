<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMatchRequest;
use App\Http\Requests\UpdateMatchRequest;
use App\Models\Game;
use App\Models\Matches;
use App\Models\Notification;
use App\Models\User;
use App\Http\Controllers\ScoreboardController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Termwind\Components\Li;

class MatchController extends Controller
{
    public function index(Request $request)
    {
        $query = Matches::with(['player1:id,name,nickname', 'player2:id,name,nickname', 'games'])
        ->where('type', 9);

        if ($request->boolean('mine', false)) {
            $user = $request->user();
            $query->where(function ($q) use ($user) {
                $q->where('player1_user_id', $user->id)
                  ->orWhere('player2_user_id', $user->id);
            });
        }

        $query->where('status', 'Ended');

        // Sorting
        $sortField = $request->input('sort_by', 'began_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        $allowedSortFields = [
            'began_at',
            'ended_at',
            'total_time',
            'type',
            'status'
        ];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        }

        // Pagination
        $perPage = (int) $request->input('per_page', 15);
        $matches = $query->paginate($perPage);

        // Map results and compute aggregates from related games (no draws)
        $items = $matches->getCollection()->map(function ($match) use ($request) {
            $user = $request->user();
            $isPlayer1 = $user && ($match->player1_user_id == $user->id);

            $games = $match->games ?? collect();

            $gamesCount = $games->count();
            // total player points for each player
            $totalP1Points = (int) $games->sum('player1_points');
            $totalP2Points = (int) $games->sum('player2_points');

            // total match marks for each player
            $matchP1Marks = (int) ($match->player1_marks ?? 0);
            $matchP2Marks = (int) ($match->player2_marks ?? 0);

            $winnerId = $match->winner_user_id;

            $result = null;
            if ($user) {
                $result = ($winnerId == $user->id) ? 'win' : 'loss';
            }

            return [
                'id' => $match->id,
                'ended_at' => $match->ended_at,
                'result' => $result,
                'player1_points' => $totalP1Points,
                'player2_points' => $totalP2Points,
                'player1_marks' => $matchP1Marks,
                'player2_marks' => $matchP2Marks,
                'opponent_name' => $isPlayer1
                    ? ($match->player2?->nickname ?? $match->player2?->name ?? 'Bot')
                    : ($match->player1?->nickname ?? $match->player1?->name ?? 'Bot'),
            ];
        })->toArray();

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page' => $matches->currentPage(),
                'last_page' => $matches->lastPage(),
                'per_page' => $matches->perPage(),
                'total' => $matches->total()
            ]
        ]);
    }

    public function store(StoreMatchRequest $request)
    {
        $validatedData = $request->validated();
        $match = Matches::create($validatedData);
        return response()->json($match, 201);
    }

    public function show(Game $game)
    {
        //
    }

    public function update(UpdateMatchRequest $request, Matches $match)
    {
        $validatedData = $request->validated();

        // Get previous #1 player before updating match
        $previousLeader = ScoreboardController::getTopWinsLeader();

        $match->update($validatedData);

        // Check if match just ended with a winner
        if (isset($validatedData['winner_user_id']) && $validatedData['winner_user_id']) {
            $winnerId = $validatedData['winner_user_id'];

            // Count total completed matches for this user
            $totalMatches = Matches::where('winner_user_id', $winnerId)
                ->where('status', 'Ended')
                ->count();
            Log::info("User $winnerId has $totalMatches total completed matches.");

            // Create achievement notification for 10th match
            if ($totalMatches == 2) {
                $notification = Notification::create([
                    'type' => 'achievement',
                    'title' => '10 Matches Achievement!',
                    'message' => 'Congratulations! You\'ve completed your 10th match. Keep up the great work!',
                    'route' => '/stats',
                    'data' => json_encode([
                        'user_ids' => [$winnerId],
                        'achievement_type' => '10_matches',
                        'matches' => 10
                    ]),
                    'is_global' => false,
                    'created_at' => now(),
                ]);
            }

            // Check if leaderboard top 1 changed
            $newLeader = ScoreboardController::getTopWinsLeader();
            Log::info("Previous leader ID: " . ($previousLeader ? $previousLeader->id : 'None'));
            Log::info("New leader ID: " . ($newLeader ? $newLeader->id : 'None'));
            // If there's a new leader and they're different from the previous one
            if ($newLeader && $previousLeader && $newLeader->id !== $previousLeader->id) {
                $leaderName = $newLeader->nickname ?? $newLeader->name;

                Notification::create([
                    'type' => 'scoreboard_leader',
                    'title' => 'New Leaderboard Leader!',
                    'message' => "{$leaderName} is now #1 on the leaderboard!",
                    'route' => '/scoreboard',
                    'data' => json_encode([
                        'new_leader_id' => $newLeader->id,
                        'new_leader_name' => $leaderName,
                        'wins' => (int) $newLeader->wins
                    ]),
                    'is_global' => true,
                    'created_at' => now(),
                ]);

                Log::info("New leaderboard leader: {$leaderName} (ID: {$newLeader->id}) with {$newLeader->wins} wins");
            }
        }

        return response()->json($match, 201);
    }

    public function destroy(Game $game)
    {
        //
    }

    public function games(Matches $match)
    {
        return response()->json($match->games()->get());
    }
}
