<?php

namespace App\Http\Controllers;

use App\Http\Resources\DocumentTypeControllerResource;
use App\Http\Resources\DocumentTypeResource;
use App\Models\DocumentType;
use App\Http\Requests\StoreDocumentTypeRequest;
use App\Http\Requests\UpdateDocumentTypeRequest;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class DocumentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        Gate::authorize('view document types');

        $perPage = $request->input('per_page', 10); // Default to 10 if not specified

        $document_types = DocumentType::orderBy('name')
            ->paginate($perPage);

        return Inertia::render('document_types/index', [
            'document_types' => DocumentTypeResource::collection($document_types)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort(404, 'This page does not exist.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentTypeRequest $request)
    {
        Gate::authorize('create document types');

        DocumentType::create($request->validated());

        return redirect()->route('document_types.index')
            ->with('success', 'Document Type created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(DocumentType $documentType)
    {
        abort(404, 'This page does not exist.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentType $documentType)
    {
        abort(404, 'This page does not exist.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentTypeRequest $request, DocumentType $documentType)
    {
        Gate::authorize('edit document types');

        $documentType->update($request->validated());

        return redirect()
            ->route('document_types.index')
            ->with('success', 'Document Type updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentType $documentType)
    {
        Gate::authorize('delete document types');

        try {
            $documentType->delete();

            return redirect()
                ->route('document_types.index')
                ->with('success', 'Document Type deleted successfully!');
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {

                return redirect()
                    ->route('document_types.index')
                    ->with('error', 'Cannot delete this Document Type because it is associated with other records.');
            }


            return redirect()
                ->route('document_types.index')
                ->with('error', 'An unexpected error occurred!');
        }
    }
}
