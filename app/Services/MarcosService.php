<?php

namespace App\Services;

use App\Models\Criteria;
use App\Models\Alternative;
use App\Models\AlternativeScore;
use App\Models\MarcosResult;
use App\Models\SwaraWeight;
use Illuminate\Support\Facades\DB;
use Exception;

class MarcosService
{
    /**
     * Build the decision matrix from alternative scores.
     * 
     * @param \Illuminate\Database\Eloquent\Collection $alternatives
     * @param \Illuminate\Database\Eloquent\Collection $criteria
     * @return array [alternative_id => [criteria_id => value]]
     */
    public function buildDecisionMatrix($alternatives, $criteria): array
    {
        $matrix = [];
        
        foreach ($alternatives as $alt) {
            $matrix[$alt->id] = [];
            foreach ($criteria as $c) {
                // Find score
                $score = $alt->scores->firstWhere('criteria_id', $c->id);
                if (!$score) {
                    throw new Exception("Nilai alternatif {$alt->name} untuk kriteria {$c->name} ({$c->code}) belum lengkap.");
                }
                
                $value = (double) $score->value;
                
                // Validation: Cost criteria value cannot be zero or empty
                if ($c->type === 'cost' && $value <= 0) {
                    throw new Exception("Nilai kriteria {$c->name} ({$c->code}) dengan tipe 'cost' pada nasabah {$alt->name} tidak boleh nol atau negatif.");
                }
                
                $matrix[$alt->id][$c->id] = $value;
            }
        }
        
        return $matrix;
    }

    /**
     * Determine Ideal (AI) and Anti-Ideal (AAI) values for each criteria.
     * 
     * @param array $matrix Decision matrix
     * @param \Illuminate\Database\Eloquent\Collection $criteria
     * @return array ['AI' => [criteria_id => val], 'AAI' => [criteria_id => val]]
     */
    public function determineIdealAndAntiIdeal(array $matrix, $criteria): array
    {
        $ai = [];
        $aai = [];

        foreach ($criteria as $c) {
            $values = array_column($matrix, $c->id);
            if (empty($values)) {
                throw new Exception("Data matrix kosong untuk kriteria {$c->code}.");
            }

            if ($c->type === 'benefit') {
                $ai[$c->id] = max($values);
                $aai[$c->id] = min($values);
            } else { // cost
                $ai[$c->id] = min($values);
                $aai[$c->id] = max($values);
            }
        }

        return [
            'AI' => $ai,
            'AAI' => $aai,
        ];
    }

    /**
     * Normalize the decision matrix (including AI and AAI rows).
     * 
     * @param array $matrix Decision matrix
     * @param array $idealSolutions ['AI' => [...], 'AAI' => [...]]
     * @param \Illuminate\Database\Eloquent\Collection $criteria
     * @return array ['normalized' => [alt_id => [crit_id => val]], 'normalized_AI' => [...], 'normalized_AAI' => [...]]
     */
    public function normalizeMatrix(array $matrix, array $idealSolutions, $criteria): array
    {
        $normalized = [];
        $normalizedAI = [];
        $normalizedAAI = [];

        $ai = $idealSolutions['AI'];
        $aai = $idealSolutions['AAI'];

        foreach ($criteria as $c) {
            $aiVal = $ai[$c->id];
            $aaiVal = $aai[$c->id];

            if ($aiVal == 0) {
                throw new Exception("Nilai Ideal (AI) untuk kriteria {$c->code} adalah 0, tidak bisa melakukan normalisasi.");
            }

            // Normalization for alternatives
            foreach ($matrix as $altId => $row) {
                $xij = $row[$c->id];
                if ($c->type === 'benefit') {
                    $normalized[$altId][$c->id] = $xij / $aiVal;
                } else { // cost
                    if ($xij == 0) {
                        throw new Exception("Nilai alternatif untuk kriteria cost {$c->code} bernilai 0, pembagian dengan nol tidak diperbolehkan.");
                    }
                    $normalized[$altId][$c->id] = $aiVal / $xij;
                }
            }

            // Normalization for AI row (always 1.0)
            $normalizedAI[$c->id] = 1.0;

            // Normalization for AAI row
            if ($c->type === 'benefit') {
                $normalizedAAI[$c->id] = $aaiVal / $aiVal;
            } else { // cost
                if ($aaiVal == 0) {
                    throw new Exception("Nilai Anti-Ideal (AAI) untuk kriteria cost {$c->code} adalah 0.");
                }
                $normalizedAAI[$c->id] = $aiVal / $aaiVal;
            }
        }

        return [
            'normalized' => $normalized,
            'normalized_AI' => $normalizedAI,
            'normalized_AAI' => $normalizedAAI,
        ];
    }

    /**
     * Calculate weighted normalized matrix.
     * 
     * @param array $normMatrixResult Output of normalizeMatrix()
     * @param array $weights [criteria_id => weight]
     * @return array ['weighted' => ..., 'weighted_AI' => ..., 'weighted_AAI' => ...]
     */
    public function calculateWeightedMatrix(array $normMatrixResult, array $weights): array
    {
        $weighted = [];
        $weightedAI = [];
        $weightedAAI = [];

        $normalized = $normMatrixResult['normalized'];
        $normalizedAI = $normMatrixResult['normalized_AI'];
        $normalizedAAI = $normMatrixResult['normalized_AAI'];

        // Alternatives
        foreach ($normalized as $altId => $row) {
            foreach ($row as $critId => $val) {
                $w = $weights[$critId] ?? 0.0;
                $weighted[$altId][$critId] = $val * $w;
            }
        }

        // AI
        foreach ($normalizedAI as $critId => $val) {
            $w = $weights[$critId] ?? 0.0;
            $weightedAI[$critId] = $val * $w;
        }

        // AAI
        foreach ($normalizedAAI as $critId => $val) {
            $w = $weights[$critId] ?? 0.0;
            $weightedAAI[$critId] = $val * $w;
        }

        return [
            'weighted' => $weighted,
            'weighted_AI' => $weightedAI,
            'weighted_AAI' => $weightedAAI,
        ];
    }

    /**
     * Calculate Si value (sum of weighted values) for each alternative and AI, AAI.
     * 
     * @param array $weightedResult
     * @return array ['Si' => [alt_id => val], 'S_AI' => val, 'S_AAI' => val]
     */
    public function calculateSi(array $weightedResult): array
    {
        $si = [];
        
        // Alternatives Si
        foreach ($weightedResult['weighted'] as $altId => $row) {
            $si[$altId] = array_sum($row);
        }

        // S_AI
        $sAi = array_sum($weightedResult['weighted_AI']);

        // S_AAI
        $sAai = array_sum($weightedResult['weighted_AAI']);

        return [
            'Si' => $si,
            'S_AI' => $sAi,
            'S_AAI' => $sAai,
        ];
    }

    /**
     * Calculate utility degrees Ki- and Ki+.
     * 
     * @param array $siResult
     * @return array [alt_id => ['k_minus' => val, 'k_plus' => val]]
     */
    public function calculateUtilityDegree(array $siResult): array
    {
        $degrees = [];
        $siList = $siResult['Si'];
        $sAi = $siResult['S_AI'];
        $sAai = $siResult['S_AAI'];

        // Prevent division by zero
        $safeSAi = ($sAi == 0.0) ? 1.0 : $sAi;
        $safeSAai = ($sAai == 0.0) ? 1.0 : $sAai;

        foreach ($siList as $altId => $si) {
            $degrees[$altId] = [
                'k_minus' => $si / $safeSAai,
                'k_plus' => $si / $safeSAi,
            ];
        }

        return $degrees;
    }

    /**
     * Calculate utility functions f(Ki-) and f(Ki+), and final utility value.
     * 
     * @param array $degrees
     * @return array [alt_id => ['f_k_minus' => val, 'f_k_plus' => val, 'utility_value' => val]]
     */
    public function calculateUtilityFunction(array $degrees): array
    {
        $utilities = [];

        foreach ($degrees as $altId => $deg) {
            $kMinus = $deg['k_minus'];
            $kPlus = $deg['k_plus'];

            $sumK = $kPlus + $kMinus;
            if ($sumK == 0.0) {
                $fKMinus = 0.0;
                $fKPlus = 0.0;
            } else {
                $fKMinus = $kPlus / $sumK;
                $fKPlus = $kMinus / $sumK;
            }

            // Calculate final utility value
            // Formula: (K_plus + K_minus) / (1 + ((1 - f_K_plus) / f_K_plus) + ((1 - f_K_minus) / f_K_minus))
            // We must protect against division by zero for f_K_plus and f_K_minus
            $term1 = ($fKPlus == 0.0) ? 0.0 : ((1.0 - $fKPlus) / $fKPlus);
            $term2 = ($fKMinus == 0.0) ? 0.0 : ((1.0 - $fKMinus) / $fKMinus);

            $denominator = 1.0 + $term1 + $term2;
            $utilityValue = ($denominator == 0.0) ? 0.0 : ($sumK / $denominator);

            $utilities[$altId] = [
                'f_k_minus' => $fKMinus,
                'f_k_plus' => $fKPlus,
                'utility_value' => $utilityValue,
            ];
        }

        return $utilities;
    }

    /**
     * Generate rankings based on utility values.
     * 
     * @param array $utilities
     * @return array [alt_id => ['rank' => integer, 'status' => string]]
     */
    public function generateRanking(array $utilities): array
    {
        // Copy utilities to sort
        $sorted = $utilities;
        
        // Sort by utility_value descending
        uasort($sorted, function($a, $b) {
            return $b['utility_value'] <=> $a['utility_value'];
        });

        $rankings = [];
        $rank = 1;
        
        foreach ($sorted as $altId => $util) {
            $val = $util['utility_value'];
            
            // Determine eligibility status
            if ($val >= 0.75) {
                $status = 'Sangat Layak';
            } elseif ($val >= 0.60) {
                $status = 'Layak';
            } elseif ($val >= 0.45) {
                $status = 'Dipertimbangkan';
            } else {
                $status = 'Tidak Prioritas';
            }

            $rankings[$altId] = [
                'rank' => $rank++,
                'status' => $status,
            ];
        }

        return $rankings;
    }

    /**
     * Run the complete MARCOS calculation and return intermediate and final results.
     * 
     * @return array
     */
    public function runCompleteCalculation(): array
    {
        // 1. Get active criteria and all alternatives with their scores
        $criteria = Criteria::where('is_active', true)->get();
        if ($criteria->isEmpty()) {
            throw new Exception("Tidak ada kriteria aktif untuk proses perhitungan.");
        }

        $alternatives = Alternative::with('scores')->get();
        if ($alternatives->isEmpty()) {
            throw new Exception("Data alternatif kosong. Harap isi data alternatif terlebih dahulu.");
        }

        // Check if SWARA weights are set
        $swaraWeights = SwaraWeight::all();
        if ($swaraWeights->count() !== $criteria->count()) {
            throw new Exception("Bobot SWARA belum dihitung atau tidak cocok dengan jumlah kriteria aktif.");
        }

        // Map weights: [criteria_id => weight]
        $weights = $swaraWeights->pluck('weight', 'criteria_id')->toArray();

        // 2. Build Decision Matrix
        $matrix = $this->buildDecisionMatrix($alternatives, $criteria);

        // 3. Determine Ideal and Anti-Ideal solutions
        $idealSolutions = $this->determineIdealAndAntiIdeal($matrix, $criteria);

        // 4. Normalize Matrix
        $normResult = $this->normalizeMatrix($matrix, $idealSolutions, $criteria);

        // 5. Calculate Weighted Matrix
        $weightedResult = $this->calculateWeightedMatrix($normResult, $weights);

        // 6. Calculate Si, S_AI, S_AAI
        $siResult = $this->calculateSi($weightedResult);

        // 7. Calculate Utility Degrees (K-, K+)
        $degreesResult = $this->calculateUtilityDegree($siResult);

        // 8. Calculate Utility Functions & Final Utility Value
        $utilitiesResult = $this->calculateUtilityFunction($degreesResult);

        // 9. Generate Rankings
        $rankingsResult = $this->generateRanking($utilitiesResult);

        // Return comprehensive package of data
        return [
            'criteria' => $criteria,
            'alternatives' => $alternatives,
            'weights' => $weights,
            'swara_details' => $swaraWeights,
            'decision_matrix' => $matrix,
            'ideal_solutions' => $idealSolutions,
            'normalized_matrix' => $normResult['normalized'],
            'normalized_AI' => $normResult['normalized_AI'],
            'normalized_AAI' => $normResult['normalized_AAI'],
            'weighted_matrix' => $weightedResult['weighted'],
            'weighted_AI' => $weightedResult['weighted_AI'],
            'weighted_AAI' => $weightedResult['weighted_AAI'],
            'si_values' => $siResult['Si'],
            's_ai' => $siResult['S_AI'],
            's_aai' => $siResult['S_AAI'],
            'utility_degrees' => $degreesResult,
            'utility_functions' => $utilitiesResult,
            'rankings' => $rankingsResult,
        ];
    }

    /**
     * Save the MARCOS calculation results to database.
     * 
     * @param array $calculationResult Result from runCompleteCalculation()
     * @return void
     */
    public function saveResults(array $calculationResult): void
    {
        DB::transaction(function() use ($calculationResult) {
            // Clear old results (safer than truncate on Postgres)
            MarcosResult::query()->delete();

            $rankings = $calculationResult['rankings'];
            $siList = $calculationResult['si_values'];
            $degrees = $calculationResult['utility_degrees'];
            $utilities = $calculationResult['utility_functions'];

            foreach ($rankings as $altId => $rankInfo) {
                MarcosResult::create([
                    'alternative_id' => $altId,
                    'si' => $siList[$altId],
                    'k_minus' => $degrees[$altId]['k_minus'],
                    'k_plus' => $degrees[$altId]['k_plus'],
                    'f_k_minus' => $utilities[$altId]['f_k_minus'],
                    'f_k_plus' => $utilities[$altId]['f_k_plus'],
                    'utility_value' => $utilities[$altId]['utility_value'],
                    'rank' => $rankInfo['rank'],
                    'status' => $rankInfo['status'],
                ]);
            }
        });
    }
}
