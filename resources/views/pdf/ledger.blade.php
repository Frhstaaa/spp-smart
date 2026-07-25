<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapor Keuangan - {{ $student->name }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        .school-name { font-size: 20px; font-weight: bold; margin: 0; color: #4338ca; }
        .title { text-align: center; font-size: 16px; font-weight: bold; margin: 15px 0; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 3px; }
        .info-label { font-weight: bold; width: 100px; }
        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
        .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .details-table th { background-color: #f8fafc; font-weight: bold; text-align: center; }
        .amount-col { text-align: right !important; }
        .status-paid { color: #15803d; font-weight: bold; }
        .status-unpaid { color: #b91c1c; font-weight: bold; }
        .summary-box { border: 1px solid #ddd; padding: 15px; background-color: #f8fafc; border-radius: 5px; width: 300px; float: right; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .clear { clear: both; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="school-name">{{ $settings['school_name'] ?? 'Sistem KAS Sekolah' }}</h1>
        <div>Laporan Rapor Keuangan Siswa</div>
    </div>

    <table class="info-table">
        <tr>
            <td class="info-label">Nama Siswa</td>
            <td>: {{ $student->name }}</td>
            <td class="info-label">Dicetak Pada</td>
            <td>: {{ now()->translatedFormat('d F Y H:i') }}</td>
        </tr>
        <tr>
            <td class="info-label">NIS / NISN</td>
            <td>: {{ $student->nis }} / {{ $student->nisn }}</td>
            <td class="info-label">Kelas</td>
            <td>: {{ $student->schoolClass->name ?? '-' }}</td>
        </tr>
    </table>

    <div class="title">Rincian Tagihan & Pembayaran</div>

    <table class="details-table">
        <thead>
            <tr>
                <th>No</th>
                <th>Jenis Tagihan</th>
                <th>Bulan/Tahun</th>
                <th>Tenggat (Due)</th>
                <th>Status</th>
                <th>Tgl Bayar</th>
                <th class="amount-col">Nominal</th>
            </tr>
        </thead>
        <tbody>
            @php 
                $totalPaid = 0; 
                $totalUnpaid = 0; 
            @endphp
            @foreach($bills as $index => $bill)
                @php
                    if($bill->status == 'paid') $totalPaid += $bill->amount;
                    else $totalUnpaid += $bill->amount;
                @endphp
                <tr>
                    <td style="text-align: center;">{{ $index + 1 }}</td>
                    <td>{{ $bill->tariff->name }}</td>
                    <td style="text-align: center;">{{ date('M', mktime(0, 0, 0, $bill->month, 10)) }} {{ $bill->year }}</td>
                    <td style="text-align: center;">{{ \Carbon\Carbon::parse($bill->due_date)->format('d/m/Y') }}</td>
                    <td style="text-align: center;">
                        @if($bill->status == 'paid')
                            <span class="status-paid">LUNAS</span>
                        @else
                            <span class="status-unpaid">BELUM BAYAR</span>
                        @endif
                    </td>
                    <td style="text-align: center;">
                        {{ $bill->payments->where('status', 'success')->first() ? \Carbon\Carbon::parse($bill->payments->where('status', 'success')->first()->payment_date)->format('d/m/Y') : '-' }}
                    </td>
                    <td class="amount-col">Rp {{ number_format($bill->amount, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary-box">
        <table style="width: 100%">
            <tr>
                <td>Total Sudah Dibayar</td>
                <td style="text-align: right; color: #15803d; font-weight: bold;">Rp {{ number_format($totalPaid, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Total Tunggakan</td>
                <td style="text-align: right; color: #b91c1c; font-weight: bold;">Rp {{ number_format($totalUnpaid, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>
    <div class="clear"></div>
</body>
</html>
