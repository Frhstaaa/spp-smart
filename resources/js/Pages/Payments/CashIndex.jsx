import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon, MagnifyingGlassIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function CashIndex({ auth, pendingBills }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBill, setSelectedBill] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        bill_id: '',
        amount_paid: ''
    });

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('id-ID', { month: 'long' });
    };

    const filteredBills = pendingBills.filter(bill => {
        const query = searchQuery.toLowerCase();
        return bill.student?.name?.toLowerCase().includes(query) || 
               bill.student?.nis?.toLowerCase().includes(query);
    });

    const handleSelectBill = (bill) => {
        setSelectedBill(bill);
        setData({
            bill_id: bill.id,
            amount_paid: bill.amount
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.cashStore'), {
            onSuccess: () => {
                setSelectedBill(null);
                reset();
                setSearchQuery('');
            }
        });
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Kasir Pembayaran Tunai</h2>}>
            <Head title="Kasir Tunai" />

            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Search & List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-6 w-6 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-4 rounded-2xl border-slate-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                                    placeholder="Cari nama siswa atau NIS..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {filteredBills.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500">
                                        Tidak ada tagihan tertunggak yang cocok dengan pencarian Anda.
                                    </div>
                                ) : (
                                    filteredBills.map((bill) => (
                                        <div 
                                            key={bill.id}
                                            onClick={() => handleSelectBill(bill)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedBill?.id === bill.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-100 dark:border-slate-700/50 hover:border-teal-200 bg-white dark:bg-slate-800'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">{bill.student?.name}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">NIS: {bill.student?.nis} • Kelas: {bill.student?.school_class?.name || '-'}</p>
                                                    <div className="mt-2 inline-block bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                        {bill.tariff?.name} ({getMonthName(bill.month)} {bill.year})
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-rose-500 font-bold mb-1">PENDING</p>
                                                    <p className="font-extrabold text-xl text-slate-800 dark:text-white">{formatRupiah(bill.amount)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-700 text-white sticky top-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <BanknotesIcon className="w-6 h-6 text-teal-400" />
                                Proses Pembayaran
                            </h3>

                            {selectedBill ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="p-4 bg-slate-700/50 rounded-2xl">
                                        <p className="text-sm text-slate-400 mb-1">Siswa</p>
                                        <p className="font-bold text-lg">{selectedBill.student?.name}</p>
                                        
                                        <div className="mt-4 pt-4 border-t border-slate-600">
                                            <p className="text-sm text-slate-400 mb-1">Pembayaran Untuk</p>
                                            <p className="font-semibold">{selectedBill.tariff?.name}</p>
                                            <p className="text-sm text-slate-300">Bulan: {getMonthName(selectedBill.month)} {selectedBill.year}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-1">Total Harus Dibayar</label>
                                        <div className="text-3xl font-black text-teal-400 mb-4">
                                            {formatRupiah(selectedBill.amount)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-1">Uang Diterima (Rp)</label>
                                        <input 
                                            type="number" 
                                            value={data.amount_paid} 
                                            onChange={e => setData('amount_paid', e.target.value)} 
                                            className="w-full text-2xl font-bold rounded-xl border-slate-600 bg-slate-900 text-white focus:border-teal-400 focus:ring-teal-400"
                                            required
                                        />
                                        {errors.amount_paid && <p className="text-rose-400 text-xs mt-1">{errors.amount_paid}</p>}
                                    </div>

                                    {data.amount_paid && (data.amount_paid - selectedBill.amount > 0) && (
                                        <div className="p-4 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                                            <p className="text-sm">Kembalian:</p>
                                            <p className="font-bold text-xl">{formatRupiah(data.amount_paid - selectedBill.amount)}</p>
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={processing} 
                                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-lg rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {processing ? 'Memproses...' : 'Terima Pembayaran'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-600 rounded-2xl text-slate-400">
                                    <CurrencyDollarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Pilih salah satu tagihan di daftar sebelah kiri untuk mulai memproses pembayaran tunai.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
