import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { 
    CheckBadgeIcon, 
    XCircleIcon, 
    ClockIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

const MONTHS = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Feb' },
    { id: 3, name: 'Mar' },
    { id: 4, name: 'Apr' },
    { id: 5, name: 'Mei' },
    { id: 6, name: 'Jun' },
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Ags' },
    { id: 9, name: 'Sep' },
    { id: 10, name: 'Okt' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Des' },
];

export default function Index({ auth, students, classes, angkatans, filters }) {
    const [year, setYear] = useState(filters.year || new Date().getFullYear());
    const [classId, setClassId] = useState(filters.class_id || 'all');
    const [angkatanId, setAngkatanId] = useState(filters.angkatan_id || 'all');
    const [search, setSearch] = useState(filters.search || '');

    // Debounced search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (
                year !== filters.year ||
                classId !== filters.class_id ||
                angkatanId !== filters.angkatan_id ||
                search !== filters.search
            ) {
                applyFilters();
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [year, classId, angkatanId, search]);

    const applyFilters = () => {
        router.get(
            route('monitoring.index'),
            { year, class_id: classId, angkatan_id: angkatanId, search },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'paid':
                return <CheckBadgeIcon className="w-5 h-5 text-emerald-500" title="Lunas" />;
            case 'pending':
                return <ClockIcon className="w-5 h-5 text-amber-500" title="Menunggu Konfirmasi" />;
            default:
                return <XCircleIcon className="w-5 h-5 text-rose-500" title="Belum Lunas" />;
        }
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Monitoring SPP</h2>}>
            <Head title="Monitoring SPP" />

            <div className="py-2 md:py-8">
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <FunnelIcon className="w-6 h-6 text-indigo-500" />
                                Filter Data
                            </h3>
                            <div className="relative w-full md:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                                    placeholder="Cari Siswa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tahun Tagihan</label>
                                <input
                                    type="number"
                                    className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Kelas</label>
                                <select
                                    className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                                    value={classId}
                                    onChange={(e) => setClassId(e.target.value)}
                                >
                                    <option value="all">Semua Kelas</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Angkatan</label>
                                <select
                                    className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                                    value={angkatanId}
                                    onChange={(e) => setAngkatanId(e.target.value)}
                                >
                                    <option value="all">Semua Angkatan</option>
                                    {angkatans.map(a => (
                                        <option key={a.id} value={a.id}>Angkatan {a.year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Matrix Table */}
                    <div className="flex justify-end mb-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                            Geser tabel ke kanan <ArrowRightIcon className="w-3 h-3" />
                        </span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left text-[10px] md:text-sm whitespace-nowrap">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-2 py-2 md:px-4 md:py-4 sticky left-0 z-10 bg-slate-50 dark:bg-slate-700/90 shadow-[1px_0_0_rgba(0,0,0,0.1)]">Nama Siswa</th>
                                        <th className="px-2 py-2 md:px-4 md:py-4">Kelas</th>
                                        {MONTHS.map(m => (
                                            <th key={m.id} className="px-2 py-2 md:px-3 md:py-4 text-center">{m.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={14} className="px-4 py-12 text-center text-slate-500">
                                                Tidak ada siswa yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map(student => (
                                            <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                                <td className="px-2 py-2 md:px-4 md:py-3 sticky left-0 z-10 bg-white dark:bg-slate-800 shadow-[1px_0_0_rgba(0,0,0,0.05)]">
                                                    <div className="font-bold text-slate-800 dark:text-white">{student.name}</div>
                                                    <div className="text-[10px] md:text-xs text-slate-500">{student.nis}</div>
                                                </td>
                                                <td className="px-2 py-2 md:px-4 md:py-3 text-slate-600 dark:text-slate-400">
                                                    {student.school_class?.name || '-'}
                                                </td>
                                                {MONTHS.map(m => {
                                                    const bill = student.bills.find(b => parseInt(b.month) === m.id);
                                                    return (
                                                        <td key={m.id} className="px-2 py-2 md:px-3 md:py-3 text-center">
                                                            {bill ? (
                                                                <div className="flex justify-center">
                                                                    {getStatusIcon(bill.status)}
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-300 dark:text-slate-600 font-bold">-</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-1.5"><CheckBadgeIcon className="w-4 h-4 text-emerald-500" /> Lunas</div>
                        <div className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4 text-amber-500" /> Menunggu Konfirmasi</div>
                        <div className="flex items-center gap-1.5"><XCircleIcon className="w-4 h-4 text-rose-500" /> Belum Lunas</div>
                        <div className="flex items-center gap-1.5"><span className="text-slate-300 font-bold">-</span> Tidak Ada Tagihan</div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
