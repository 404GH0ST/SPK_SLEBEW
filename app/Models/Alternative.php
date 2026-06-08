<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alternative extends Model
{
    protected $table = 'alternatives';

    protected $fillable = [
        'code',
        'name',
        'nik',
        'address',
        'phone',
        'description',
    ];

    public function scores()
    {
        return $this->hasMany(AlternativeScore::class, 'alternative_id');
    }

    public function marcosResult()
    {
        return $this->hasOne(MarcosResult::class, 'alternative_id');
    }
}
