<?php

namespace Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Core\Interfaces\NotificationRepositoryInterface;

class NotificationController extends Controller
{
    protected $notificationRepo;
    protected $notificationService;

    public function __construct(NotificationRepositoryInterface $notificationRepo, \Modules\Core\Services\NotificationService $notificationService)
    {
        $this->notificationRepo = $notificationRepo;
        $this->notificationService = $notificationService;
    }

    public function markAsRead(Request $request, $id)
    {
        $this->notificationService->markAsRead($request->user(), $id);
        return back();
    }
}
