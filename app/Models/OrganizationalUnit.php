<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class OrganizationalUnit extends Model
{
    /** @use HasFactory<\Database\Factories\OrganizationalUnitFactory> */

    use HasFactory, HasRoles;

    protected $fillable = [
        'name',
        'parent_id',
        'description',
    ];

    /**
     * Get the parent organizational unit.
     */
    public function parent()
    {
        // A unit can belong to another unit (its parent)
        return $this->belongsTo(OrganizationalUnit::class, 'parent_id');
    }

    /**
     * Get the child organizational units.
     */
    public function children()
    {
        // A unit can have many children units
        return $this->hasMany(OrganizationalUnit::class, 'parent_id');
    }

    /**
     * Get the users associated with this organizational unit.
     */
    public function users()
    {
        // An organizational unit can have many users directly assigned to it.
        return $this->hasMany(User::class, 'organizational_unit_id');
    }

    /**
     * Get the documents associated with this organizational unit.
     */
    public function documents()
    {
        // An organizational unit can have many documents assigned to it.
        return $this->hasMany(Document::class, 'organizational_unit_id');
    }


    /**
     * Get the full hierarchy path (from top-most parent down to this unit).
     *
     * @return \Illuminate\Support\Collection
     */
    public function getHierarchyPath()
    {
        $path = collect([$this]);
        $current = $this;
        while ($current->parent) {
            $path->prepend($current->parent);
            $current = $current->parent;
        }
        return $path;
    }

    /**
     * Get all ancestor organizational units (excluding self).
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAncestors()
    {
        $ancestors = collect();
        $current = $this;
        while ($current->parent) {
            $ancestors->push($current->parent);
            $current = $current->parent;
        }
        return $ancestors->reverse(); // Return in order from top-most ancestor to immediate parent
    }

    /**
     * Get all descendant organizational units recursively (excluding self).
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAllDescendants()
    {
        $descendants = collect();
        foreach ($this->children as $child) {
            $descendants->push($child);
            $descendants = $descendants->concat($child->getAllDescendants());
        }
        return $descendants;
    }

    /**
     * Get all organizational units in this unit's "management cone" (self, all ancestors, all descendants).
     * This is useful for determining the scope of units a user can manage.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getManagementCone()
    {
        $cone = collect([$this]); // Include self
        $cone = $cone->concat($this->getAncestors()); // Add all ancestors
        $cone = $cone->concat($this->getAllDescendants()); // Add all descendants
        return $cone->unique('id'); // Ensure unique units
    }
}
