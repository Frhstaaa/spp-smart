import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import { appConfirm } from '@/Components/Organisms/GlobalConfirm';

const ROLE_LABELS = {
    yayasan: 'Yayasan / Kepsek',
    tata_usaha: 'Admin TU',
    siswa: 'Siswa / Orang Tua',
};

const ROLE_COLORS = {
    yayasan: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    tata_usaha: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
    siswa: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
};

export default function Index({ auth, users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'all');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== filters.search || role !== filters.role) {
                router.get(
                    route('users.index'),
                    { search, role },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, role]);

    const handleDelete = (id) => {
        appConfirm(
            'Apakah Anda yakin ingin menghapus pengguna ini? Semua data yang terkait mungkin akan hilang.',
            () => {
                router.delete(route('users.destroy', id), {
                    preserveScroll: true
                });
            }
        );
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Manajemen Pengguna</h2>}>
            <Head title="Manajemen Pengguna" />

            <div className="py-2 md:py-8">
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 md:max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="Cari nama atau email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FunnelIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <select
                                    className="block w-full pl-10 pr-8 py-2.5 rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="all">Semua Role</option>
                                    <option value="tata_usaha">Admin TU</option>
                                    <option value="yayasan">Yayasan / Kepsek</option>
                                    <option value="siswa">Siswa / Orang Tua</option>
                                </select>
                            </div>
                        </div>
                        <Link
                            href={route('users.create')}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 border border-transparent rounded-xl font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Tambah Pengguna
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[10px] md:text-sm whitespace-nowrap">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-2 py-2 md:px-6 md:py-4">Nama Lengkap</th>
                                        <th className="px-2 py-2 md:px-6 md:py-4">Email</th>
                                        <th className="px-2 py-2 md:px-6 md:py-4">Role</th>
                                        <th className="px-2 py-2 md:px-6 md:py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                                Tidak ada pengguna yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map(user => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                                <td className="px-2 py-2 md:px-6 md:py-4 text-slate-800 dark:text-slate-200 font-medium">
                                                    {user.name}
                                                    {auth.user.id === user.id && <span className="ml-2 text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500">(Anda)</span>}
                                                </td>
                                                <td className="px-2 py-2 md:px-6 md:py-4 text-slate-600 dark:text-slate-400">
                                                    {user.email}
                                                </td>
                                                <td className="px-2 py-2 md:px-6 md:py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-700'}`}>
                                                        {ROLE_LABELS[user.role] || user.role}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 md:px-6 md:py-4 text-right">
                                                    <div className="flex flex-col sm:flex-row justify-end items-end gap-1.5">
                                                        <Link
                                                            href={route('users.edit', user.id)}
                                                            className="flex items-center justify-center p-1 md:p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md md:rounded-xl transition-colors"
                                                            title="Edit"
                                                        >
                                                            <PencilSquareIcon className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                                        </Link>
                                                        {auth.user.id !== user.id && (
                                                            <button
                                                                onClick={() => handleDelete(user.id)}
                                                                className="flex items-center justify-center p-1 md:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md md:rounded-xl transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <TrashIcon className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                                            </button>
                                                        )}
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
