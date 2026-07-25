import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, students, filters, classes }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [classId, setClassId] = useState(filters?.class_id || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            // Only fire if the filters actually changed, otherwise initial render might trigger it
            if (search !== (filters?.search || '') || classId !== (filters?.class_id || '')) {
                router.get(route('students.index'), { search, class_id: classId }, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search, classId]);
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data siswa ini beserta akunnya?')) {
            router.delete(route('students.destroy', id));
        }
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Manajemen Siswa</h2>}>
            <Head title="Manajemen Siswa" />

            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                        <div className="p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daftar Siswa</h3>
                                
                                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto flex-1 justify-end">
                                    <div className="relative w-full md:w-64">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-700 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors text-slate-900 dark:text-slate-100"
                                            placeholder="Cari nama, NIS, NIK..."
                                        />
                                    </div>
                                    
                                    <select
                                        value={classId}
                                        onChange={(e) => setClassId(e.target.value)}
                                        className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
                                    >
                                        <option value="">Semua Kelas</option>
                                        {classes && classes.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <Link href={route('students.create')} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 w-full md:w-auto rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shrink-0">
                                    <PlusIcon className="w-5 h-5" /> Tambah Siswa
                                </Link>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-[10px] md:text-sm text-slate-500 dark:text-slate-400">
                                    <thead className="text-[10px] md:text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                                        <tr>
                                            <th className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3 rounded-tl-xl">NIS / NIK</th>
                                            <th className="px-2 py-2 md:px-4 md:py-3 rounded-tl-xl sm:rounded-none">Nama & Gender</th>
                                            <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Kelas</th>
                                            <th className="hidden lg:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Orang Tua</th>
                                            <th className="hidden md:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Info Kontak</th>
                                            <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 rounded-tr-xl text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">Belum ada data siswa.</td>
                                            </tr>
                                        ) : (
                                            students.map((s) => (
                                                <tr key={s.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3 font-mono text-slate-500">
                                                        <div className="font-semibold">{s.nis}</div>
                                                        <div className="text-[10px] text-slate-400">NIK: {s.nik || '-'}</div>
                                                    </td>
                                                    <td className="px-2 py-2 md:px-4 md:py-3 font-semibold text-slate-700 dark:text-slate-200 min-w-[120px] leading-tight">
                                                        <div className="flex items-center gap-1.5">
                                                            {s.name}
                                                            {s.gender && (
                                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${s.gender === 'L' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'}`}>
                                                                    {s.gender}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-normal sm:hidden mt-1">NIS: {s.nis} | NIK: {s.nik || '-'}</div>
                                                        <div className="text-[10px] text-slate-400 font-normal lg:hidden mt-0.5">Wali: {s.father_name || s.mother_name || s.guardian_name || '-'}</div>
                                                        <div className="text-[10px] text-slate-400 font-normal md:hidden mt-0.5">WA: {s.parent_phone || '-'} | {s.user?.email || '-'}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 text-slate-600 dark:text-slate-300">
                                                        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded-md text-[9px] md:text-xs font-semibold">
                                                            {s.school_class?.name || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="hidden lg:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3 text-slate-600 dark:text-slate-300">
                                                        <div className="text-xs">
                                                            <span className="text-slate-400 text-[10px]">Ayah:</span> {s.father_name || '-'}
                                                        </div>
                                                        <div className="text-xs mt-0.5">
                                                            <span className="text-slate-400 text-[10px]">Ibu:</span> {s.mother_name || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="hidden md:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3 text-slate-500 text-[10px] md:text-xs">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-slate-400 text-[10px]">WA:</span> {s.parent_phone || '-'}
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <span className="text-slate-400 text-[10px]">@:</span> {s.user?.email || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                                                        <div className="flex flex-col sm:flex-row items-end justify-end gap-1.5">
                                                            <Link href={route('students.edit', s.id)} className="flex items-center justify-center text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 p-1 md:p-1.5 rounded-md md:rounded-lg transition-colors">
                                                                <PencilSquareIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                            </Link>
                                                            <button onClick={() => handleDelete(s.id)} className="flex items-center justify-center text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 p-1 md:p-1.5 rounded-md md:rounded-lg transition-colors">
                                                                <TrashIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
