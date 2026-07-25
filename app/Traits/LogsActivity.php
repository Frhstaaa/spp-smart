<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Request;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            self::logAction($model, 'created', null, $model->getAttributes());
        });

        static::updated(function ($model) {
            $changes = $model->getChanges();
            $oldValues = array_intersect_key($model->getOriginal(), $changes);
            
            self::logAction($model, 'updated', $oldValues, $changes);
        });

        static::deleted(function ($model) {
            self::logAction($model, 'deleted', $model->getAttributes(), null);
        });
    }

    protected static function logAction($model, $action, $oldValues, $newValues)
    {
        // Don't log if running in console (e.g. tests) unless you want to
        // But since we want to be sure, let's just log it if auth()->id() is present
        // Or if it's CLI, maybe user_id is null. We'll allow null user_id (system actions)
        
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
