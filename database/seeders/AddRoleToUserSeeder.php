<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AddRoleToUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::find(1); // change number 1 to ID of account you want to give permissions
        $role = Role::where('name', 'Super Admin')->first();
        $user->assignRole($role);
        $role->syncPermissions(Permission::all());

        $user->getAllPermissions()->pluck('name');

        //should output Illuminate\Support\Collection {#... all: ["view divisions", "create divisions", "edit divisions", ...] }
    }
}
