import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { CreditCardIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function PaySelection({ auth, bills, tariff }) {
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
    
    // Asumsi: jika sekarang bulan >= 7, maka tahun ajaran dimulai tahun ini. 
    // Jika bulan < 7, tahun ajaran dimulai tahun lalu.
    const startYear = currentMonth >= 7 ? currentYear : currentYear - 1;

    const getYearForMonth = (m) => {
        return m >= 7 ? startYear : startYear + 1;
    };

    const getBillStatus = (m, year) => {
        const bill = bills.find(b => parseInt(b.month) === m && parseInt(b.year) === year);
        if (!bill) return null; // Belum ada tagihan dibuat (bisa dibayar di muka)
        return bill.status; // 'paid', 'pending', dll
    };

    const { data, setData, post, processing } = useForm({
        months: []
    });

    const toggleMonth = (m, status) => {
        if (status === 'paid' || status === 'pending') return; // Disable selection

        const year = getYearForMonth(m);
        const exists = data.months.find(item => item.month === m && item.year === year);
        if (exists) {
            setData('months', data.months.filter(item => !(item.month === m && item.year === year)));
        } else {
            setData('months', [...data.months, { month: m, year: year }]);
        }
    };

    const totalAmount = data.months.length * (tariff?.amount || 0);

    const submit = (e) => {
        e.preventDefault();
        post(route('siswa.payMultiple'));
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Pilih Bulan Pembayaran</h2>}>
            <Head title="Bayar Tagihan" />
            <div className="py-2 md:py-8">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/50">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Pilih Bulan yang Ingin Dibayar</h3>
                        <p className="text-sm text-slate-500 mb-6">Tarif per bulan: {formatRupiah(tariff?.amount || 0)}</p>
                        
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {academicMonths.map(({ month, name }) => {
                                    const year = getYearForMonth(month);
                                    const status = getBillStatus(month, year);
                                    const isSelected = data.months.some(item => item.month === month && item.year === year);
                                    
                                    const isDisabled = status === 'paid' || status === 'pending';

                                    let statusColor = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-teal-300";
                                    let textColor = "text-slate-700 dark:text-slate-300";
                                    let icon = null;

                                    if (status === 'paid') {
                                        statusColor = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30 opacity-70";
                                        textColor = "text-emerald-700 dark:text-emerald-400";
                                        icon = <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-1" />;
                                    } else if (status === 'pending') {
                                        statusColor = "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30 opacity-70";
                                        textColor = "text-amber-700 dark:text-amber-400";
                                        icon = <ClockIcon className="w-4 h-4 text-amber-500 mt-1" />;
                                    } else if (isSelected) {
                                        statusColor = "bg-teal-50 border-teal-500 shadow-[0_0_0_2px_rgba(20,184,166,0.2)]";
                                        textColor = "text-teal-700 font-bold";
                                    }

                                    return (
                                        <div 
                                            key={`${year}-${month}`}
                                            onClick={() => toggleMonth(month, status)}
                                            className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${statusColor} ${isDisabled ? 'cursor-not-allowed' : ''}`}
                                        >
                                            <span className={`${textColor}`}>{name}</span>
                                            <span className={`text-xs ${isSelected ? 'text-teal-500' : 'text-slate-400'}`}>{year}</span>
                                            {icon}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                                <div>
                                    <p className="text-sm text-slate-500">Total Pembayaran ({data.months.length} Bulan)</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-white">{formatRupiah(totalAmount)}</p>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={processing || data.months.length === 0}
                                    className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-teal-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <CreditCardIcon className="w-6 h-6" />
                                    Bayar Sekarang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
