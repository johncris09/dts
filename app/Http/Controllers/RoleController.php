<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleResource;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Database\QueryException;
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
            'roles' => RoleResource::collection($roles),
            'permissions' => Permission::pluck('name'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort(404, 'This page does not exist.');

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
        abort(404, 'This page does not exist.');

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {

        abort(404, 'This page does not exist.');

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
        Gate::authorize('delete roles');

        try {
            $role->delete();

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role deleted successfully!');
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {

                return redirect()
                    ->route('roles.index')
                    ->with('error', 'Cannot delete this office because it is associated with other records.');
            }


            return redirect()
                ->route('roles.index')
                ->with('error', 'An unexpected error occurred!');
        }
    }
}
