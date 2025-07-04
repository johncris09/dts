<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\QueryException;
use Inertia\Inertia;

class MessengerUserController extends Controller
{
    /**
     * Display a listing of messenger users.
     */
    public function index()
    {
        Gate::authorize('view messengers');

        $messengerUsers = User::role('Messenger')
            ->with('organizationalUnit') // eager load unit
            ->get();

        // Transform each messenger to include top-level unit name only
        $messengerUsers->transform(function ($user) {
            if ($user->organizationalUnit) {
                $user->organizationalUnit->hierarchy_path = $user->organizationalUnit
                    ->getHierarchyPath()
                    ->pluck('name')
                    ->first(); // only top-most unit/Parent
            }
            return $user;
        });

        return Inertia::render('messenger_users/index', [
            'messengerUsers' => $messengerUsers,
        ]);
    }

    /**
     * Show the form for creating a new messenger.
     */
    public function create()
    {
        abort(404, 'This page does not exist.');
    }

    /**
     * Store a newly created messenger in storage.
     */
    public function store(Request $request)
    {
        abort(404, 'This page does not exist.');
    }

    /**
     * Display the specified messenger user.
     */
    public function show(User $messenger_user)
    {
        Gate::authorize('view messengers');

        if (!$messenger_user->hasRole('Messenger')) {
            abort(404, 'User is not a messenger.');
        }

        // Load the organizational unit relationship
        $messenger_user->load('organizationalUnit');

        // Set only the top-most unit name (not full hierarchy)
        if ($messenger_user->organizationalUnit) {
            $messenger_user->organizationalUnit->hierarchy_path = $messenger_user
                ->organizationalUnit
                ->getHierarchyPath()
                ->pluck('name')
                ->first();
        }

        return Inertia::render('messenger_users/show', [
            'messengerUser' => $messenger_user,
        ]);
    }

    /**
     * Show the form for editing the specified messenger user.
     */
    public function edit(User $messenger_user)
    {
        abort(404, 'This page does not exist.');
    }

    /**
     * Update the specified messenger user in storage.
     */
    public function update(Request $request, User $messenger_user)
    {
        abort(404, 'This page does not exist.');
    }

    /**
     * Remove the specified messenger user from storage.
     */
    public function destroy(User $messenger_user)
    {
        Gate::authorize('delete messengers');

        if (!$messenger_user->hasRole('Messenger')) {
            abort(404, 'User is not a messenger.');
        }

        try {
            $messenger_user->delete();

            return redirect()->route('messenger_users.index')
                ->with('success', 'Messenger user deleted successfully!');
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return redirect()->route('messenger_users.index')
                    ->with('error', 'Cannot delete this messenger. It is associated with other records.');
            }

            return redirect()->route('messenger_users.index')
                ->with('error', 'An unexpected error occurred!');
        }
    }
}
