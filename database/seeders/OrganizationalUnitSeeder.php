<?php

namespace Database\Seeders;

use App\Models\OrganizationalUnit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrganizationalUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $topLevelCount = 3; // How many top-level units (offices)
        $divisionsPerOffice = [2, 5]; // Random between 2 to 5 divisions per office
        $subDivisionsPerDivision = [0, 3]; // Random between 0 to 3 sub-divisions

        for ($i = 1; $i <= $topLevelCount; $i++) {
            $office = OrganizationalUnit::create([
                'name' => "Office " . chr(64 + $i), // Office A, Office B, etc.
                'description' => fake()->sentence(),
            ]);

            $divisionsCount = rand($divisionsPerOffice[0], $divisionsPerOffice[1]);

            for ($j = 1; $j <= $divisionsCount; $j++) {
                $division = OrganizationalUnit::create([
                    'name' => "Division " . chr(64 + $i) . $j,
                    'parent_id' => $office->id,
                    'description' => fake()->sentence(),
                ]);

                $subDivisionsCount = rand($subDivisionsPerDivision[0], $subDivisionsPerDivision[1]);

                for ($k = 1; $k <= $subDivisionsCount; $k++) {
                    OrganizationalUnit::create([
                        'name' => "Sub-Division " . chr(64 + $i) . $j . chr(64 + $k),
                        'parent_id' => $division->id,
                        'description' => fake()->sentence(),
                    ]);
                }
            }
        }
    }
}
