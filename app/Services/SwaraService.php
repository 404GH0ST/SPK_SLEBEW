<?php

namespace App\Services;

use App\Models\SwaraWeight;
use App\Models\Criteria;
use Illuminate\Support\Facades\DB;

class SwaraService
{
    /**
     * Calculate SWARA weights based on the criteria rankings and comparative values.
     * 
     * @param array $items Array of [criteria_id, rank_order, sj]
     * @return array Calculated items
     */
    public function calculateWeights(array $items): array
    {
        // Sort items by rank_order to ensure we compute sequentially
        usort($items, function($a, $b) {
            return $a['rank_order'] <=> $b['rank_order'];
        });

        $calculated = [];
        $sumQ = 0.0;

        foreach ($items as $index => $item) {
            $criteriaId = $item['criteria_id'];
            $rankOrder = $item['rank_order'];
            $sj = ($index === 0) ? 0.0 : (double) $item['sj'];

            if ($index === 0) {
                $kj = 1.0;
                $qj = 1.0;
            } else {
                $kj = $sj + 1.0;
                $prevQj = $calculated[$index - 1]['qj'];
                
                // Avoid division by zero
                if ($kj == 0.0) {
                    $qj = $prevQj;
                } else {
                    $qj = $prevQj / $kj;
                }
            }

            $sumQ += $qj;

            $calculated[] = [
                'criteria_id' => $criteriaId,
                'rank_order' => $rankOrder,
                'sj' => $sj,
                'kj' => $kj,
                'qj' => $qj,
                'weight' => 0.0,
            ];
        }

        // Second pass: Calculate final weight wj = qj / sum(qj)
        foreach ($calculated as &$calcItem) {
            if ($sumQ > 0) {
                $calcItem['weight'] = $calcItem['qj'] / $sumQ;
            } else {
                $calcItem['weight'] = 0.0;
            }
        }

        return $calculated;
    }

    /**
     * Save the calculated weights to the database.
     * 
     * @param array $calculatedWeights
     * @return void
     */
    public function saveWeights(array $calculatedWeights): void
    {
        DB::transaction(function() use ($calculatedWeights) {
            // Delete all existing weights (safer than truncate on Postgres)
            SwaraWeight::query()->delete();

            foreach ($calculatedWeights as $weight) {
                SwaraWeight::create([
                    'criteria_id' => $weight['criteria_id'],
                    'rank_order' => $weight['rank_order'],
                    'sj' => $weight['sj'],
                    'kj' => $weight['kj'],
                    'qj' => $weight['qj'],
                    'weight' => $weight['weight'],
                ]);
            }
        });
    }

    /**
     * Get currently saved weights.
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getWeights()
    {
        return SwaraWeight::with('criteria')->orderBy('rank_order')->get();
    }

    /**
     * Validate if SWARA weights are calculated and complete.
     * 
     * @return bool
     */
    public function validateWeights(): bool
    {
        $activeCriteriaCount = Criteria::where('is_active', true)->count();
        if ($activeCriteriaCount === 0) {
            return false;
        }

        $weightsCount = SwaraWeight::whereIn('criteria_id', function($query) {
            $query->select('id')->from('criteria')->where('is_active', true);
        })->count();

        // Check if we have weights for all active criteria
        if ($weightsCount !== $activeCriteriaCount) {
            return false;
        }

        $sumWeight = SwaraWeight::sum('weight');
        // Sum of weights should be very close to 1.0 (e.g. 0.99 to 1.01)
        return abs($sumWeight - 1.0) < 0.01;
    }
}
