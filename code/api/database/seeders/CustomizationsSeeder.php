<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomizationsSeeder extends Seeder
{
    public static $fixedCustomizations = [
        ['name' => 'Classic', 'price' => 0, 'type' => 'deck'],
        ['name' => 'Blue Gradient', 'price' => 250, 'type' => 'deck'],
        ['name' => 'Purple Gradient', 'price' => 500, 'type' => 'deck'],

        ['name' => 'Default', 'price' => 0, 'type' => 'avatar', 'image_url' => '/avatars/default.jpg'],
        ['name' => 'Raccoon', 'price' => 50, 'type' => 'avatar', 'image_url' => '/avatars/raccoon.png'],
        ['name' => 'Smile', 'price' => 50, 'type' => 'avatar', 'image_url' => '/avatars/smile.png'],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $createdDate = now();

        $rows = [];
        foreach (self::$fixedCustomizations as $item) {
            $rows[] = [
                'name'  => $item['name'],
                'price' => $item['price'],
                'type'  => $item['type'],
                'image_url' => $item['image_url'] ?? null,
            ];
        }

        DB::table('customizations')->insert($rows);
    }
}
