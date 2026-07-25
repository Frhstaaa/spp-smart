<?php

namespace App\Jobs;

use App\Services\FonnteService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWhatsAppMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Jumlah percobaan ulang jika gagal.
     */
    public int $tries = 3;

    /**
     * Timeout maksimal per percobaan (detik).
     */
    public int $timeout = 30;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly string $target,
        public readonly string $message,
        public readonly ?string $fileContent = null,
        public readonly ?string $filename = null,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(FonnteService $fonnteService): void
    {
        if ($this->fileContent && $this->filename) {
            $success = $fonnteService->sendFile($this->target, $this->message, $this->fileContent, $this->filename);
        } else {
            $success = $fonnteService->sendMessage($this->target, $this->message);
        }

        if (!$success) {
            Log::warning("SendWhatsAppMessage: Gagal kirim ke {$this->target}, mencoba ulang...");
            $this->release(60); // tunggu 60 detik sebelum retry
        } else {
            Log::info("SendWhatsAppMessage: Berhasil kirim ke {$this->target}");
        }
    }
}
