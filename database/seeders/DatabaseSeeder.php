<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Criteria;
use App\Models\Alternative;
use App\Models\AlternativeScore;
use App\Models\CalculationLog;
use App\Services\SwaraService;
use App\Services\MarcosService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SPKDataSeeder::class,
        ]);
    }
}
