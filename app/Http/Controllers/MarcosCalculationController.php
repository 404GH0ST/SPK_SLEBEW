<?php

namespace App\Http\Controllers;

use App\Services\MarcosService;
use App\Services\SwaraService;
use App\Models\MarcosResult;
use App\Models\CalculationLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;

class MarcosCalculationController extends Controller
{
    protected $marcosService;
    protected $swaraService;

    public function __construct(MarcosService $marcosService, SwaraService $swaraService)
    {
        $this->marcosService = $marcosService;
        $this->swaraService = $swaraService;
    }

    public function calculate()
    {
        if (!in_array(auth()->user()->role, ['admin', 'pakar', 'petugas'])) {
            abort(403, 'Anda tidak memiliki hak akses untuk memicu perhitungan.');
        }

        try {
            // Check weights validation first
            if (!$this->swaraService->validateWeights()) {
                throw new Exception("Proses MARCOS tidak dapat dijalankan karena bobot SWARA belum dihitung secara lengkap untuk kriteria aktif.");
            }

            // Run calculation
            $results = $this->marcosService->runCompleteCalculation();
            
            // Save results
            $this->marcosService->saveResults($results);

            // Log calculation
            CalculationLog::create([
                'calculation_code' => 'CALC-' . time(),
                'description' => 'Perhitungan kelayakan penerima pinjaman berhasil dilakukan.',
                'created_by' => auth()->id(),
            ]);

            return redirect()->route('marcos.results')->with('success', 'Perhitungan MARCOS berhasil diselesaikan.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function results()
    {
        $results = MarcosResult::with('alternative.scores')
            ->orderBy('rank')
            ->get();

        $activeCriteria = \App\Models\Criteria::where('is_active', true)->orderBy('code')->get();

        return Inertia::render('Marcos/Results', [
            'results' => $results,
            'active_criteria' => $activeCriteria,
            'is_calculated' => !$results->isEmpty(),
        ]);
    }

    public function details()
    {
        try {
            if (!$this->swaraService->validateWeights()) {
                return Inertia::render('Marcos/Details', [
                    'error' => "Bobot SWARA belum dihitung secara lengkap untuk kriteria aktif. Harap selesaikan langkah pembobotan terlebih dahulu.",
                ]);
            }

            $details = $this->marcosService->runCompleteCalculation();
            
            return Inertia::render('Marcos/Details', [
                'details' => $details,
            ]);
        } catch (Exception $e) {
            return Inertia::render('Marcos/Details', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
