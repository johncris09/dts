<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Gate;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('view permissions');

        $perPage = $request->input('per_page', 10); // Default to 10 if not specified

        $permissions = Permission::orderBy('id', 'desc')
            ->paginate($perPage);

        return Inertia::render('permissions/index', [
            'permissions' => PermissionResource::collection($permissions)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create permissions');

        return Inertia::render('permissions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermissionRequest $request)
    {

        Gate::authorize('create permissions');

        Permission::create($request->validated());

        return redirect()->route('permissions.index')
            ->with('success', 'Permission created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        Gate::authorize('edit permissions');

        return Inertia::render('permissions/edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission)
    {

        Gate::authorize('edit permissions');

        $permission->update($request->validated());


        return redirect()
            ->route('permissions.index')
            ->with('success', 'Permission updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {

        Gate::authorize('delete permissions');

        try {
            $permission->delete();

            return redirect()
                ->route('permissions.index')
                ->with('success', 'Permissions deleted successfully!');
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {

                return redirect()
                    ->route('permissions.index')
                    ->with('error', 'Cannot delete this office because it is associated with other records.');
            }


            return redirect()
                ->route('permissions.index')
                ->with('error', 'An unexpected error occurred!');
        }
    }
}
