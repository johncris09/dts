<?php

namespace Database\Seeders;

use App\Models\OrganizationalUnit;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            OrganizationalUnitSeeder::class,
            UserSeeder::class,
            RoleSeeder::class,
            PermissionSeeder::class,
            AddRoleToUserSeeder::class,
            AddPermissionsToRole::class,
            AssignUserToOrganizationSeeder::class,
        ]);
    }
}
