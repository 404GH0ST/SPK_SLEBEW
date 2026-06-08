<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\SwaraWeightController;
use App\Http\Controllers\AlternativeController;
use App\Http\Controllers\AlternativeScoreController;
use App\Http\Controllers\MarcosCalculationController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Criteria CRUD
    Route::resource('criteria', CriteriaController::class)->except(['create', 'edit', 'show']);

    // Swara Weighting
    Route::get('/swara', [SwaraWeightController::class, 'index'])->name('swara.index');
    Route::post('/swara', [SwaraWeightController::class, 'store'])->name('swara.store');

    // Alternatives CRUD
    Route::resource('alternatives', AlternativeController::class)->except(['create', 'edit', 'show']);

    // Alternative Scores
    Route::get('/scores', [AlternativeScoreController::class, 'index'])->name('scores.index');
    Route::post('/scores', [AlternativeScoreController::class, 'store'])->name('scores.store');

    // MARCOS Calculations
    Route::post('/marcos/calculate', [MarcosCalculationController::class, 'calculate'])->name('marcos.calculate');
    Route::get('/marcos/results', [MarcosCalculationController::class, 'results'])->name('marcos.results');
    Route::get('/marcos/details', [MarcosCalculationController::class, 'details'])->name('marcos.details');

    // Reports Export
    Route::get('/reports/pdf', [ReportController::class, 'exportPdf'])->name('reports.pdf');
    Route::get('/reports/excel', [ReportController::class, 'exportExcel'])->name('reports.excel');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
