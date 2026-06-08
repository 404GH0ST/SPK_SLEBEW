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
        // 1. Create Users for all 4 roles
        $users = [
            [
                'name' => 'Admin Koperasi',
                'email' => 'admin@coop.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Pakar / Kepala Koperasi',
                'email' => 'pakar@coop.com',
                'password' => Hash::make('password'),
                'role' => 'pakar',
            ],
            [
                'name' => 'Petugas Koperasi',
                'email' => 'petugas@coop.com',
                'password' => Hash::make('password'),
                'role' => 'petugas',
            ],
            [
                'name' => 'Pimpinan Koperasi',
                'email' => 'pimpinan@coop.com',
                'password' => Hash::make('password'),
                'role' => 'pimpinan',
            ],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(['email' => $u['email']], $u);
        }

        // 2. Create Criteria (matching K1-K6 from JS_SPK_Pertemuan 7 MARCOS.pdf)
        $criteriaData = [
            [
                'code' => 'K1',
                'name' => 'Jumlah Pinjaman',
                'type' => 'cost',
                'unit' => 'Rp',
                'description' => 'Besaran dana pinjaman yang diajukan oleh nasabah (semakin kecil semakin aman bagi koperasi).',
                'is_active' => true,
            ],
            [
                'code' => 'K2',
                'name' => 'Lama Pinjaman',
                'type' => 'cost',
                'unit' => 'Bulan',
                'description' => 'Tenor waktu pengembalian pinjaman yang diinginkan (semakin singkat tenor semakin kecil risiko).',
                'is_active' => true,
            ],
            [
                'code' => 'K3',
                'name' => 'Penghasilan',
                'type' => 'cost', // Set to 'cost' as defined in the lecture jobsheet/slides
                'unit' => 'Rp',
                'description' => 'Pendapatan bulanan nasabah (diklasifikasikan sebagai cost pada materi perkuliahan).',
                'is_active' => true,
            ],
            [
                'code' => 'K4',
                'name' => 'Jaminan',
                'type' => 'benefit',
                'unit' => 'Skala',
                'description' => 'Tingkat kepemilikan dan nilai jaminan aset (1: Kurang, 2: Cukup, 3: Sedang, 4: Baik, 5: Sangat Baik).',
                'is_active' => true,
            ],
            [
                'code' => 'K5',
                'name' => 'Status Rumah',
                'type' => 'benefit',
                'unit' => 'Skala',
                'description' => 'Status kepemilikan tempat tinggal nasabah (1: Kontrak, 2: Sewa Tahunan, 3: Rumah Dinas, 4: Ikut Orang Tua, 5: Milik Sendiri).',
                'is_active' => true,
            ],
            [
                'code' => 'K6',
                'name' => 'Lama Keanggotaan',
                'type' => 'benefit',
                'unit' => 'Tahun',
                'description' => 'Durasi nasabah menjadi anggota koperasi untuk mengukur loyalitas.',
                'is_active' => true,
            ],
        ];

        $criteria = [];
        foreach ($criteriaData as $c) {
            $criteria[$c['code']] = Criteria::updateOrCreate(['code' => $c['code']], $c);
        }

        // 3. Create Alternatives (Nasabah 1-8 from PDF jobsheet task)
        $alternativesData = [
            [
                'code' => 'A1',
                'name' => 'Nasabah 1',
                'nik' => '3201011212900001',
                'address' => 'Jl. Koperasi Raya No. 1, Malang',
                'phone' => '081234567891',
                'description' => 'Alternatif Nasabah Ke-1',
            ],
            [
                'code' => 'A2',
                'name' => 'Nasabah 2',
                'nik' => '3201011212900002',
                'address' => 'Jl. Koperasi Raya No. 2, Malang',
                'phone' => '081234567892',
                'description' => 'Alternatif Nasabah Ke-2',
            ],
            [
                'code' => 'A3',
                'name' => 'Nasabah 3',
                'nik' => '3201011212900003',
                'address' => 'Jl. Koperasi Raya No. 3, Malang',
                'phone' => '081234567893',
                'description' => 'Alternatif Nasabah Ke-3',
            ],
            [
                'code' => 'A4',
                'name' => 'Nasabah 4',
                'nik' => '3201011212900004',
                'address' => 'Jl. Koperasi Raya No. 4, Malang',
                'phone' => '081234567894',
                'description' => 'Alternatif Nasabah Ke-4',
            ],
            [
                'code' => 'A5',
                'name' => 'Nasabah 5',
                'nik' => '3201011212900005',
                'address' => 'Jl. Koperasi Raya No. 5, Malang',
                'phone' => '081234567895',
                'description' => 'Alternatif Nasabah Ke-5',
            ],
            [
                'code' => 'A6',
                'name' => 'Nasabah 6',
                'nik' => '3201011212900006',
                'address' => 'Jl. Koperasi Raya No. 6, Malang',
                'phone' => '081234567896',
                'description' => 'Alternatif Nasabah Ke-6',
            ],
            [
                'code' => 'A7',
                'name' => 'Nasabah 7',
                'nik' => '3201011212900007',
                'address' => 'Jl. Koperasi Raya No. 7, Malang',
                'phone' => '081234567897',
                'description' => 'Alternatif Nasabah Ke-7',
            ],
            [
                'code' => 'A8',
                'name' => 'Nasabah 8',
                'nik' => '3201011212900008',
                'address' => 'Jl. Koperasi Raya No. 8, Malang',
                'phone' => '081234567898',
                'description' => 'Alternatif Nasabah Ke-8',
            ],
        ];

        $alternatives = [];
        foreach ($alternativesData as $a) {
            $alternatives[$a['code']] = Alternative::updateOrCreate(['code' => $a['code']], $a);
        }

        // 4. Create Alternative Scores (from PDF jobsheet task)
        $scoresData = [
            'A1' => ['K1' => 9000000,  'K2' => 18, 'K3' => 4500000, 'K4' => 3, 'K5' => 4, 'K6' => 4],
            'A2' => ['K1' => 12000000, 'K2' => 24, 'K3' => 5000000, 'K4' => 2, 'K5' => 3, 'K6' => 3],
            'A3' => ['K1' => 15000000, 'K2' => 36, 'K3' => 6000000, 'K4' => 2, 'K5' => 4, 'K6' => 4],
            'A4' => ['K1' => 10000000, 'K2' => 12, 'K3' => 5500000, 'K4' => 3, 'K5' => 4, 'K6' => 5],
            'A5' => ['K1' => 7000000,  'K2' => 24, 'K3' => 6500000, 'K4' => 2, 'K5' => 3, 'K6' => 4],
            'A6' => ['K1' => 8000000,  'K2' => 24, 'K3' => 3500000, 'K4' => 2, 'K5' => 4, 'K6' => 4],
            'A7' => ['K1' => 11000000, 'K2' => 36, 'K3' => 5000000, 'K4' => 2, 'K5' => 3, 'K6' => 3],
            'A8' => ['K1' => 13000000, 'K2' => 12, 'K3' => 7000000, 'K4' => 2, 'K5' => 4, 'K6' => 6],
        ];

        foreach ($scoresData as $altCode => $scores) {
            $alt = $alternatives[$altCode];
            foreach ($scores as $critCode => $value) {
                $crit = $criteria[$critCode];
                AlternativeScore::updateOrCreate(
                    [
                        'alternative_id' => $alt->id,
                        'criteria_id' => $crit->id,
                    ],
                    [
                        'value' => $value,
                    ]
                );
            }
        }

        // 5. Calculate and Seed SWARA Weights
        $swaraService = app(SwaraService::class);
        
        // Define a mock expert importance ranking for SWARA
        $swaraItems = [
            ['criteria_id' => $criteria['K3']->id, 'rank_order' => 1, 'sj' => 0.0],  // K3 (Penghasilan)
            ['criteria_id' => $criteria['K1']->id, 'rank_order' => 2, 'sj' => 0.1],  // K1 (Jumlah Pinjaman)
            ['criteria_id' => $criteria['K4']->id, 'rank_order' => 3, 'sj' => 0.2],  // K4 (Jaminan)
            ['criteria_id' => $criteria['K5']->id, 'rank_order' => 4, 'sj' => 0.15], // K5 (Status Rumah)
            ['criteria_id' => $criteria['K6']->id, 'rank_order' => 5, 'sj' => 0.25], // K6 (Lama Keanggotaan)
            ['criteria_id' => $criteria['K2']->id, 'rank_order' => 6, 'sj' => 0.3],  // K2 (Lama Pinjaman)
        ];

        $calculatedWeights = $swaraService->calculateWeights($swaraItems);
        $swaraService->saveWeights($calculatedWeights);

        // 6. Calculate and Seed MARCOS Results
        $marcosService = app(MarcosService::class);
        $marcosResults = $marcosService->runCompleteCalculation();
        $marcosService->saveResults($marcosResults);

        // 7. Log the Seed-based Calculation
        CalculationLog::create([
            'calculation_code' => 'CALC-SEED-' . time(),
            'description' => 'Perhitungan kelayakan pinjaman otomatis diinisialisasi melalui seeder database.',
            'created_by' => User::where('role', 'admin')->first()->id ?? null,
        ]);
    }
}
