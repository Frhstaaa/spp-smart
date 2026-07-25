<?php

namespace Modules\Core\Repositories;

use Modules\Core\Interfaces\NotificationRepositoryInterface;

class NotificationRepository implements NotificationRepositoryInterface
{
    public function markAsRead($user, $notificationId)
    {
        $notification = $user->notifications()->findOrFail($notificationId);
        $notification->markAsRead();
    }
}
