<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrganizationalUnitResource;
use App\Models\OrganizationalUnit;
use App\Http\Requests\StoreOrganizationalUnitRequest;
use App\Http\Requests\UpdateOrganizationalUnitRequest;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OrganizationalUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $search = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default to 10 if not specified



        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {
            $organizationalUnits = OrganizationalUnit::with('parent')->orderBy(column: 'name')->paginate($perPage);

            $organizationalUnits->getCollection()->transform(function ($unit) {
                $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
                return $unit;
            });
        } elseif ($user->hasRole(['Administrator', 'Receiver'])) {

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
                    ->orderBy(column: 'name')
                    ->paginate($perPage);

                $organizationalUnits->getCollection()->transform(function ($unit) {
                    $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
                    return $unit;
                });
            }
        } else {
            // Other roles see nothing or handle as needed
            $organizationalUnits = collect([]);
        }
        
        $organizationalUnitsForSelect = collect([]);
        
        if ($user->hasRole('Super Admin')) { // If the logged-in user has the 'Super Admin' role Load ALL organizational units (with their parent relationship) sorted by name
            $organizationalUnitsForSelect = OrganizationalUnit::with('parent')
                ->orderBy('name')
                ->get();
        } elseif ($user->hasRole(['Administrator', 'Receiver'])) { // If the user is an Administrator or Receiver Get the user's assigned organizational unit (based on a foreign key relationship)
            $unit = $user->organizationalUnit;

            if ($unit) {
                $unitIds = $this->getUnitAndDescendants($unit); // Recursively collect this unit and all of its descendants (children, grandchildren, etc.)
                $organizationalUnitsForSelect = OrganizationalUnit::with('parent')  // Fetch only the organizational units that the user is allowed to see (theirs and descendants)
                    ->whereIn('id', $unitIds)
                    ->orderBy('name')
                    ->get();
            }
        }

        // After fetching the list, transform each unit to include a `hierarchy_path`
        // This makes the unit’s full path like “Office > Division > Sub-Division > etc.” displayable in dropdowns
        $organizationalUnitsForSelect->transform(function ($unit) {
            $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
            return $unit;
        });

        return Inertia::render('organizational_units/index', [
            'organizationalUnits' => OrganizationalUnitResource::collection($organizationalUnits),
            'parentUnits' => OrganizationalUnitResource::collection($organizationalUnitsForSelect),
            'filters' => [
                'search' => $search,
                'per_page' => $perPage
            ]
        ]);

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
        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {
            $organizationalUnits = OrganizationalUnit::with('parent')->orderBy('name')->get();

            $organizationalUnits->transform(function ($unit) {
                $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
                return $unit;
            });
        } elseif ($user->hasRole(['Administrator', 'Receiver'])) {

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
            'organizational_units/create',
            [
                'parentUnits' => $organizationalUnits
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrganizationalUnitRequest $request)
    {
        OrganizationalUnit::create($request->validated());

        return redirect()->route('organizational_units.index')
            ->with('success', 'User created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(OrganizationalUnit $organizationalUnit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OrganizationalUnit $organizationalUnit)
    {


        $user = auth()->user();

        if ($user->hasRole('Super Admin')) {


            $organizationalUnits = OrganizationalUnit::with('parent')->orderBy('name')->get();

            $organizationalUnits->transform(function ($unit) {
                $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
                return $unit;
            });
        } elseif ($user->hasRole(['Administrator', 'Receiver'])) {

            // Get their assigned unit
            $unit = $user->organizationalUnit;

            if (!$unit) {
                // If they don't belong to a unit, return empty result
                $organizationalUnits = collect([]);
            } else {
                // Get their unit + all child units
                $unitIds = $this->getUnitAndDescendants($unit);

                if (!in_array($organizationalUnit->id, $unitIds->toArray())) {
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
            // Other roles see nothing or handle as needed
            $organizationalUnits = collect([]);
        }

        return Inertia::render(
            'organizational_units/edit',
            [
                'organizationalUnit' => $organizationalUnit,
                'parentUnits' => $organizationalUnits
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrganizationalUnitRequest $request, OrganizationalUnit $organizationalUnit)
    {

        $organizationalUnit->update($request->validated());

        // Return a success response with a redirect
        return redirect()->route('organizational_units.index')
            ->with('success', 'Organizational Unit updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrganizationalUnit $organizationalUnit)
    {

        try {
            $organizationalUnit->delete();

            return redirect()
                ->route('organizational_units.index')
                ->with('success', 'Organizational Unit deleted successfully!');
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {

                return redirect()
                    ->route('organizational_units.index')
                    ->with('error', 'Cannot delete this Organizational Unit because it is associated with other records.');
            }


            return redirect()
                ->route('organizational_units.index')
                ->with('error', 'An unexpected error occurred!');
        }
    }
}
