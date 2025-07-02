<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'organizational_unit_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
        ];
    }



    /**
     * Get the organizational unit that owns the User.
     * A user is linked to the lowest unit they directly belong to.
     */
    public function organizationalUnit()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'organizational_unit_id');
    }
    public function hasEffectivePermission($permission): bool
    {
        // 1. Check direct user permissions/roles first (Spatie's default behavior)
        if ($this->hasPermissionTo($permission) || $this->hasRole($permission)) {
            return true;
        }

        // 2. Check permissions inherited from organizational units
        // If the user is assigned to an organizational unit
        if ($this->organizationalUnit) {
            $currentUnit = $this->organizationalUnit;
            do {
                // Check if the current organizational unit (or any roles assigned to it)
                // has the permission.
                if ($currentUnit->hasPermissionTo($permission) || $currentUnit->hasRole($permission)) {
                    return true;
                }
                // Move up to the parent unit in the hierarchy
                $currentUnit = $currentUnit->parent;
            } while ($currentUnit); // Continue until the top-level parent (parent_id is null)
        }

        return false;
    }
}
