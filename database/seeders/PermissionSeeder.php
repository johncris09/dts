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
            'view document histories',
            'view dashboard',
            'view documents',
            'create documents',
            'edit documents',
            'delete documents',
            'view document types',
            'create document types',
            'edit document types',
            'delete document types',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view organizational units',
            'create organizational units',
            'edit organizational units',
            'delete organizational units',
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'view messengers',
            'delete messengers',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']); // changed to firstOrCreate
        }
    }
}
