<?php

namespace App\Http\Controllers;

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

        $search = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default to 10 if not specified

        $roles = Role::all(); //->pluck(value: 'name');

        $users = User::with('roles', 'office.division')
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->paginate($perPage);
        // return response()->json($users);
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
        $offices = Office::with(['division'])->orderBy('name')->get();
        $divisions = Division::with(['office'])->orderBy('name')->get();

        return Inertia::render(
            'users/create',
            [
                'roles' => Role::pluck('name'),
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
        $user->load('roles');

        $offices = Office::with(['division'])->orderBy('name')->get();
        $divisions = Division::with(['office'])->orderBy('name')->get();

        $roles = Role::pluck('name');
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
        //
    }
}
