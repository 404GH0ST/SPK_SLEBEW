<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalculationLog extends Model
{
    protected $table = 'calculation_logs';

    protected $fillable = [
        'calculation_code',
        'description',
        'created_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
