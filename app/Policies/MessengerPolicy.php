<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class MessengerPolicy
{
        public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view messengers');
    }

    public function view(User $user, User $target): bool
    {
        return $user->hasPermissionTo('view messengers');
    }

    public function delete(User $user, User $target): bool
    {
        return $user->hasPermissionTo('delete messengers');
    }
}
