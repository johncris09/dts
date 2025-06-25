<?php

namespace App\Http\Controllers;

use App\Http\Resources\OfficeResource;
use App\Models\Office;
use App\Http\Requests\StoreOfficeRequest;
use App\Http\Requests\UpdateOfficeRequest;
use Illuminate\Database\QueryException;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OfficeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        Gate::authorize('view offices');

        $search = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default to 10 if not specified

        $offices = Office::orderBy('name')->paginate(10);
        return Inertia::render(
            'offices/index',
            [
                'offices' => OfficeResource::collection($offices),
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

        Gate::authorize('create offices');

        return Inertia::render(
            'offices/create',
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOfficeRequest $request)
    {

        Gate::authorize('create offices');

        Office::create($request->validated());

        return redirect()->route('offices.index')
            ->with('success', 'Office created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Office $office)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Office $office)
    {

        Gate::authorize('edit offices');

        return Inertia::render(
            'offices/edit',
            [
                'office' => $office,
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOfficeRequest $request, Office $office)
    {

        Gate::authorize('edit offices');

        $office->update($request->validated());

        // Return a success response with a redirect
        return redirect()->route('offices.index')
            ->with('success', 'Office updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Office $office)
    {


        Gate::authorize('delete offices');

        try {
            $office->delete();

            return redirect()
                ->route('offices.index')
                ->with('success', 'Office deleted successfully!');
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {

                return redirect()
                    ->route('offices.index')
                    ->with('error', 'Cannot delete this office because it is associated with other records.');
            }


            return redirect()
                ->route('offices.index')
                ->with('error', 'An unexpected error occurred!');
        }

    }
}
