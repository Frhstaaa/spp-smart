<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.whatsapp.url', 'http://localhost:3000');
    }

    public function sendMessage($target, $message)
    {
        if (empty($target)) {
            return false;
        }

        try {
            // Using timeout so if bot is down, it doesn't hang the app for too long
            $response = Http::timeout(5)->post($this->baseUrl . '/api/send', [
                'target' => $target,
                'message' => $message
            ]);

            if ($response->successful()) {
                Log::info("WhatsApp API Success: Sent to $target");
                return true;
            } else {
                Log::error("WhatsApp API Error: " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("WhatsApp API Connection Error: " . $e->getMessage());
            return false;
        }
    }

    public function sendReceipt($payment)
    {
        $student = $payment->bill->student;
        $parentPhone = $student->parent_phone;
        
        if (!$parentPhone) {
            return false;
        }

        $date = $payment->payment_date ? \Carbon\Carbon::parse($payment->payment_date)->format('d M Y H:i') : now()->format('d M Y H:i');
        $amount = number_format($payment->amount, 0, ',', '.');
        $monthStr = \Carbon\Carbon::create()->month($payment->bill->month)->locale('id')->monthName;
        
        $message = "✅ *PEMBAYARAN BERHASIL*\n\n";
        $message .= "Terima kasih, pembayaran KAS untuk siswa berikut telah kami terima:\n\n";
        $message .= "👤 *Nama Siswa*: {$student->name}\n";
        $message .= "📝 *Pembayaran*: {$payment->bill->tariff->name} ({$monthStr} {$payment->bill->year})\n";
        $message .= "💰 *Jumlah*: Rp {$amount}\n";
        $message .= "💳 *Metode*: " . strtoupper($payment->method) . "\n";
        $message .= "📅 *Tanggal*: {$date}\n";
        $message .= "🧾 *ID Transaksi*: {$payment->transaction_id}\n\n";
        $message .= "Untuk mengunduh struk resmi atau mengecek tagihan lainnya, silakan login ke aplikasi KAS kami.\n\n";
        $message .= "_Ini adalah pesan otomatis dari sistem._";

        return $this->sendMessage($parentPhone, $message);
    }
    
    public function sendNewBill($bill)
    {
        $student = $bill->student;
        $parentPhone = $student->parent_phone;
        
        if (!$parentPhone) {
            return false;
        }
        
        $amount = number_format($bill->amount, 0, ',', '.');
        $monthStr = \Carbon\Carbon::create()->month($bill->month)->locale('id')->monthName;
        $dueDate = \Carbon\Carbon::parse($bill->due_date)->format('d M Y');
        
        $message = "🔔 *TAGIHAN BARU*\n\n";
        $message .= "Bapak/Ibu Orang Tua Wali,\n";
        $message .= "Terdapat tagihan baru untuk ananda:\n\n";
        $message .= "👤 *Nama Siswa*: {$student->name}\n";
        $message .= "📝 *Keterangan*: {$bill->tariff->name} ({$monthStr} {$bill->year})\n";
        $message .= "💰 *Jumlah*: Rp {$amount}\n";
        $message .= "⏳ *Jatuh Tempo*: {$dueDate}\n\n";
        $message .= "Silakan lakukan pembayaran melalui aplikasi KAS kami atau melalui Tata Usaha Sekolah.\n\n";
        $message .= "Terima kasih.\n";
        $message .= "_Ini adalah pesan otomatis dari sistem._";

        return $this->sendMessage($parentPhone, $message);
    }
}
