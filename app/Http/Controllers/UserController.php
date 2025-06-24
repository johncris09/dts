<?php

namespace App\Http\Controllers;

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


        if ($authUser->hasRole('Super Admin')) {

            $users = User::with('roles', 'office.division')
                ->when($search, function ($query, $search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->paginate($perPage);
        } else if ($authUser->hasRole('Administrator')) {
            // Show users in the same office (and optionally same division)
            $users = User::with('roles', 'office.division')
                ->where('office_id', $authUser->office_id)
                ->when($search, function ($query, $search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->paginate($perPage);
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        Gate::authorize('create users');

        $authUser = auth()->user();

        if ($authUser->hasRole('Super Admin')) {
            $roles = Role::pluck('name');
        } else if ($authUser->hasRole('Administrator')) {
            $roles = Role::where('name', '!=', 'Super Admin')->pluck('name');
        }

        $offices = Office::with(['division'])->orderBy('name')->get();
        $divisions = Division::with(['office'])->orderBy('name')->get();

        return Inertia::render(
            'users/create',
            [
                'roles' => $roles,
                'offices' => $offices,
                'divisions' => $divisions,
            ]
        );
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
        $offices = Office::with(['division'])->orderBy('name')->get();
        $divisions = Division::with(['office'])->orderBy('name')->get();


        if ($authUser->hasRole('Super Admin')) {
            $roles = Role::pluck('name');
        } else if ($authUser->hasRole('Administrator')) {
            // Administrator can edit users under the same office (optional: same division)
            if ($authUser->office_id !== $user->office_id) {
                abort(403, 'Unauthorized to edit this user.');
            }
            $roles = Role::where('name', '!=', 'Super Admin')->pluck('name');
        }
        return Inertia::render(
            'users/edit',
            [
                'roles' => $roles,
                'user' => $user,
                'offices' => $offices,
                'divisions' => $divisions,
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
    public function destroy(string $id)
    {

        Gate::authorize('delete users');
        //
    }
}
