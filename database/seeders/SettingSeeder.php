<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::updateOrCreate(
            ['key' => 'ppn_percentage'],
            ['value' => '11', 'description' => 'Tarif PPN (%) untuk faktur PBF']
        );
        Setting::updateOrCreate(
            ['key' => 'nama_apotek'],
            ['value' => 'Apotek ABC-VEN', 'description' => 'Nama Apotek']
        );
    }
}
