<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Document extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentFactory> */
    use HasFactory;

    protected $fillable = [
        'qr_code_id',
        'title',
        'document_type',
        'category',
        'originator_name',
        'originator_contact',
        'internal_origin_office_id',
        'internal_origin_division_id',
        'external_origin_entity',
        'current_office_id',
        'current_division_id',
        'current_user_id',
        'status',
        'date_received',
        'due_date',
        'remarks',
        'file_path',
        'created_by_user_id',
    ];

    protected $casts = [
        'date_received' => 'datetime',
        'due_date' => 'datetime',
    ];

    // Generate QR code ID before creating
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($document) {
            $document->qr_code_id = (string) Str::uuid(); // Use UUID for unique QR ID
        });
    }

    // Relationships
    public function internalOriginOffice()
    {
        return $this->belongsTo(Office::class, 'internal_origin_office_id');
    }

    public function internalOriginDivision()
    {
        return $this->belongsTo(Office::class, 'internal_origin_division_id');
    }

    public function currentOffice()
    {
        return $this->belongsTo(Office::class, 'current_office_id');
    }

    public function currentDivision()
    {
        return $this->belongsTo(Office::class, 'current_division_id');
    }

    public function currentUser()
    {
        return $this->belongsTo(User::class, 'current_user_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    // public function histories()
    // {
    //     return $this->hasMany(DocumentHistory::class)->orderBy('created_at', 'asc');
    // }
    /**
     * Get the organizational unit this document belongs to.
     */
    public function organizationalUnit()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'organizational_unit_id');
    }
}
