<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;

class NotificationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the admin user
        $admin = User::where('email', 'a1@mail.pt')->first();
        
        if (!$admin) {
            $this->command->warn('Admin user with email a1@mail.pt not found!');
            return;
        }

        // Global notification - visible to all users
        Notification::create([
            'type' => 'system',
            'title' => 'Welcome to the Game!',
            'message' => 'Thank you for joining our card game community. Enjoy playing and earning coins!',
            'route' => '/dashboard',
            'data' => json_encode([]),
            'is_global' => true,
            'created_at' => Carbon::now()->subDays(5),
        ]);

        // Global announcement
        Notification::create([
            'type' => 'system',
            'title' => 'New Features Available',
            'message' => 'Check out the new customization options in the store!',
            'route' => '/store',
            'data' => json_encode([]),
            'is_global' => true,
            'created_at' => Carbon::now()->subDays(3),
        ]);

        // User-specific notification for admin - Achievement
        Notification::create([
            'type' => 'achievement',
            'title' => '10 Matches Achievement!',
            'message' => 'Congratulations! You\'ve completed your 10th match. Keep up the great work!',
            'route' => '/stats',
            'data' => json_encode([
                'user_ids' => [$admin->id],
                'achievement_type' => '10_matches',
                'matches' => 10
            ]),
            'is_global' => false,
            'created_at' => Carbon::now()->subDays(2),
        ]);

        // User-specific notification for admin - New Leader
        Notification::create([
            'type' => 'scoreboard_leader',
            'title' => 'New Scoreboard Leader!',
            'message' => 'You are now #1 on the leaderboard! Congratulations!',
            'route' => '/scoreboard',
            'data' => json_encode([
                'user_ids' => [$admin->id],
            ]),
            'is_global' => false,
            'created_at' => Carbon::now()->subDays(1),
        ]);

        // User-specific notification for admin - New Customization
        Notification::create([
            'type' => 'new_customization',
            'title' => 'New Item Available!',
            'message' => 'Check out the new "Golden Deck" in the store!',
            'route' => '/store',
            'data' => json_encode([
                'user_ids' => [$admin->id],
            ]),
            'is_global' => false,
            'created_at' => Carbon::now()->subHours(12),
        ]);

        // User-specific notification for admin - Victory Reward
        Notification::create([
            'type' => 'achievement',
            'title' => 'Victory!',
            'message' => 'You won and earned 150 coins! Keep winning!',
            'route' => '/dashboard',
            'data' => json_encode([
                'user_ids' => [$admin->id],
                'coins_earned' => 150
            ]),
            'is_global' => false,
            'created_at' => Carbon::now()->subHours(6),
        ]);

        // Expiring notification (expires in 7 days)
        Notification::create([
            'type' => 'system',
            'title' => 'Limited Time Offer!',
            'message' => 'Get 50% off on all customizations this week!',
            'route' => '/store',
            'data' => json_encode([]),
            'is_global' => true,
            'created_at' => Carbon::now()->subHours(2),
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        $this->command->info('Notifications seeded successfully!');
    }
}
