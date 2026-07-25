import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function Index({ auth, expenses }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        title: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        category: 'Operasional',
        description: ''
    });

    const openModal = (expense = null) => {
        clearErrors();
        if (expense) {
            setEditingId(expense.id);
            setData({
                title: expense.title,
                amount: expense.amount,
                expense_date: expense.expense_date,
                category: expense.category || 'Operasional',
                description: expense.description || ''
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
            put(route('expenses.update', editingId), { onSuccess: () => closeModal() });
        } else {
            post(route('expenses.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data pengeluaran ini?')) {
            destroy(route('expenses.destroy', id));
        }
    };

    const totalExpense = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Buku Kas Keluar (Pengeluaran)</h2>}>
            <Head title="Manajemen Pengeluaran" />

            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Summary Card */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-rose-500/30">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-white/20 rounded-2xl">
                                <BanknotesIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-rose-100 font-medium">Total Pengeluaran Kas</p>
                                <h3 className="text-3xl md:text-4xl font-black">{formatRupiah(totalExpense)}</h3>
                            </div>
                        </div>
                    </motion.div>

                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                        <div className="p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-700/50">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daftar Pengeluaran</h3>
                            <button onClick={() => openModal()} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 w-full md:w-auto rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-500/20">
                                <PlusIcon className="w-5 h-5" /> Catat Pengeluaran
                            </button>
                        </div>

                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left text-[10px] md:text-sm text-slate-500 dark:text-slate-400">
                                <thead className="text-[10px] md:text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                                    <tr>
                                        <th className="px-2 py-2 md:px-4 md:py-3 rounded-tl-xl">Tanggal</th>
                                        <th className="px-2 py-2 md:px-4 md:py-3">Judul Pengeluaran</th>
                                        <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Kategori</th>
                                        <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Nominal</th>
                                        <th className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Dicatat Oleh</th>
                                        <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 rounded-tr-xl text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-slate-500">Belum ada data pengeluaran.</td>
                                        </tr>
                                    ) : (
                                        expenses.map((expense) => (
                                            <tr key={expense.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">{new Date(expense.expense_date).toLocaleDateString('id-ID')}</td>
                                                <td className="px-2 py-2 md:px-4 md:py-3 font-bold text-slate-800 dark:text-white min-w-[120px]">
                                                    {expense.title}
                                                    {expense.description && <p className="text-[10px] font-normal text-slate-400 mt-0.5 truncate max-w-[200px]">{expense.description}</p>}
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs font-semibold">{expense.category}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 font-semibold text-rose-600 dark:text-rose-400">{formatRupiah(expense.amount)}</td>
                                                <td className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">{expense.user?.name || '-'}</td>
                                                <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                                                    <div className="flex flex-col sm:flex-row items-end justify-end gap-1.5">
                                                        <button onClick={() => openModal(expense)} className="flex items-center justify-center text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 p-1 md:p-1.5 rounded-md md:rounded-lg transition-colors">
                                                            <PencilSquareIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(expense.id)} className="flex items-center justify-center text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-200 p-1 md:p-1.5 rounded-md md:rounded-lg transition-colors">
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-20">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl p-4 md:p-8 w-full max-w-lg shadow-2xl relative my-auto"
                        >
                            <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                                {editingId ? 'Edit Pengeluaran' : 'Catat Pengeluaran Baru'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul Pengeluaran</label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Contoh: Beli ATK Bulan Ini" />
                                    {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nominal (Rp)</label>
                                        <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanggal</label>
                                        <input type="date" value={data.expense_date} onChange={e => setData('expense_date', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.expense_date && <p className="text-rose-500 text-xs mt-1">{errors.expense_date}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                                    <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                                        <option value="Operasional">Operasional (ATK, Listrik, Air)</option>
                                        <option value="Kegiatan">Kegiatan Siswa/Sekolah</option>
                                        <option value="Pemeliharaan">Pemeliharaan (Gedung, Komputer)</option>
                                        <option value="Honor">Honor/Gaji</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan (Opsional)</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows="3" className="w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Rincian pengeluaran..." />
                                    {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
                                </div>
                                
                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                                    <button type="submit" disabled={processing} className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-500/30 disabled:opacity-50">
                                        {processing ? 'Menyimpan...' : 'Simpan Pengeluaran'}
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
