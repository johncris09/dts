<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'view offices',
            'create offices',
            'edit offices',
            'delete offices',
            'view divisions',
            'create divisions',
            'edit divisions',
            'delete divisions',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view divisions',
            'create divisions',
            'edit divisions',
            'delete divisions',
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']); // changed to firstOrCreate
        }
    }
}
