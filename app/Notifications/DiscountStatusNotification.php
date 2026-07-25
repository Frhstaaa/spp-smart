<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\DiscountRequest;

class DiscountStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $discountRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(DiscountRequest $discountRequest)
    {
        $this->discountRequest = $discountRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $statusText = $this->discountRequest->status === 'approved' ? 'disetujui' : 'ditolak';
        
        return [
            'discount_request_id' => $this->discountRequest->id,
            'message' => 'Pengajuan keringanan biaya Anda untuk tagihan bulan ' . $this->discountRequest->bill->month . ' ' . $this->discountRequest->bill->year . ' telah ' . $statusText . '.',
            'status' => $this->discountRequest->status,
        ];
    }
}
