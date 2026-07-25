import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function Index({ auth, tariffs, angkatans }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        amount: '',
        type: 'spp',
        angkatan_id: '',
        auto_generate_date: ''
    });

    const openModal = (tariff = null) => {
        clearErrors();
        if (tariff) {
            setEditingId(tariff.id);
            setData({
                name: tariff.name,
                amount: tariff.amount,
                type: tariff.type,
                angkatan_id: tariff.angkatan_id || '',
                auto_generate_date: tariff.auto_generate_date || ''
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
            put(route('tariffs.update', editingId), { onSuccess: () => closeModal() });
        } else {
            post(route('tariffs.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus tarif ini?')) {
            destroy(route('tariffs.destroy', id));
        }
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Manajemen Tarif</h2>}>
            <Head title="Manajemen Tarif" />

            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                        <div className="p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daftar Tarif</h3>
                                <button onClick={() => openModal()} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 w-full md:w-auto rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                                    <PlusIcon className="w-5 h-5" /> Tambah Tarif
                                </button>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-[10px] md:text-sm text-slate-500 dark:text-slate-400">
                                    <thead className="text-[10px] md:text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                                        <tr>
                                            <th className="px-2 py-2 md:px-4 md:py-3 rounded-tl-xl">Nama Tarif</th>
                                            <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Nominal</th>
                                            <th className="hidden md:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Jenis</th>
                                            <th className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Angkatan</th>
                                            <th className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Tgl. Tagih</th>
                                            <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 rounded-tr-xl text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tariffs.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">Belum ada data tarif.</td>
                                            </tr>
                                        ) : (
                                            tariffs.map((t) => (
                                                <tr key={t.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-2 py-2 md:px-4 md:py-3 font-bold text-slate-800 dark:text-white min-w-[120px] leading-tight">
                                                        <div>{t.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-normal md:hidden mt-1">
                                                            <span className="uppercase font-semibold">{t.type}</span> <span className="sm:hidden">• Angkatan: {t.angkatan?.name || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 font-semibold text-slate-700 dark:text-slate-200">{formatRupiah(t.amount)}</td>
                                                    <td className="hidden md:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3 uppercase">{t.type}</td>
                                                    <td className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">{t.angkatan?.name || '-'}</td>
                                                    <td className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">{t.auto_generate_date ? `Tgl ${t.auto_generate_date}` : '-'}</td>
                                                    <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                                                        <div className="flex flex-col sm:flex-row items-end justify-end gap-1.5">
                                                            <button onClick={() => openModal(t)} className="flex items-center justify-center text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 p-1 md:p-1.5 rounded-md md:rounded-lg transition-colors">
                                                                <PencilSquareIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(t.id)} className="flex items-center justify-center text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 p-1 md:p-1.5 rounded-md md:rounded-lg transition-colors">
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
                                {editingId ? 'Edit Tarif' : 'Tambah Tarif'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Tarif</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Contoh: SPP Kelas X 2026" />
                                    {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nominal (Rp)</label>
                                    <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                    {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Jenis Tarif</label>
                                    <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                                        <option value="spp">SPP Bulanan</option>
                                        <option value="gedung">Uang Gedung</option>
                                        <option value="seragam">Seragam</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                    {errors.type && <p className="text-rose-500 text-xs mt-1">{errors.type}</p>}
                                </div>
                                <div>
                                                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Angkatan (Opsional)</label>
                                                                        <select value={data.angkatan_id} onChange={e => setData('angkatan_id', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                                                                            <option value="">-- Pilih Angkatan --</option>
                                                                            {angkatans?.map(a => (
                                                                                <option key={a.id} value={a.id}>{a.name} {a.year ? `(${a.year})` : ''}</option>
                                                                            ))}
                                                                        </select>
                                                                        {errors.angkatan_id && <p className="text-rose-500 text-xs mt-1">{errors.angkatan_id}</p>}
                                                                    </div>

                                {data.type === 'spp' && (
                                    <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl border border-teal-100 dark:border-teal-900/50 mt-4">
                                        <label className="block text-sm font-semibold text-teal-800 dark:text-teal-300 mb-1">Tanggal Tagihan Muncul (1-28)</label>
                                        <p className="text-xs text-teal-600 dark:text-teal-400 mb-2">Tanggal berapa tagihan SPP otomatis muncul untuk angkatan ini setiap bulannya?</p>
                                        <input type="number" min="1" max="28" value={data.auto_generate_date} onChange={e => setData('auto_generate_date', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Contoh: 1 (Kosong = ikut pengaturan global)" />
                                        {errors.auto_generate_date && <p className="text-rose-500 text-xs mt-1">{errors.auto_generate_date}</p>}
                                    </div>
                                )}

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
