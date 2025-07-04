<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class MessengerPolicy
{
    /**
     * Determine whether the user can view any messenger users.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view messengers');
    }

    /**
     * Determine whether the user can view a specific messenger user.
     */
    public function view(User $user, User $target): bool
    {
        return $user->hasPermissionTo('view messengers') && $target->hasRole('messenger');
    }

    /**
     * Determine whether the user can create messenger users.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create messengers');
    }

    /**
     * Determine whether the user can update a specific messenger user.
     */
    public function update(User $user, User $target): bool
    {
        return $user->hasPermissionTo('edit messengers') && $target->hasRole('messenger');
    }

    /**
     * Determine whether the user can delete a specific messenger user.
     */
    public function delete(User $user, User $target): bool
    {
        return $user->hasPermissionTo('delete messengers') && $target->hasRole('messenger');
    }
}
