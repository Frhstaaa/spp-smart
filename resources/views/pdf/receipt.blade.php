<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Kuitansi Pembayaran #{{ $payment->transaction_id }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        .school-name { font-size: 24px; font-weight: bold; margin: 0; color: #4338ca; }
        .school-address { font-size: 12px; color: #666; margin-top: 5px; }
        .title { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 2px; }
        .info-table { width: 100%; margin-bottom: 30px; }
        .info-table td { padding: 5px; }
        .info-label { font-weight: bold; width: 120px; }
        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .details-table th, .details-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .details-table th { background-color: #f8fafc; font-weight: bold; }
        .amount-col { text-align: right !important; }
        .total-row { font-weight: bold; background-color: #f8fafc; }
        .footer { margin-top: 50px; text-align: right; }
        .signature-box { display: inline-block; text-align: center; width: 200px; }
        .signature-line { border-bottom: 1px solid #333; margin-top: 60px; margin-bottom: 5px; }
        .stamp { position: absolute; right: 50px; bottom: 80px; opacity: 0.1; font-size: 40px; border: 3px solid #f00; color: #f00; padding: 10px; transform: rotate(-15deg); border-radius: 10px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="school-name">{{ $settings['school_name'] ?? 'Sistem KAS Sekolah' }}</h1>
        <div class="school-address">{{ $settings['school_address'] ?? 'Alamat Sekolah Belum Diatur' }}</div>
    </div>

    <div class="title">Tanda Bukti Pembayaran</div>

    <table class="info-table">
        <tr>
            <td class="info-label">No. Transaksi</td>
            <td>: {{ $payment->transaction_id }}</td>
            <td class="info-label">Tanggal</td>
            <td>: {{ \Carbon\Carbon::parse($payment->payment_date)->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <td class="info-label">NIS / Nama</td>
            <td>: {{ $payment->bill->student->nis }} / {{ $payment->bill->student->name }}</td>
            <td class="info-label">Metode</td>
            <td>: {{ strtoupper($payment->method) }}</td>
        </tr>
        <tr>
            <td class="info-label">Kelas</td>
            <td>: {{ $payment->bill->student->schoolClass->name ?? '-' }}</td>
            <td class="info-label">Status</td>
            <td>: <strong>{{ strtoupper($payment->status) }}</strong></td>
        </tr>
    </table>

    <table class="details-table">
        <thead>
            <tr>
                <th>No.</th>
                <th>Deskripsi Tagihan</th>
                <th class="amount-col">Nominal</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>{{ $payment->bill->tariff->name }} (Bulan {{ date('F', mktime(0, 0, 0, $payment->bill->month, 10)) }} {{ $payment->bill->year }})</td>
                <td class="amount-col">Rp {{ number_format($payment->amount, 0, ',', '.') }}</td>
            </tr>
            <tr class="total-row">
                <td colspan="2" style="text-align: right">TOTAL PEMBAYARAN</td>
                <td class="amount-col">Rp {{ number_format($payment->amount, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <div style="font-style: italic; color: #666;">
        Terbilang: <strong>{{ ucwords((new \NumberFormatter("id", \NumberFormatter::SPELLOUT))->format($payment->amount)) }} Rupiah</strong>
    </div>

    @if($payment->status === 'success')
    <div class="stamp">LUNAS</div>
    @endif

    <div class="footer">
        <div class="signature-box">
            <div>Petugas / Kasir</div>
            <div class="signature-line"></div>
            <div>{{ $payment->approvedBy->name ?? 'Sistem Auto' }}</div>
        </div>
    </div>
</body>
</html>
