<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Matches;
use Illuminate\Support\Facades\DB;

class GiveUser1WinsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the current first place
        $firstPlace = User::select('users.id')
            ->selectRaw('COUNT(matches.id) as wins')
            ->leftJoin('matches', 'users.id', '=', 'matches.winner_user_id')
            ->whereNull('users.deleted_at')
            ->groupBy('users.id')
            ->orderByDesc('wins')
            ->orderBy('users.id')
            ->first();

        if (!$firstPlace) {
            $this->command->info('No users with wins found.');
            return;
        }

        // Get current wins for user 1
        $user1Wins = DB::table('matches')->where('winner_user_id', 1)->count();

        $targetWins = $firstPlace->wins - 1;

        $this->command->info("First place (User {$firstPlace->id}): {$firstPlace->wins} wins");
        $this->command->info("User 1 currently has: {$user1Wins} wins");
        $this->command->info("Target wins for User 1: {$targetWins}");

        if ($user1Wins >= $targetWins) {
            // Need to remove wins
            $toRemove = $user1Wins - $targetWins;
            $this->command->info("Removing {$toRemove} wins from User 1...");

            $matchesToDelete = DB::table('matches')
                ->where('winner_user_id', 1)
                ->orderBy('id', 'desc')
                ->limit($toRemove)
                ->pluck('id');

            DB::table('matches')->whereIn('id', $matchesToDelete)->delete();
        } else {
            // Need to add wins
            $toAdd = $targetWins - $user1Wins;
            $this->command->info("Adding {$toAdd} wins to User 1...");

            for ($i = 0; $i < $toAdd; $i++) {
                Matches::create([
                    'type' => '3',
                    'status' => 'Ended',
                    'winner_user_id' => 1,
                    'began_at' => now()->subMinutes(10 + $i),
                    'ended_at' => now()->subMinutes($i),
                    'total_time' => 600,
                ]);
            }
        }

        $newUser1Wins = DB::table('matches')->where('winner_user_id', 1)->count();
        $this->command->info("User 1 now has: {$newUser1Wins} wins");
    }
}
