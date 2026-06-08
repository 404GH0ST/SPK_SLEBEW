<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SwaraWeight extends Model
{
    protected $table = 'swara_weights';

    protected $fillable = [
        'criteria_id',
        'rank_order',
        'sj',
        'kj',
        'qj',
        'weight',
    ];

    protected $casts = [
        'rank_order' => 'integer',
        'sj' => 'double',
        'kj' => 'double',
        'qj' => 'double',
        'weight' => 'double',
    ];

    public function criteria()
    {
        return $this->belongsTo(Criteria::class, 'criteria_id');
    }
}
