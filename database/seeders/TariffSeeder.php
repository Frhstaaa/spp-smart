<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tariff;
use App\Models\Angkatan;

class TariffSeeder extends Seeder
{
    public function run()
    {
        $a2024 = Angkatan::where('year', '2024/2025')->first();
        if ($a2024) Tariff::create(['name' => 'SPP Angkatan 2024/2025', 'amount' => 200000, 'type' => 'spp', 'angkatan_id' => $a2024->id, 'auto_generate_date' => 10]);

        $a2025 = Angkatan::where('year', '2025/2026')->first();
        if ($a2025) Tariff::create(['name' => 'SPP Angkatan 2025/2026', 'amount' => 250000, 'type' => 'spp', 'angkatan_id' => $a2025->id, 'auto_generate_date' => 10]);

        $a2026 = Angkatan::where('year', '2026/2027')->first();
        if ($a2026) Tariff::create(['name' => 'SPP Angkatan 2026/2027', 'amount' => 300000, 'type' => 'spp', 'angkatan_id' => $a2026->id, 'auto_generate_date' => 10]);
    }
}
