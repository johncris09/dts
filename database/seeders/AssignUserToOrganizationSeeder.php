<?php

namespace Database\Seeders;

use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AssignUserToOrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('name', 'Administrator')->first();
        $receiverRole = Role::where('name', 'Receiver')->first();
        $staffRole = Role::where('name', 'Staff')->first();

        // Fetch all organizational units
        $units = OrganizationalUnit::with('parent')->get();

        foreach ($units as $unit) {
            $level = $this->getUnitLevel($unit);

            // Administrator - assign primarily to Level 1
            if ($level === 0) {
                $user = User::create([
                    'name' => "Admin for {$unit->name}",
                    'email' => "admin_{$unit->id}@example.com",
                    'password' => Hash::make('password'),
                    'organizational_unit_id' => $unit->id,
                ]);
                $user->assignRole([$adminRole, $receiverRole]);

                $receiver = User::create([
                    'name' => "Receiver for {$unit->name}",
                    'email' => "receiver_{$unit->id}@example.com",
                    'password' => Hash::make('password'),
                    'organizational_unit_id' => $unit->id,
                ]);
                $receiver->assignRole($receiverRole);
            }

            // Staff - only for Level 2 or deeper
            if ($level > 0) {
                $staff = User::create([
                    'name' => "Staff for {$unit->name}",
                    'email' => "staff_{$unit->id}@example.com",
                    'password' => Hash::make('password'),
                    'organizational_unit_id' => $unit->id,
                ]);
                $staff->assignRole($staffRole);
            }
        }
    }

    private function getUnitLevel($unit): int
    {
        $level = 0;
        $current = $unit;

        while ($current->parent) {
            $current = $current->parent;
            $level++;
        }

        return $level;
    }
}
