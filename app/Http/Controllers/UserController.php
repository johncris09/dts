<?php

namespace App\Http\Controllers;

use App\Models\OrganizationalUnit;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Division;
use App\Models\Office;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {


        Gate::authorize('view users');


        $user = auth()->user();


        $search = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default to 10 if not specified

        $roles = Role::all();

        if ($user->hasRole('Super Admin')) {

            $users = User::with(['roles', 'organizationalUnit'])
                ->latest()
                ->when($search, function ($query, $search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->paginate($perPage);

            $users->getCollection()->transform(function ($user) {
                if ($user->organizationalUnit) {
                    $user->organizationalUnit->hierarchy_path = $user->organizationalUnit
                        ->getHierarchyPath()
                        ->pluck('name')
                        ->implode(' > ');
                }
                return $user;
            });
        } elseif ($user->hasRole(['Administrator', 'Receiver'])) {
            $unit = $user->organizationalUnit;

            if (!$unit) {
                $users = collect([]);
            } else {
                $unitIds = $this->getUnitAndDescendants($unit);

                $users = User::with(['roles', 'organizationalUnit'])
                    ->whereIn('organizational_unit_id', $unitIds)
                    ->latest()
                    ->when($search, function ($query, $search) {
                        $query->where(function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                    })
                    ->paginate($perPage);
            }

        } else {
            // Other roles see nothing or handle as needed
            $users = collect([]);
        }

        return Inertia::render(
            'users/index',
            [
                'users' => UserResource::collection($users),
                'roles' => $roles,
                'filters' => [
                    'search' => $search,
                    'per_page' => $perPage
                ]
            ]
        );
    }

    private function getUnitAndDescendants($unit)
    {
        $ids = collect([$unit->id]);

        foreach ($unit->children as $child) {
            $ids = $ids->merge($this->getUnitAndDescendants($child));
        }

        return $ids;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        Gate::authorize('create users');

        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {

            $roles = Role::pluck('name');

            $organizationalUnits = OrganizationalUnit::with('parent')->orderBy('name')->get();

            $organizationalUnits->transform(function ($unit) {
                $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
                return $unit;
            });
        } elseif ($user->hasRole(['Administrator', 'Receiver'])) {
            $roles = Role::where('name', '!=', 'Super Admin')->pluck('name');

            // Get their assigned unit
            $unit = $user->organizationalUnit;

            if (!$unit) {
                // If they don't belong to a unit, return empty result
                $organizationalUnits = collect([]);
            } else {
                // Get their unit + all child units
                $unitIds = $this->getUnitAndDescendants($unit);


                $organizationalUnits = OrganizationalUnit::with('parent')
                    ->whereIn('id', $unitIds)
                    ->orderBy('name')
                    ->get();

                $organizationalUnits->transform(function ($unit) {
                    $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
                    return $unit;
                });
            }
        } else {
            // Other roles see nothing or handle as needed
            $organizationalUnits = collect([]);
        }

        return Inertia::render(
            'users/create',
            [
                'roles' => $roles,
                'organizationalUnits' => $this->buildHierarchy($organizationalUnits),
            ]
        );
    }


    private function buildHierarchy($units, $parentId = null, $level = 0)
    {
        $hierarchy = collect();

        foreach ($units->where('parent_id', $parentId)->sortBy('name') as $unit) {
            $unit->level = $level;
            $hierarchy->push($unit);
            $children = $this->buildHierarchy($units, $unit->id, $level + 1);
            $hierarchy = $hierarchy->merge($children);
        }

        return $hierarchy;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {


        Gate::authorize('create users');
        $user = User::create($request->validated());

        // assign role
        $user->assignRole($request->roles);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {

        Gate::authorize('edit users');

        $userAuth = auth()->user();

        $user->load(['roles']);
        if ($userAuth->hasRole('Super Admin')) {
            $roles = Role::pluck('name');


            $organizationalUnits = OrganizationalUnit::with('parent')->orderBy('name')->get();

            $organizationalUnits->transform(function ($unit) {
                $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
                return $unit;
            });
        } elseif ($userAuth->hasRole(['Administrator', 'Receiver'])) {
            $roles = Role::where('name', '!=', 'Super Admin')->pluck('name');


            // // Get their assigned unit
            $unit = $userAuth->organizationalUnit;

            if (!$unit) {
                // If they don't belong to a unit, return empty result
                $organizationalUnits = collect([]);
            } else {
                // Get their unit + all child units
                $unitIds = $this->getUnitAndDescendants($unit);

                if (!in_array($user->organizational_unit_id, $unitIds->toArray())) {
                    abort(403, 'Unauthorized access.');
                }

                $organizationalUnits = OrganizationalUnit::with('parent')
                    ->whereIn('id', $unitIds)
                    ->orderBy('name')
                    ->get();

                $organizationalUnits->transform(function ($unit) {
                    $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
                    return $unit;
                });
            }

        } else {

            $organizationalUnits = collect([]);
        }





        return Inertia::render(
            'users/edit',
            [
                'roles' => $roles,
                'user' => $user,
                'organizationalUnits' => $this->buildHierarchy($organizationalUnits),
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {

        Gate::authorize('edit users');
        $user->update($request->validated());
        // Sync the user's roles
        $user->syncRoles($request->roles);

        // Return a success response with a redirect
        return redirect()->route('users.index')
            ->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {

        Gate::authorize('delete users');


        try {
            $user->delete();

            return redirect()
                ->route('users.index')
                ->with('success', 'User deleted successfully!');
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {

                return redirect()
                    ->route('users.index')
                    ->with('error', 'Cannot delete this User because it is associated with other records.');
            }


            return redirect()
                ->route('users.index')
                ->with('error', 'An unexpected error occurred!');
        }
    }
}
