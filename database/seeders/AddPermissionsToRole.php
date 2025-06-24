<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AddPermissionsToRole extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $role = Role::where('name', 'Super Admin')->first();

        if ($role) {
            $permissions = Permission::pluck('name')->toArray();
            $role->syncPermissions($permissions);
        }
    }
}
