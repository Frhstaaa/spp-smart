import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ClockIcon, MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { appConfirm } from '@/Components/Organisms/GlobalConfirm';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function PendingIndex({ auth, pendingPayments }) {
    const [searchQuery, setSearchQuery] = useState('');
    
    const { post, processing } = useForm();

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('id-ID', { month: 'long' });
    };

    const filteredPayments = pendingPayments.filter(payment => {
        const query = searchQuery.toLowerCase();
        return payment.bill?.student?.name?.toLowerCase().includes(query) || 
               payment.bill?.student?.nis?.toLowerCase().includes(query) ||
               payment.transaction_id?.toLowerCase().includes(query);
    });

    const handleApprove = (payment) => {
        appConfirm(
            `Apakah Anda yakin ingin menyetujui pembayaran dari ${payment.bill?.student?.name} sebesar ${formatRupiah(payment.amount)}?`,
            () => {
                post(route('payments.approve', payment.id), { preserveScroll: true });
            }
        );
    };

    const handleReject = (payment) => {
        appConfirm(
            `Apakah Anda yakin ingin menolak pembayaran ini? Pembayaran akan ditandai sebagai gagal.`,
            () => {
                post(route('payments.reject', payment.id), { preserveScroll: true });
            }
        );
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Persetujuan Pembayaran</h2>}>
            <Head title="Menunggu Persetujuan" />

            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <ClockIcon className="w-6 h-6 text-amber-500" />
                                    Daftar Menunggu Persetujuan
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pembayaran digital oleh siswa yang perlu divalidasi oleh TU.</p>
                            </div>
                            <div className="relative w-full md:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                                    placeholder="Cari siswa atau No. Transaksi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Mobile View (Cards) */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {filteredPayments.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                    Tidak ada pembayaran yang menunggu persetujuan.
                                </div>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <div key={payment.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white text-sm">{payment.bill?.student?.name}</div>
                                                <div className="text-[10px] text-slate-500">{payment.bill?.student?.nis}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-extrabold text-slate-800 dark:text-white text-sm">{formatRupiah(payment.amount)}</div>
                                                <div className="uppercase font-bold text-slate-400 text-[9px] mt-0.5">{payment.method}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 dark:bg-slate-700/30 p-2.5 rounded-xl">
                                            <div>
                                                <span className="text-slate-400 block mb-0.5">Waktu:</span>
                                                <div className="font-semibold text-slate-700 dark:text-slate-300">
                                                    {new Date(String(payment.payment_date).replace(' ', 'T')).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block mb-0.5">Tagihan:</span>
                                                <div className="font-semibold text-slate-700 dark:text-slate-300 truncate">{payment.bill?.tariff?.name}</div>
                                                <div className="text-slate-500">{getMonthName(payment.bill?.month)} {payment.bill?.year}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 pt-1">
                                            <button 
                                                onClick={() => handleApprove(payment)}
                                                disabled={processing}
                                                className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-xl font-bold transition-colors text-xs"
                                            >
                                                <CheckCircleIcon className="w-4 h-4" /> Terima
                                            </button>
                                            <button 
                                                onClick={() => handleReject(payment)}
                                                disabled={processing}
                                                className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 rounded-xl font-bold transition-colors text-xs"
                                            >
                                                <XCircleIcon className="w-4 h-4" /> Tolak
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop View (Table) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200 dark:border-slate-700 text-sm">
                                    <tr>
                                        <th className="px-4 py-4">Waktu</th>
                                        <th className="px-4 py-4">Siswa</th>
                                        <th className="px-4 py-4">Untuk Tagihan</th>
                                        <th className="px-4 py-4">Metode & TRX</th>
                                        <th className="px-4 py-4 text-right">Nominal</th>
                                        <th className="px-4 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {filteredPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                                                Tidak ada pembayaran yang menunggu persetujuan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPayments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors text-sm">
                                                <td className="px-4 py-4">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                                        {new Date(String(payment.payment_date).replace(' ', 'T')).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-bold text-slate-800 dark:text-white">{payment.bill?.student?.name}</div>
                                                    <div className="text-xs text-slate-500">{payment.bill?.student?.nis}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-medium text-slate-700 dark:text-slate-300">{payment.bill?.tariff?.name}</div>
                                                    <div className="text-xs text-slate-500">
                                                        Bulan: {getMonthName(payment.bill?.month)} {payment.bill?.year}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="uppercase font-bold text-slate-600 dark:text-slate-300 text-xs tracking-wider">{payment.method}</div>
                                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{payment.transaction_id}</div>
                                                </td>
                                                <td className="px-4 py-4 text-right font-extrabold text-slate-800 dark:text-white">
                                                    {formatRupiah(payment.amount)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-row items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleApprove(payment)}
                                                            disabled={processing}
                                                            className="flex justify-center w-auto items-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 rounded-lg font-bold transition-colors text-xs"
                                                        >
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                            Terima
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReject(payment)}
                                                            disabled={processing}
                                                            className="flex justify-center w-auto items-center gap-1 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30 rounded-lg font-bold transition-colors text-xs"
                                                        >
                                                            <XCircleIcon className="w-4 h-4" />
                                                            Tolak
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
