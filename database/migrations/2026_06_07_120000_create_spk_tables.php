<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('criteria', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('type'); // benefit / cost
            $table->string('unit')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('swara_weights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('criteria_id')->constrained('criteria')->onDelete('cascade');
            $table->integer('rank_order')->nullable();
            $table->double('sj')->nullable(); // comparative value
            $table->double('kj')->nullable(); // coefficient
            $table->double('qj')->nullable(); // recalculated weight
            $table->double('weight')->nullable(); // final weight (wj)
            $table->timestamps();
        });

        Schema::create('alternatives', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('nik')->unique()->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('alternative_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alternative_id')->constrained('alternatives')->onDelete('cascade');
            $table->foreignId('criteria_id')->constrained('criteria')->onDelete('cascade');
            $table->double('value');
            $table->timestamps();
            
            // Ensure one score per alternative per criteria
            $table->unique(['alternative_id', 'criteria_id']);
        });

        Schema::create('marcos_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alternative_id')->constrained('alternatives')->onDelete('cascade');
            $table->double('si')->nullable();
            $table->double('k_minus')->nullable();
            $table->double('k_plus')->nullable();
            $table->double('f_k_minus')->nullable();
            $table->double('f_k_plus')->nullable();
            $table->double('utility_value')->nullable();
            $table->integer('rank')->nullable();
            $table->string('status')->nullable(); // Sangat Layak, Layak, Dipertimbangkan, Tidak Prioritas
            $table->timestamps();
        });

        Schema::create('calculation_logs', function (Blueprint $table) {
            $table->id();
            $table->string('calculation_code');
            $table->text('description');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calculation_logs');
        Schema::dropIfExists('marcos_results');
        Schema::dropIfExists('alternative_scores');
        Schema::dropIfExists('alternatives');
        Schema::dropIfExists('swara_weights');
        Schema::dropIfExists('criteria');
    }
};
