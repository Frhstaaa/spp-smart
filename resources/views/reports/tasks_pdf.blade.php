<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #6366f1;
            padding-bottom: 15px;
        }
        .header h2 {
            margin: 0 0 5px 0;
            color: #4f46e5;
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header p {
            margin: 0;
            color: #6b7280;
            font-size: 12px;
        }
        .meta {
            margin-bottom: 20px;
            font-size: 11px;
            color: #4b5563;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 8px 10px;
            border: 1px solid #e5e7eb;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
        }
        tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-pending { background-color: #fef3c7; color: #d97706; }
        .badge-in_progress { background-color: #dbeafe; color: #2563eb; }
        .badge-review { background-color: #e0e7ff; color: #4f46e5; }
        .badge-completed { background-color: #d1fae5; color: #059669; }
        .badge-overdue { background-color: #fee2e2; color: #dc2626; }
        
        .badge-low { background-color: #f3f4f6; color: #4b5563; }
        .badge-medium { background-color: #ffedd5; color: #ea580c; }
        .badge-high { background-color: #fee2e2; color: #dc2626; }
        
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 9px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>{{ $title }}</h2>
        <p>Laporan Resmi Aktivitas & Progres Kerja Karyawan</p>
    </div>

    <div class="meta">
        <strong>Tanggal Cetak:</strong> {{ date('d F Y H:i:s') }} <br>
        <strong>Total Tugas:</strong> {{ count($tasks) }} tugas
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">ID</th>
                <th style="width: 25%;">Judul Tugas</th>
                <th style="width: 12%;">Kategori</th>
                <th style="width: 10%;">Prioritas</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 15%;">Pelaksana</th>
                <th style="width: 10%;">Tenggat</th>
                <th style="width: 8%;">Progres</th>
            </tr>
        </thead>
        <tbody>
            @foreach($tasks as $task)
                <tr>
                    <td>{{ $task->id }}</td>
                    <td>
                        <strong>{{ $task->title }}</strong>
                    </td>
                    <td>{{ $task->category ? $task->category->name : '-' }}</td>
                    <td>
                        <span class="badge badge-{{ $task->priority }}">
                            {{ $task->priority }}
                        </span>
                    </td>
                    <td>
                        <span class="badge badge-{{ $task->status }}">
                            {{ str_replace('_', ' ', $task->status) }}
                        </span>
                    </td>
                    <td>{{ $task->assignedTo ? $task->assignedTo->name : '-' }}</td>
                    <td>{{ $task->due_date ? $task->due_date->format('d/m/Y') : '-' }}</td>
                    <td style="text-align: right; font-weight: bold;">{{ $task->progress_percent }}%</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Dokumen ini dibuat secara otomatis oleh Sistem Manajemen Tugas Karyawan TaskFlow &copy; {{ date('Y') }}.
    </div>

</body>
</html>
