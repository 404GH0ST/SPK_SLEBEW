<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use App\Models\Alternative;
use App\Models\AlternativeScore;
use App\Models\MarcosResult;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $criteriaCount = Criteria::count();
        $alternativeCount = Alternative::count();
        
        // Count how many alternatives have all active criteria scored
        $activeCriteriaCount = Criteria::where('is_active', true)->count();
        $scoredAlternativesCount = 0;
        
        if ($activeCriteriaCount > 0) {
            $scoredAlternativesCount = Alternative::whereHas('scores', function($q) {
                $q->whereIn('criteria_id', Criteria::where('is_active', true)->select('id'));
            }, '=', $activeCriteriaCount)->count();
        }

        $topRankings = MarcosResult::with('alternative')
            ->orderBy('rank')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'criteria_count' => $criteriaCount,
                'alternative_count' => $alternativeCount,
                'scored_count' => $scoredAlternativesCount,
            ],
            'top_rankings' => $topRankings,
        ]);
    }
}
