<?php

namespace Modules\Core\Interfaces;

interface NotificationRepositoryInterface
{
    public function markAsRead($user, $notificationId);
}
