<?php

namespace App\Http\Controllers;

use App\Http\Resources\DivisionResource;
use App\Models\Division;
use App\Http\Requests\StoreDivisionRequest;
use App\Http\Requests\UpdateDivisionRequest;
use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        Gate::authorize('view divisions');

        $authUser = auth()->user();

        $search = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default to 10 if not specified

        $divisions = Division::with(['office'])->orderBy('name')->paginate(10);


        if ($authUser->hasRole('Super Admin')) {


            $divisions = Division::with(['office'])
                ->orderBy('name')
                ->paginate(10);

        } else if ($authUser->hasRole('Administrator')) {

            $divisions = Division::with(['office'])
                ->where('office_id', $authUser->office_id)
                ->orderBy('name')
                ->paginate(10);

        }
        return Inertia::render(
            'divisions/index',
            [
                'divisions' => DivisionResource::collection($divisions),
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


        Gate::authorize('create divisions');

        return Inertia::render(
            'divisions/create',
            [
                'offices' => Office::orderBy('name')->get()
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDivisionRequest $request)
    {

        Gate::authorize('create divisions');

        Division::create($request->validated());

        return redirect()->route('divisions.index')
            ->with('success', 'Division created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Division $division)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Division $division)
    {

        Gate::authorize('edit divisions');

        $authUser = auth()->user();
        // return response()->json($authUser);


        if ($authUser->hasRole('Super Admin')) {
            $division->load(['office']);
        } else if ($authUser->hasRole('Administrator')) {
            // Administrator can edit users under the same office (optional: same division)
            if ($authUser->office_id !== $division->office_id) {
                abort(403, 'Unauthorized to edit this user.');
            }

            $division->load(['office'])
                ->where('office_id', $authUser->office_id)
                ->get();
        }


        return Inertia::render(
            'divisions/edit',
            [
                'division' => $division,
                'offices' => Office::orderBy('name')->get()
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDivisionRequest $request, Division $division)
    {
        Gate::authorize('edit divisions');

        $division->update($request->validated());

        // Return a success response with a redirect
        return redirect()->route('divisions.index')
            ->with('success', 'Division updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Division $division)
    {
        Gate::authorize('delete divisions');

        $division->delete();

        return redirect()
            ->route('divisions.index')
            ->with('success', 'Office deleted successfully!');
    }
}
