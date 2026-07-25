<?php

namespace Modules\Core\Services;

use Modules\Core\Interfaces\NotificationRepositoryInterface;

class NotificationService
{
    protected $notificationRepo;

    public function __construct(NotificationRepositoryInterface $notificationRepo)
    {
        $this->notificationRepo = $notificationRepo;
    }

    public function markAsRead($user, $id)
    {
        return $this->notificationRepo->markAsRead($user, $id);
    }
}
