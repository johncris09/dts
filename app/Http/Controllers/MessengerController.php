<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OrganizationalUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class MessengerUserController extends Controller
{
    /**
     * Display a listing of messenger users.
     */
    public function index(Request $request)
    {
        Gate::authorize('view messengers');

        $users = User::with('organizationalUnit')
            ->role('messenger')
            ->orderBy('id', 'desc')
            ->get();

        $parentUnits = OrganizationalUnit::orderBy('name')->get()
            ->transform(function ($unit) {
                $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
                return $unit;
            });

        return Inertia::render('messengers/index', [
            'users' => $users,
            'parentUnits' => $parentUnits,
        ]);
    }
    public function create()
    {
        abort(404, 'This page does not exist.');

    }

    /**
     * Store a newly created messenger user.
     */
    public function store(Request $request)
    {
        Gate::authorize('create messengers');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'organizational_unit_id' => 'required|exists:organizational_units,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(str_replace(' ', '.', $validated['name'])) . '@example.com',
            'password' => Hash::make('password'), // default password
            'organizational_unit_id' => $validated['organizational_unit_id'],
        ]);

        $user->assignRole('messenger');

        return redirect()->route('messengers.index')
            ->with('success', 'Messenger user created successfully!');
    }
    public function show(User $messenger)
    {
        abort(404, 'This page does not exist.');

    }
     public function edit(User $messenger)
    {

        abort(404, 'This page does not exist.');

    }

    /**
     * Update the specified messenger user.
     */
    public function update(Request $request, User $messenger)
    {
        Gate::authorize('edit messengers');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'organizational_unit_id' => 'required|exists:organizational_units,id',
        ]);

        $messenger->update($validated);

        return redirect()->route('messengers.index')
            ->with('success', 'Messenger user updated successfully!');
    }

    /**
     * Remove the specified messenger user.
     */
    public function destroy(User $messenger)
    {
        Gate::authorize('delete messengers');

        try {
            $messenger->delete();

            return redirect()->route('messengers.index')
                ->with('success', 'Messenger user deleted successfully!');
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return redirect()->route('messengers.index')
                    ->with('error', 'Cannot delete this messenger. It is associated with other records.');
            }

            return redirect()->route('messengers.index')
                ->with('error', 'An unexpected error occurred!');
        }
    }
}
