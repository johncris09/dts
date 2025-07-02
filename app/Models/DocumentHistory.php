<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentHistory extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentHistoryFactory> */
    use HasFactory;

    protected $fillable = [
        'document_id',
        'action',
        'from_office_id',
        'from_division_id',
        'to_office_id',
        'to_division_id',
        'status',
        'remarks',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function fromOffice()
    {
        return $this->belongsTo(Office::class, 'from_office_id');
    }

    public function fromDivision()
    {
        return $this->belongsTo(Division::class, 'from_division_id');
    }

    public function toOffice()
    {
        return $this->belongsTo(Office::class, 'to_office_id');
    }

    public function toDivision()
    {
        return $this->belongsTo(Division::class, 'to_division_id');
    }
}
