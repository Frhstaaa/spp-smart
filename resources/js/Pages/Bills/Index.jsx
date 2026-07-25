import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, CheckCircleIcon, XCircleIcon, TrashIcon, ChatBubbleOvalLeftEllipsisIcon, CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function Index({ auth, bills }) {
    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('id-ID', { month: 'long' });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus tagihan ini? (Hanya tagihan pending yang boleh dihapus)')) {
            router.delete(route('bills.destroy', id));
        }
    };

    const handleWA = (bill) => {
        const phone = bill.student?.parent_phone;
        if (!phone) {
            alert('Nomor HP Orang Tua tidak tersedia untuk siswa ini.');
            return;
        }
        
        let formattedPhone = phone;
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '62' + formattedPhone.substring(1);
        }
        
        const message = `Halo Bapak/Ibu, ini adalah pesan otomatis dari Admin Sekolah.\n\nKami menginformasikan bahwa tagihan *${bill.tariff?.name}* untuk bulan *${getMonthName(bill.month)} ${bill.year}* sebesar *${formatRupiah(bill.amount)}* atas nama siswa *${bill.student?.name}* (NIS: ${bill.student?.nis || '-'}) belum dibayarkan.\n\nMohon segera melakukan pembayaran agar anak Bapak/Ibu dapat terus mengikuti kegiatan dengan lancar. Abaikan pesan ini jika sudah membayar. Terima kasih.`;
        
        const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Daftar Tagihan</h2>}>
            <Head title="Daftar Tagihan" />

            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                        <div className="p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Semua Tagihan SPP & Lainnya</h3>
                                <Link href={route('bills.createAuto')} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 w-full md:w-auto rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                                    <PlusIcon className="w-5 h-5" /> Generate Tagihan Masal
                                </Link>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                    <thead className="text-[8px] sm:text-[10px] md:text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                                        <tr>
                                            <th className="px-1 py-1.5 sm:px-4 md:px-8 md:py-4 rounded-tl-xl">Siswa</th>
                                            <th className="hidden sm:table-cell whitespace-nowrap px-1 py-1.5 sm:px-4 md:px-6 md:py-4">Bulan</th>
                                            <th className="hidden md:table-cell px-1 py-1.5 sm:px-4 md:px-6 md:py-4">Tarif</th>
                                            <th className="whitespace-nowrap px-1 py-1.5 sm:px-4 md:px-6 md:py-4 text-right">Nominal</th>
                                            <th className="whitespace-nowrap px-1 py-1.5 sm:px-4 md:px-6 md:py-4 text-center">Status</th>
                                            <th className="whitespace-nowrap px-1 py-1.5 sm:px-4 md:px-8 md:py-4 rounded-tr-xl text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bills.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">Belum ada data tagihan.</td>
                                            </tr>
                                        ) : (
                                            bills.map((b) => (
                                                <tr key={b.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-1 py-1.5 sm:px-4 md:px-8 md:py-4 max-w-[120px] sm:max-w-none">
                                                        <div className="font-bold text-slate-800 dark:text-white leading-tight truncate sm:whitespace-normal text-[10px] sm:text-sm">{b.student?.name}</div>
                                                        <div className="text-[8px] md:text-xs text-slate-400 mt-0.5 truncate sm:whitespace-normal leading-tight">{b.student?.school_class?.name || '-'} • {b.student?.nis}</div>
                                                        <div className="text-[8px] text-slate-500 font-medium sm:hidden mt-0.5 truncate leading-tight">{getMonthName(b.month)} {b.year} • {b.tariff?.name}</div>
                                                    </td>
                                                    <td className="hidden sm:table-cell whitespace-nowrap px-1 py-1.5 sm:px-4 md:px-6 md:py-4">
                                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{getMonthName(b.month)}</span> <span className="text-slate-500">{b.year}</span>
                                                    </td>
                                                    <td className="hidden md:table-cell px-1 py-1.5 sm:px-4 md:px-6 md:py-4 text-slate-600 dark:text-slate-300 min-w-[120px] leading-tight break-all">
                                                        {b.tariff?.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-1 py-1.5 sm:px-4 md:px-6 md:py-4 font-mono font-semibold text-slate-700 dark:text-slate-200 text-right text-[9px] sm:text-xs md:text-sm">
                                                        {formatRupiah(b.amount)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-1 py-1.5 sm:px-4 md:px-6 md:py-4 text-center">
                                                        {b.status === 'paid' ? (
                                                            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold inline-flex items-center gap-0.5 sm:gap-1">
                                                                <CheckBadgeIcon className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> <span className="leading-none">Lunas</span>
                                                            </span>
                                                        ) : (
                                                            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold inline-flex items-center gap-0.5 sm:gap-1">
                                                                <ClockIcon className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> <span className="leading-none">Belum Lunas</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-1 py-1.5 sm:px-4 md:px-8 md:py-4 text-center">
                                                        {b.status !== 'paid' && (
                                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2">
                                                                <button onClick={() => handleWA(b)} className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-0.5 sm:p-1.5 md:p-2 rounded-lg transition-colors inline-block" title="Kirim Tagihan via WA">
                                                                    <ChatBubbleOvalLeftEllipsisIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                                                </button>
                                                                <button onClick={() => handleDelete(b.id)} className="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 p-0.5 sm:p-1.5 md:p-2 rounded-lg transition-colors inline-block" title="Hapus Tagihan">
                                                                    <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                                                </button>
                                                            </div>
                                                        )}
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
