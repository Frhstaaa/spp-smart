<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penjualan</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table, th, td { border: 1px solid black; }
        th, td { padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        /* Fallback print styles if dompdf fails */
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body @isset($e) onload="window.print()" @endisset>
    @isset($e)
    <div class="no-print" style="background: #ffebee; color: #c62828; padding: 10px; margin-bottom: 10px; border: 1px solid #c62828;">
        <strong>Perhatian:</strong> PDF Generator (DOMPDF) gagal berjalan di server ini (Error: {{ $e->getMessage() }}). 
        Oleh karena itu, sistem menggunakan mode HTML Print. Silakan gunakan fitur <strong>Save as PDF</strong> pada dialog print.
    </div>
    @endisset

    @php
        $namaApotek = \App\Models\Setting::where('key', 'nama_apotek')->value('value') ?? 'APOTEK';
    @endphp
    <div class="header">
        <h2>LAPORAN PENJUALAN {{ strtoupper($namaApotek) }}</h2>
        <p>Bulan: {{ \Carbon\Carbon::parse($bulan . '-01')->translatedFormat('F Y') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>ID Transaksi</th>
                <th>Tanggal</th>
                <th>Kasir</th>
                <th>Pelanggan</th>
                <th>Item Terjual</th>
                <th class="text-right">Total (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($penjualans as $index => $p)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $p->Id_Penjualan }}</td>
                <td>{{ $p->Tanggal }}</td>
                <td>{{ $p->karyawan->Nama ?? '-' }}</td>
                <td>{{ $p->pelanggan ? $p->pelanggan->Nama : ($p->Nama_Pelanggan_Manual ?? 'Umum') }}</td>
                <td>
                    <ul style="margin: 0; padding-left: 15px;">
                        @foreach($p->detailPenjualans as $d)
                            <li>{{ $d->obat->Nama ?? 'Obat' }} ({{ $d->Jumlah }}x)</li>
                        @endforeach
                    </ul>
                </td>
                <td class="text-right">{{ number_format($p->Total, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="6" class="text-right">TOTAL PENDAPATAN BULAN INI</th>
                <th class="text-right font-bold">{{ number_format($totalPendapatan, 0, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>
</body>
</html>
