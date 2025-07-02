<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Office;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Office::factory()
            ->has(Division::factory()->state([
                'name' => 'Division 1',
                'description' => 'First Division',
            ]))
            ->has(Division::factory()->state([
                'name' => 'Division 2',
                'description' => 'Second Division',
            ]))
            ->create([
                'name' => 'Admin',
                'description' => 'City Administrator',
            ]);

        // User::factory()->createMany([
        //     [
        //         'name' => 'Manuel U. Neri',
        //         'email' => 'manuel@email.com',
        //         'office_id' => Office::factory()->createMany([
        //             [
        //                 'name' => "Admin",
        //                 'description' => "City Administrator"
        //             ]
        //         ])
        //     ],
        // ]);

    }
}
