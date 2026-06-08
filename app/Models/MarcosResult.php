<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarcosResult extends Model
{
    protected $table = 'marcos_results';

    protected $fillable = [
        'alternative_id',
        'si',
        'k_minus',
        'k_plus',
        'f_k_minus',
        'f_k_plus',
        'utility_value',
        'rank',
        'status',
    ];

    protected $casts = [
        'si' => 'double',
        'k_minus' => 'double',
        'k_plus' => 'double',
        'f_k_minus' => 'double',
        'f_k_plus' => 'double',
        'utility_value' => 'double',
        'rank' => 'integer',
    ];

    public function alternative()
    {
        return $this->belongsTo(Alternative::class, 'alternative_id');
    }
}
