<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    protected $table = 'criteria';

    protected $fillable = [
        'code',
        'name',
        'type',
        'unit',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function swaraWeight()
    {
        return $this->hasOne(SwaraWeight::class, 'criteria_id');
    }

    public function scores()
    {
        return $this->hasMany(AlternativeScore::class, 'criteria_id');
    }
}
