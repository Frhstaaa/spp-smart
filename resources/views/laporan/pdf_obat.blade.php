<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Stok Obat</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table, th, td { border: 1px solid black; }
        th, td { padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-danger { color: red; font-weight: bold; }
        /* Fallback print styles if dompdf fails */
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body @isset($e) onload="window.print()" @endisset>
    @isset($e)
    <div class="no-print" style="background: #ffebee; color: #c62828; padding: 10px; margin-bottom: 10px; border: 1px solid #c62828;">
        <strong>Perhatian:</strong> PDF Generator gagal berjalan. Menggunakan mode HTML Print.
    </div>
    @endisset

    @php
        $namaApotek = \App\Models\Setting::where('key', 'nama_apotek')->value('value') ?? 'APOTEK';
    @endphp
    <div class="header">
        <h2>LAPORAN STOK OBAT {{ strtoupper($namaApotek) }}</h2>
        <p>Tanggal Cetak: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-center">No</th>
                <th>ID Obat</th>
                <th>Nama Obat</th>
                <th>Kategori</th>
                <th>Deskripsi Singkat</th>
                <th class="text-right">Harga Satuan (Rp)</th>
                <th class="text-center">Sisa Stok</th>
            </tr>
        </thead>
        <tbody>
            @foreach($obats as $index => $o)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $o->Id_Obat }}</td>
                <td>{{ $o->Nama }}</td>
                <td>{{ $o->Kategori ?? '-' }}</td>
                <td>{{ \Illuminate\Support\Str::limit($o->Deskripsi ?? '-', 30) }}</td>
                <td class="text-right">{{ number_format($o->Harga, 0, ',', '.') }}</td>
                <td class="text-center {{ $o->Stock < 10 ? 'text-danger' : '' }}">{{ $o->Stock }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
