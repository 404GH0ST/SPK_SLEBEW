<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlternativeScore extends Model
{
    protected $table = 'alternative_scores';

    protected $fillable = [
        'alternative_id',
        'criteria_id',
        'value',
    ];

    protected $casts = [
        'value' => 'double',
    ];

    public function alternative()
    {
        return $this->belongsTo(Alternative::class, 'alternative_id');
    }

    public function criteria()
    {
        return $this->belongsTo(Criteria::class, 'criteria_id');
    }
}
