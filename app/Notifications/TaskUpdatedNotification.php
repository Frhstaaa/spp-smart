<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\Task;
use App\Models\User;

class TaskUpdatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $task;
    public $actionBy;
    public $message;

    public function __construct(Task $task, User $actionBy, string $message)
    {
        $this->task = $task;
        $this->actionBy = $actionBy;
        $this->message = $message;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'action_by_id' => $this->actionBy->id,
            'action_by_name' => $this->actionBy->name,
            'message' => $this->message,
        ];
    }
}
