import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CreditCardIcon, CheckBadgeIcon, ClockIcon, ReceiptPercentIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/Atoms/InputLabel';
import TextInput from '@/Components/Atoms/TextInput';
import InputError from '@/Components/Atoms/InputError';
import PrimaryButton from '@/Components/Atoms/PrimaryButton';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function MyBills({ auth, bills }) {
    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('id-ID', { month: 'long' });
    };

    const pendingBills = bills.filter(b => b.status !== 'paid');

    const [selectedBill, setSelectedBill] = useState(null);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        discount_amount: '',
        reason: ''
    });

    const openDiscountModal = (bill) => {
        setSelectedBill(bill);
        setData({
            discount_amount: '',
            reason: ''
        });
        clearErrors();
    };

    const closeDiscountModal = () => {
        setSelectedBill(null);
        reset();
        clearErrors();
    };

    const submitDiscount = (e) => {
        e.preventDefault();
        post(route('siswa.requestDiscount', selectedBill.id), {
            preserveScroll: true,
            onSuccess: () => closeDiscountModal(),
        });
    };

    // Array 12 Bulan Tahun Ajaran (Juli - Juni)
    const academicMonths = [
        { month: 7, name: 'Juli' },
        { month: 8, name: 'Agustus' },
        { month: 9, name: 'September' },
        { month: 10, name: 'Oktober' },
        { month: 11, name: 'November' },
        { month: 12, name: 'Desember' },
        { month: 1, name: 'Januari' },
        { month: 2, name: 'Februari' },
        { month: 3, name: 'Maret' },
        { month: 4, name: 'April' },
        { month: 5, name: 'Mei' },
        { month: 6, name: 'Juni' },
    ];

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const startYear = currentMonth >= 7 ? currentYear : currentYear - 1;

    const getYearForMonth = (m) => {
        return m >= 7 ? startYear : startYear + 1;
    };

    const getBillStatus = (m, year) => {
        const bill = bills.find(b => parseInt(b.month) === m && parseInt(b.year) === year);
        if (!bill) return null; 
        return bill.status; 
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Tagihanku</h2>}>
            <Head title="Tagihan Saya" />

            <div className="py-2 md:py-8 pb-24">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Grid 12 Bulan */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/50 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Status Tagihan (12 Bulan)</h3>
                            <Link href={route('siswa.paySelection')} className="text-teal-600 font-bold hover:text-teal-700 flex items-center gap-1 text-sm">
                                <span>Bayar Tagihan</span>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {academicMonths.map(({ month, name }) => {
                                const year = getYearForMonth(month);
                                const status = getBillStatus(month, year);
                                
                                let statusColor = "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700";
                                let textColor = "text-slate-500 dark:text-slate-400";
                                let icon = null;

                                if (status === 'paid') {
                                    statusColor = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30";
                                    textColor = "text-emerald-700 dark:text-emerald-400 font-bold";
                                    icon = <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-1" />;
                                } else if (status === 'pending') {
                                    statusColor = "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30";
                                    textColor = "text-amber-700 dark:text-amber-400 font-bold";
                                    icon = <ClockIcon className="w-4 h-4 text-amber-500 mt-1" />;
                                } else if (status) {
                                    statusColor = "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/30";
                                    textColor = "text-rose-700 dark:text-rose-400 font-bold";
                                }

                                return (
                                    <div key={`${year}-${month}`} className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center ${statusColor}`}>
                                        <span className={`text-xs ${textColor}`}>{name}</span>
                                        <span className={`text-[10px] ${status ? textColor : 'text-slate-400'} opacity-70`}>{year}</span>
                                        {icon}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detail Tagihan Pending */}
                    {pendingBills.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckBadgeIcon className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Semua Tagihan Lunas!</h3>
                            <p className="text-slate-500">Terima kasih telah menyelesaikan seluruh kewajiban administrasi sekolah.</p>
                            <Link href={route('siswa.payments')} className="mt-6 inline-block bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold px-6 py-3 rounded-xl transition-colors">
                                Lihat Riwayat Pembayaran
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">
                                    <ClockIcon className="w-5 h-5" />
                                    Anda memiliki {pendingBills.length} tagihan yang belum dibayar.
                                </div>
                                <Link href={route('siswa.paySelection')} className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors hidden sm:block">
                                    Bayar Tagihan
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pendingBills.map((bill, index) => (
                                    <div 
                                        key={bill.id} 
                                        className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 px-3 py-1 rounded-lg text-xs font-bold uppercase">Belum Lunas</span>
                                                <span className="text-sm font-semibold text-slate-500">Jatuh Tempo: {new Date(String(bill.due_date).replace(/ /g, "T")).toLocaleDateString('id-ID')}</span>
                                            </div>
                                            
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{bill.tariff?.name}</h3>
                                            <p className="text-slate-500 text-sm mb-6">Bulan: {getMonthName(bill.month)} {bill.year}</p>
                                            
                                            <div className="text-4xl font-black text-slate-800 dark:text-white mb-8">
                                                {formatRupiah(bill.amount)}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {bill.payments && bill.payments.length > 0 ? (
                                                <div className="w-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold py-4 rounded-xl text-center border border-amber-200 dark:border-amber-800/30 flex items-center justify-center gap-2">
                                                    <ClockIcon className="w-6 h-6" />
                                                    Menunggu Konfirmasi TU
                                                </div>
                                            ) : (
                                                <Link 
                                                    href={route('siswa.paySelection')} 
                                                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-center"
                                                >
                                                    <CreditCardIcon className="w-6 h-6" />
                                                    Pilih Bulan untuk Dibayar
                                                </Link>
                                            )}
                                            
                                            {bill.discount_requests && bill.discount_requests.length > 0 ? (
                                                <div className="w-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm border border-amber-200 dark:border-amber-500/20">
                                                    <ClockIcon className="w-5 h-5" />
                                                    Pengajuan Keringanan Sedang Diproses
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => openDiscountModal(bill)}
                                                    className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <ReceiptPercentIcon className="w-5 h-5" />
                                                    Ajukan Keringanan
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* Modal Keringanan Biaya */}
            {typeof document !== 'undefined' && createPortal(
                selectedBill ? (
                    <>
                        <div 
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
                            onClick={closeDiscountModal}
                        />
                        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
                                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Ajukan Keringanan</h3>
                                        <p className="text-sm text-slate-500">{selectedBill.tariff?.name}</p>
                                    </div>
                                    <button onClick={closeDiscountModal} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-700 rounded-full shadow-sm transition-colors">
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="overflow-y-auto content-scroll">
                                    <form onSubmit={submitDiscount} className="p-5 sm:p-6 space-y-5 sm:space-y-6">
                                        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase mb-1">Total Tagihan Saat Ini</p>
                                            <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300">{formatRupiah(selectedBill.amount)}</p>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="discount_amount" value="Nominal Keringanan (Potongan) yg Diajukan" />
                                            <div className="relative mt-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-slate-500 font-medium">Rp</span>
                                                </div>
                                                <TextInput
                                                    id="discount_amount"
                                                    type="number"
                                                    className="block w-full pl-10"
                                                    value={data.discount_amount}
                                                    onChange={e => setData('discount_amount', e.target.value)}
                                                    placeholder="Contoh: 50000"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.discount_amount} className="mt-2" />
                                            <p className="text-xs text-slate-500 mt-1 leading-tight">Masukkan nominal potongan harga yang Anda harapkan (Bukan sisa tagihan).</p>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="reason" value="Alasan Pengajuan" />
                                            <textarea
                                                id="reason"
                                                className="mt-1 block w-full border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-xl shadow-sm"
                                                rows="3"
                                                value={data.reason}
                                                onChange={e => setData('reason', e.target.value)}
                                                placeholder="Ceritakan alasan Anda mengajukan keringanan biaya..."
                                                required
                                            ></textarea>
                                            <InputError message={errors.reason} className="mt-2" />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                            <button type="button" onClick={closeDiscountModal} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                Batal
                                            </button>
                                            <PrimaryButton disabled={processing} className="px-5 py-2.5 rounded-xl">
                                                {processing ? 'Mengirim...' : 'Kirim'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null,
                document.body
            )}
        </MainLayout>
    );
}
