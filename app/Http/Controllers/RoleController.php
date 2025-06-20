<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleResource;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Gate;


class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {


        Gate::authorize('view roles');

        $perPage = $request->input('per_page', 10); // Default to 10 if not specified


        $roles = Role::with('permissions')
            ->orderBy('id', 'desc')
            ->paginate($perPage);
        return Inertia::render('roles/index', [
            'roles' => RoleResource::collection($roles)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        Gate::authorize('create roles');
        $permissions = Permission::pluck('name');

        return Inertia::render('roles/create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {

        Gate::authorize('create roles');
        $role = Role::create($request->validated());

        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {

        Gate::authorize('edit roles');

        $permissions = Permission::pluck('name');
        $role->load('permissions');
        return Inertia::render('roles/edit', [
            'permissions' => $permissions,
            'role' => $role,

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {

        Gate::authorize('edit roles');
        $role->update($request->validated());

        $role->syncPermissions($request->permissions);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role updated successfully!');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        //

        Gate::authorize('delete roles');
    }
}
