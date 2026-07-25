import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { DocumentArrowDownIcon, CalendarDaysIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function MyPayments({ auth, payments }) {
    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('id-ID', { month: 'long' });
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Riwayat Pembayaran</h2>}>
            <Head title="Riwayat Pembayaran" />

            <div className="py-2 md:py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 md:p-8 shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Daftar Kuitansi / Bukti Bayar</h3>
                            <Link href={route('siswa.bills')} className="text-teal-600 font-semibold hover:text-teal-700">Lihat Tagihan Pending</Link>
                        </div>

                        <div className="space-y-4">
                            {payments.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                                    <CalendarDaysIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Belum ada riwayat pembayaran.</h4>
                                    <p className="text-slate-500">Pembayaran yang telah lunas akan muncul di sini.</p>
                                </div>
                            ) : (
                                payments.map((payment, index) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={payment.id} 
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 hover:border-teal-200 transition-colors group"
                                    >
                                        <div className="flex items-center gap-5 mb-4 sm:mb-0">
                                            <div className={`p-4 rounded-2xl ${payment.method === 'cash' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                                                <CreditCardIcon className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-lg text-slate-800 dark:text-white mb-1">
                                                    {payment.bill?.tariff?.name}
                                                </h5>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-slate-500 font-medium">{new Date(String(payment.payment_date).replace(/ /g, "T")).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
                                                    <span className="text-sm text-slate-300">•</span>
                                                    <span className="text-xs font-bold text-slate-600 uppercase bg-slate-200 px-2 py-1 rounded-md">{payment.method}</span>
                                                    <span className="text-xs font-mono text-slate-400">Ref: {payment.transaction_id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                                            <span className="font-black text-2xl text-slate-800 dark:text-white">
                                                {formatRupiah(payment.amount)}
                                            </span>
                                            <Link href={route('siswa.receipt', payment.id)} className="p-3 text-teal-600 hover:bg-teal-50 rounded-xl transition-colors" title="Download Kuitansi (PDF)">
                                                <DocumentArrowDownIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
