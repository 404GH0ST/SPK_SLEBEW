<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use App\Models\SwaraWeight;
use App\Services\SwaraService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SwaraWeightController extends Controller
{
    protected $swaraService;

    public function __construct(SwaraService $swaraService)
    {
        $this->swaraService = $swaraService;
    }

    public function index()
    {
        $currentWeights = $this->swaraService->getWeights();
        $activeCriteria = Criteria::where('is_active', true)->get();

        return Inertia::render('Swara/Index', [
            'current_weights' => $currentWeights,
            'active_criteria' => $activeCriteria,
            'is_valid' => $this->swaraService->validateWeights(),
        ]);
    }

    public function store(Request $request)
    {
        // Only Pakar or Admin can fill weights
        if (!in_array(auth()->user()->role, ['admin', 'pakar'])) {
            abort(403, 'Hanya Pakar atau Admin yang dapat mengisi pembobotan SWARA.');
        }

        $request->validate([
            'weights' => 'required|array|min:1',
            'weights.*.criteria_id' => 'required|exists:criteria,id',
            'weights.*.rank_order' => 'required|integer|min:1',
            'weights.*.sj' => 'required|numeric|min:0',
        ], [
            'weights.required' => 'Data pembobotan wajib diisi.',
            'weights.*.sj.required' => 'Nilai Sj wajib diisi.',
            'weights.*.sj.numeric' => 'Nilai Sj harus berupa angka.',
            'weights.*.sj.min' => 'Nilai Sj tidak boleh negatif.',
        ]);

        $items = $request->input('weights');
        
        // Check if all active criteria are included
        $activeCriteriaIds = Criteria::where('is_active', true)->pluck('id')->toArray();
        $submittedCriteriaIds = array_column($items, 'criteria_id');
        
        if (count(array_diff($activeCriteriaIds, $submittedCriteriaIds)) > 0 || count(array_diff($submittedCriteriaIds, $activeCriteriaIds)) > 0) {
            return back()->withErrors(['weights' => 'Semua kriteria aktif wajib dimasukkan dalam pembobotan SWARA.']);
        }

        // Validate rank orders are unique and sequential (1 to N)
        $ranks = array_column($items, 'rank_order');
        sort($ranks);
        $expectedRanks = range(1, count($items));
        
        if ($ranks !== $expectedRanks) {
            return back()->withErrors(['weights' => 'Urutan prioritas (rank order) harus unik dan berurutan dari 1 sampai ' . count($items) . '.']);
        }

        // Validate that first rank has sj = 0
        foreach ($items as $item) {
            if ($item['rank_order'] == 1 && $item['sj'] != 0) {
                return back()->withErrors(['weights' => 'Kriteria peringkat pertama (paling penting) harus memiliki nilai Sj = 0.']);
            }
        }

        try {
            // Calculate weights using service
            $calculated = $this->swaraService->calculateWeights($items);
            
            // Save to DB
            $this->swaraService->saveWeights($calculated);

            return redirect()->route('swara.index')->with('success', 'Pembobotan SWARA berhasil dihitung dan disimpan.');
        } catch (\Exception $e) {
            return back()->withErrors(['weights' => $e->getMessage()]);
        }
    }
}
