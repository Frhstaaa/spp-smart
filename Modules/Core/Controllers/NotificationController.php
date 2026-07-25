<?php

namespace Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Core\Interfaces\NotificationRepositoryInterface;

class NotificationController extends Controller
{
    protected $notificationRepo;

    public function __construct(NotificationRepositoryInterface $notificationRepo)
    {
        $this->notificationRepo = $notificationRepo;
    }

    public function markAsRead(Request $request, $id)
    {
        $this->notificationRepo->markAsRead($request->user(), $id);
        return back();
    }
}
