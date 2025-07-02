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
        // $user = Auth::user('organizationalUnit');
        $organizationalUnits = OrganizationalUnit::with('parent')->orderBy(column: 'name')->paginate($perPage);

        $organizationalUnits->getCollection()->transform(function ($unit) {
            $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
            return $unit;
        });

        return Inertia::render('organizational_units/index', [
            'organizationalUnits' => OrganizationalUnitResource::collection($organizationalUnits),
            'filters' => [
                'search' => $search,
                'per_page' => $perPage
            ]
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $organizationalUnits = OrganizationalUnit::with('parent')->orderBy('name')->get();

        $organizationalUnits->transform(function ($unit) {
            $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
            return $unit;
        });
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
        $organizationalUnits = OrganizationalUnit::with('parent')->orderBy('name')->get();

        $organizationalUnits->transform(function ($unit) {
            $unit->hierarchy_path = $unit->getHierarchyPath()->pluck('name')->implode(' > ');
            return $unit;
        });
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
