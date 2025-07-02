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


        $authUser = auth()->user();


        $search = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default to 10 if not specified
        $roles = Role::all();


        // if ($authUser->hasRole('Super Admin')) {

        //     $users = User::with('roles')
        //         ->when($search, function ($query, $search) {
        //             $query->where(function ($query) use ($search) {
        //                 $query->where('name', 'like', "%{$search}%")
        //                     ->orWhere('email', 'like', "%{$search}%");
        //             });
        //         })
        //         ->paginate($perPage);
        // } else if ($authUser->hasRole('Administrator')) {
        //     $users = User::with('roles')
        //         ->when($search, function ($query, $search) {
        //             $query->where(function ($query) use ($search) {
        //                 $query->where('name', 'like', "%{$search}%")
        //                     ->orWhere('email', 'like', "%{$search}%");
        //             });
        //         })
        //         ->paginate($perPage);
        // }
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        Gate::authorize('create users');

        $authUser = auth()->user();
        $query = OrganizationalUnit::query();
        $user = Auth::user();

        $organizationalUnits = OrganizationalUnit::with('parent')->orderBy('name')->get();

        $organizationalUnits->transform(function ($unit) {
            $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
            return $unit;
        });

        if ($authUser->hasRole('Super Admin')) {

            $roles = Role::pluck('name');
        } else if ($authUser->hasRole('Administrator')) {
            $roles = Role::where('name', '!=', 'Super Admin')->pluck('name');
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


        $authUser = auth()->user();

        $user->load('roles');
        $organizationalUnits = OrganizationalUnit::with('parent')->orderBy('name')->get();

        $organizationalUnits->transform(function ($unit) {
            $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
            return $unit;
        });

        if ($authUser->hasRole('Super Admin')) {
            $roles = Role::pluck('name');
        } else if ($authUser->hasRole('Administrator')) {
            // Administrator can edit users under the same office (optional: same division)
            // if ($authUser->office_id !== $user->office_id) {
            //     abort(403, 'Unauthorized to edit this user.');
            // }
            $roles = Role::where('name', '!=', 'Super Admin')->pluck('name');
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
