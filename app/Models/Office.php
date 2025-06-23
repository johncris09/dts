<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    /** @use HasFactory<\Database\Factories\OfficeFactory> */
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function division()
    {
        return $this->hasMany(Division::class);
    }

    public function office()
    {
        return $this->hasMany(Office::class);
    }
}
