<?php

namespace App\Http\Controllers;

use App\Models\Alternative;
use App\Models\Criteria;
use App\Models\AlternativeScore;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlternativeScoreController extends Controller
{
    public function index()
    {
        $alternatives = Alternative::with('scores')->orderBy('code')->get();
        $activeCriteria = Criteria::where('is_active', true)->orderBy('code')->get();

        return Inertia::render('Scores/Index', [
            'alternatives' => $alternatives,
            'active_criteria' => $activeCriteria,
        ]);
    }

    public function store(Request $request)
    {
        if (!in_array(auth()->user()->role, ['admin', 'petugas'])) {
            abort(403, 'Hanya Petugas atau Admin yang dapat menginput nilai nasabah.');
        }

        $request->validate([
            'alternative_id' => 'required|exists:alternatives,id',
            'scores' => 'required|array',
            'scores.*.criteria_id' => 'required|exists:criteria,id',
            'scores.*.value' => 'required|numeric',
        ], [
            'alternative_id.required' => 'Nasabah harus dipilih.',
            'scores.required' => 'Nilai kriteria wajib diisi.',
            'scores.*.value.required' => 'Nilai kriteria tidak boleh kosong.',
            'scores.*.value.numeric' => 'Nilai kriteria harus berupa angka.',
        ]);

        $alternativeId = $request->input('alternative_id');
        $scoresInput = $request->input('scores');

        // Check active criteria count to ensure all active criteria are scored
        $activeCriteria = Criteria::where('is_active', true)->get();
        $activeCriteriaIds = $activeCriteria->pluck('id')->toArray();
        $submittedCriteriaIds = array_column($scoresInput, 'criteria_id');

        // Validate that all active criteria are present
        $missingCriteriaIds = array_diff($activeCriteriaIds, $submittedCriteriaIds);
        if (!empty($missingCriteriaIds)) {
            $missingNames = Criteria::whereIn('id', $missingCriteriaIds)->pluck('name')->implode(', ');
            return back()->withErrors(['scores' => "Nilai untuk kriteria berikut belum lengkap: {$missingNames}."]);
        }

        // Additional validation for cost criteria: cannot be zero or negative
        foreach ($scoresInput as $scoreItem) {
            $criteria = $activeCriteria->firstWhere('id', $scoreItem['criteria_id']);
            if ($criteria && $criteria->type === 'cost' && $scoreItem['value'] <= 0) {
                return back()->withErrors(['scores' => "Nilai untuk kriteria cost ({$criteria->name}) tidak boleh 0 atau negatif."]);
            }
        }

        // Save scores
        foreach ($scoresInput as $scoreItem) {
            AlternativeScore::updateOrCreate(
                [
                    'alternative_id' => $alternativeId,
                    'criteria_id' => $scoreItem['criteria_id'],
                ],
                [
                    'value' => (double) $scoreItem['value'],
                ]
            );
        }

        return redirect()->route('scores.index')->with('success', 'Nilai nasabah berhasil disimpan.');
    }
}
