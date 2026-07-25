<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Etiket Resep - {{ $resep->No_Resep }}</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 5px;
            width: 58mm; /* Thermal printer 58mm */
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
        }
        .header h1 { font-size: 14px; margin: 0 0 2px 0; }
        .header p { margin: 0; font-size: 9px; }
        
        .patient-info {
            font-size: 10px;
            margin-bottom: 5px;
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
        }
        
        .etiket-item {
            border: 1px solid #000;
            padding: 5px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        
        .etiket-title {
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            margin-bottom: 5px;
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
        }
        
        .etiket-rule {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
            text-transform: uppercase;
        }
        
        .etiket-notes {
            font-size: 10px;
            text-align: center;
            font-style: italic;
        }
        
        .doctor-info {
            font-size: 9px;
            text-align: right;
            margin-top: 5px;
        }
        .text-center { text-align: center; }
        .break-page { page-break-after: always; }
    </style>
</head>
<body>
    @php
        $namaApotek = \App\Models\Setting::where('key', 'nama_apotek')->value('value') ?? 'APOTEK APP';
        $telpApotek = \App\Models\Setting::where('key', 'telepon_apotek')->value('value') ?? '-';
    @endphp
    
    @if($resep->detailReseps->isEmpty())
        <div class="etiket-item">
            <div class="header">
                <h1>{{ $namaApotek }}</h1>
                <p>Telp: {{ $telpApotek }}</p>
            </div>
            <div class="text-center" style="padding: 20px 0;">
                <p>Tidak ada detail obat untuk resep ini.</p>
            </div>
        </div>
    @else
        @foreach($resep->detailReseps as $index => $detail)
        <div class="etiket-item">
            <div class="header">
                <h1>{{ $namaApotek }}</h1>
                <p>Telp: {{ $telpApotek }}</p>
            </div>
            
            <div class="patient-info">
                <div>No. Resep: {{ $resep->No_Resep }}</div>
                <div>Tgl: {{ \Carbon\Carbon::parse($resep->Tanggal)->format('d-m-Y') }}</div>
                <div>Pasien: <b>{{ $resep->pelanggan->Nama ?? $resep->Nama_Pasien }}</b></div>
            </div>

            <div class="etiket-title">
                {{ $detail->obat->Nama ?? 'Obat' }} (Qty: {{ $detail->Qty }})
            </div>
            
            <div class="etiket-rule">
                {{ $detail->Aturan_Pakai ?: 'Sesuai Petunjuk Dokter' }}
            </div>
            
            @if($detail->Keterangan_Tambahan)
            <div class="etiket-notes">
                * {{ $detail->Keterangan_Tambahan }}
            </div>
            @endif
            
            <div class="doctor-info">
                Resep Dr. {{ $resep->dokter->Nama_Lengkap ?? '-' }}
            </div>
        </div>
        
        @if(!$loop->last)
            <!-- <div class="break-page"></div> -->
        @endif
        @endforeach
    @endif

    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>
