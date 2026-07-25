<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Obat;
use App\Models\DetailSupplying;
use App\Models\InventoryBatch;
use Illuminate\Support\Facades\DB;

class HppInitSeeder extends Seeder
{
    public function run()
    {
        DB::transaction(function () {
            $obats = Obat::all();
            
            foreach ($obats as $obat) {
                // Cari pembelian terakhir untuk mendapatkan harga modal kasar
                $latestSupply = DetailSupplying::where('Id_Obat', $obat->Id_Obat)
                                ->orderBy('created_at', 'desc')
                                ->first();
                
                // Gunakan Harga_Netto dari pembelian terakhir, atau default Harga beli perkiraan
                $hargaBeliKiraKira = $latestSupply ? $latestSupply->Harga_Netto : ($obat->Harga * 0.8);
                
                // Set Avg_HPP
                $obat->Avg_HPP = $hargaBeliKiraKira;
                $obat->save();
                
                // Buat Batch Awal
                if ($obat->Stock > 0) {
                    InventoryBatch::create([
                        'Id_Obat' => $obat->Id_Obat,
                        'No_Batch' => 'BATCH-INIT',
                        'Harga_Beli' => $hargaBeliKiraKira,
                        'Stok_Awal' => $obat->Stock,
                        'Stok_Sisa' => $obat->Stock,
                        'Tgl_Masuk' => now(),
                    ]);
                }
            }
        });
        
        echo "Data HPP Awal dan Inventory Batches berhasil diinisialisasi.\n";
    }
}
