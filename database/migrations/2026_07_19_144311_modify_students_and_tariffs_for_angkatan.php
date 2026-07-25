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
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'angkatan_id')) {
                $table->foreignId('angkatan_id')->nullable()->constrained('angkatans')->onDelete('set null');
            }
            // Due to SQLite limitations with dropping columns that have foreign keys,
            // we will just leave spp_tariff_id as a legacy column and not drop it.
        });

        Schema::table('tariffs', function (Blueprint $table) {
            if (!Schema::hasColumn('tariffs', 'angkatan_id')) {
                $table->foreignId('angkatan_id')->nullable()->constrained('angkatans')->onDelete('cascade');
            }
            if (Schema::hasColumn('tariffs', 'level_applied')) {
                $table->dropColumn('level_applied');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->foreignId('spp_tariff_id')->nullable()->constrained('tariffs')->onDelete('set null');
            $table->dropForeign(['angkatan_id']);
            $table->dropColumn('angkatan_id');
        });

        Schema::table('tariffs', function (Blueprint $table) {
            $table->string('level_applied')->nullable();
            $table->dropForeign(['angkatan_id']);
            $table->dropColumn('angkatan_id');
        });
    }
};
