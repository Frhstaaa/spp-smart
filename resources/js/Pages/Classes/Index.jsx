import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, classes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        level: ''
    });

    const openModal = (schoolClass = null) => {
        clearErrors();
        if (schoolClass) {
            setEditingId(schoolClass.id);
            setData({
                name: schoolClass.name,
                level: schoolClass.level
            });
        } else {
            setEditingId(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => reset(), 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('classes.update', editingId), { onSuccess: () => closeModal() });
        } else {
            post(route('classes.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kelas ini?')) {
            destroy(route('classes.destroy', id));
        }
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Manajemen Kelas</h2>}>
            <Head title="Manajemen Kelas" />

            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                        <div className="p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daftar Kelas</h3>
                                <button onClick={() => openModal()} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 w-full md:w-auto rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                                    <PlusIcon className="w-5 h-5" /> Tambah Kelas
                                </button>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-[10px] md:text-sm text-slate-500 dark:text-slate-400">
                                    <thead className="text-[10px] md:text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                                        <tr>
                                            <th className="px-2 py-2 md:px-4 md:py-3 rounded-tl-xl">Nama Kelas</th>
                                            <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Tingkat/Angkatan</th>
                                            <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 rounded-tr-xl text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classes.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center text-slate-500">Belum ada data kelas.</td>
                                            </tr>
                                        ) : (
                                            classes.map((c) => (
                                                <tr key={c.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-2 py-2 md:px-4 md:py-3 font-bold text-slate-800 dark:text-white min-w-[120px] leading-tight">{c.name}</td>
                                                    <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">{c.level}</td>
                                                    <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                                                        <div className="flex flex-col sm:flex-row items-end justify-end gap-1.5">
                                                            <button onClick={() => openModal(c)} className="flex items-center justify-center text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 p-1 md:p-1.5 rounded-md md:rounded-lg transition-colors">
                                                                <PencilSquareIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(c.id)} className="flex items-center justify-center text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 p-1 md:p-1.5 rounded-md md:rounded-lg transition-colors">
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

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl p-4 md:p-8 w-full max-w-md shadow-2xl relative"
                        >
                            <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                                {editingId ? 'Edit Kelas' : 'Tambah Kelas'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Kelas</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Contoh: 10-IPA-1" />
                                    {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tingkat/Angkatan</label>
                                    <input type="text" value={data.level} onChange={e => setData('level', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Contoh: X, XI, XII atau 2026" />
                                    {errors.level && <p className="text-rose-500 text-xs mt-1">{errors.level}</p>}
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                                    <button type="submit" disabled={processing} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
