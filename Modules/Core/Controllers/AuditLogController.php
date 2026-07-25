<?php

namespace Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->isYayasan() && !auth()->user()->isTataUsaha()) {
            abort(403, 'Unauthorized access to Audit Logs.');
        }

        $logs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(50)
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'user' => $log->user ? $log->user->name : 'System',
                    'action' => $log->action,
                    'model_type' => class_basename($log->model_type),
                    'model_id' => $log->model_id,
                    'old_values' => $log->old_values,
                    'new_values' => $log->new_values,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at->format('d/m/Y H:i:s'),
                ];
            });

        return Inertia::render('AuditLog/Index', [
            'logs' => $logs
        ]);
    }
}
