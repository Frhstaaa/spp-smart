<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Struk Penjualan - {{ $penjualan->Id_Penjualan }}</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 10px;
            width: 58mm; /* Standard thermal printer width */
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .divider {
            border-bottom: 1px dashed #000;
            margin: 5px 0;
        }
        .header h1 {
            font-size: 16px;
            margin: 0 0 5px 0;
        }
        .header p {
            margin: 0;
            font-size: 10px;
        }
        .details, .items, .totals {
            width: 100%;
            margin-bottom: 5px;
            font-size: 10px;
        }
        .items table {
            width: 100%;
            border-collapse: collapse;
        }
        .items th, .items td {
            text-align: left;
            padding: 2px 0;
        }
        .totals {
            display: flex;
            flex-direction: column;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
        }
        .footer {
            margin-top: 10px;
            font-size: 10px;
        }
    </style>
</head>
<body onload="window.print()">
    @php
        $namaApotek = \App\Models\Setting::where('key', 'nama_apotek')->value('value') ?? 'APOTEK APP';
        $alamatApotek = \App\Models\Setting::where('key', 'alamat_apotek')->value('value') ?? 'Alamat Belum Diatur';
        $telpApotek = \App\Models\Setting::where('key', 'telepon_apotek')->value('value') ?? '-';
    @endphp
    <div class="header text-center">
        <h1>{{ $namaApotek }}</h1>
        <p>{{ $alamatApotek }}</p>
        <p>Telp: {{ $telpApotek }}</p>
    </div>
    
    <div class="divider"></div>

    <div class="details">
        <div>No   : {{ $penjualan->Id_Penjualan }}</div>
        <div>Tgl  : {{ \Carbon\Carbon::parse($penjualan->Tanggal)->format('d-m-Y H:i') }}</div>
        <div>Kasir: {{ $penjualan->karyawan->Nama ?? '-' }}</div>
        <div>Plgn : {{ $penjualan->Id_Pelanggan ? $penjualan->pelanggan->Nama : ($penjualan->Nama_Pelanggan_Manual ?? 'Umum') }}</div>
    </div>

    <div class="divider"></div>

    <div class="items">
        <table>
            @foreach($penjualan->detailPenjualans as $detail)
            <tr>
                <td colspan="3" class="font-bold">{{ $detail->obat->Nama ?? 'Obat' }}</td>
            </tr>
            <tr>
                <td>{{ $detail->Jumlah }}x</td>
                <td>{{ number_format($detail->Harga_Satuan, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($detail->Subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </table>
    </div>

    <div class="divider"></div>

    <div class="totals text-right font-bold">
        <div class="totals-row">
            <span>Total:</span>
            <span>Rp {{ number_format($penjualan->Total, 0, ',', '.') }}</span>
        </div>
    </div>

    <div class="divider"></div>

    <div class="footer text-center">
        @php
            $apoteker = \App\Models\JadwalApoteker::where('Is_Active', true)->first();
        @endphp
        @if($apoteker)
            <div style="margin-bottom: 5px;">
                <p style="font-size: 9px; font-weight: bold; margin-bottom: 2px;">Apoteker Penanggung Jawab:</p>
                <p style="font-size: 9px;">{{ $apoteker->Nama_Apoteker }}</p>
                <p style="font-size: 9px;">SIPA: {{ $apoteker->SIPA }}</p>
            </div>
            <div class="divider"></div>
        @endif
        <p>Terima Kasih</p>
        <p>Semoga Lekas Sembuh</p>
    </div>
</body>
</html>
