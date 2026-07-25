import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { PrinterIcon, ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number || 0);
};

export default function Receipt({ payment, settings, auth }) {
    useEffect(() => {
        // Optional: auto print on load
        // window.print();
    }, []);

    const isSiswa = auth.user.role === 'siswa';
    const backUrl = isSiswa ? route('siswa.payments') : route('payments.cashIndex');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-200 p-4 pb-32 md:p-8 md:pb-8 font-sans">
            <Head title={`Kuitansi Pembayaran #${payment.transaction_id}`} />
            
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white !important; margin: 0; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .receipt-container { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; color: black !important; }
                }
            `}</style>

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-center no-print">
                    <Link href={backUrl} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold transition-colors">
                        <ArrowLeftIcon className="w-5 h-5" /> Kembali
                    </Link>
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-500/30 hidden md:flex">
                            <PrinterIcon className="w-5 h-5" /> Cetak (Web)
                        </button>
                        <a href={isSiswa ? route('siswa.receipt.pdf', payment.id) : route('payments.receipt.pdf', payment.id)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30">
                            <DocumentArrowDownIcon className="w-5 h-5" /> Download PDF
                        </a>
                    </div>
                </div>

                <div className="receipt-container bg-white dark:bg-slate-800 p-5 md:p-12 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700/50 mx-auto print:text-black print:bg-white print:p-0 print:border-none print:shadow-none">
                    {/* Header Kop Surat */}
                    <div className="flex items-center gap-6 border-b-2 border-slate-800 dark:border-slate-200 pb-6 mb-8 print:border-black">
                        <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-3xl shrink-0 print:bg-black print:text-white print:rounded-none">
                            {settings.school_name ? settings.school_name.charAt(0) : 'S'}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wider print:text-black">
                                {settings.school_name || 'NAMA SEKOLAH / INSTANSI'}
                            </h1>
                            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1 print:text-gray-700">
                                {settings.address || 'Alamat sekolah belum diatur'} | Telp: {settings.phone || '-'}
                            </p>
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-slate-300 inline-block pb-1 print:border-black">Bukti Pembayaran KAS/SPP</h2>
                    </div>

                    {/* Receipt Info */}
                    <div className="flex flex-col gap-3 md:flex-col md:gap-4 text-sm md:text-base mb-8 md:mb-10">
                        <div className="flex flex-col md:flex-row md:justify-between border-b border-slate-100 dark:border-slate-700/50 pb-2 md:pb-0 md:border-none">
                            <div className="text-slate-500 print:text-gray-600 mb-1 md:mb-0">No. Transaksi</div>
                            <div className="font-semibold break-all">{payment.transaction_id}</div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:justify-between border-b border-slate-100 dark:border-slate-700/50 pb-2 md:pb-0 md:border-none">
                            <div className="text-slate-500 print:text-gray-600 mb-1 md:mb-0">Tanggal Bayar</div>
                            <div className="font-semibold">{new Date(String(payment.payment_date).replace(/ /g, "T")).toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:justify-between border-b border-slate-100 dark:border-slate-700/50 pb-2 md:pb-0 md:border-none">
                            <div className="text-slate-500 print:text-gray-600 mb-1 md:mb-0">Tahun Ajaran</div>
                            <div className="font-semibold">{settings.academic_year || '-'}</div>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 md:p-6 rounded-xl md:rounded-2xl mb-8 md:mb-10 print:bg-white print:border print:border-black print:rounded-none">
                        <div className="flex flex-col gap-4 md:grid md:grid-cols-[140px_10px_1fr] md:gap-y-3 text-sm md:text-base">
                            <div className="flex flex-col md:contents">
                                <div className="font-semibold text-slate-500 md:text-slate-800 dark:md:text-slate-200">Telah Terima Dari</div>
                                <div className="hidden md:block">:</div>
                                <div className="font-bold">{payment.bill.student.name}</div>
                            </div>
                            
                            <div className="flex flex-col md:contents">
                                <div className="font-semibold text-slate-500 md:text-slate-800 dark:md:text-slate-200">NISN</div>
                                <div className="hidden md:block">:</div>
                                <div>{payment.bill.student.nisn || '-'}</div>
                            </div>
                            
                            <div className="flex flex-col md:contents">
                                <div className="font-semibold text-slate-500 md:text-slate-800 dark:md:text-slate-200">Kelas</div>
                                <div className="hidden md:block">:</div>
                                <div>{payment.bill.student.school_class.name}</div>
                            </div>
                            
                            <div className="flex flex-col md:contents">
                                <div className="font-semibold text-slate-500 md:text-slate-800 dark:md:text-slate-200">Untuk Pembayaran</div>
                                <div className="hidden md:block">:</div>
                                <div>
                                    {payment.bill.tariff.name} 
                                    <span className="block text-slate-500 text-sm print:text-gray-600 mt-0.5">
                                        Bulan: {new Date(payment.bill.year, payment.bill.month - 1).toLocaleDateString('id-ID', {month: 'long', year: 'numeric'})}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col md:flex-row items-center justify-between border-t-2 border-b-2 border-slate-100 dark:border-slate-700/50 py-4 md:py-6 mb-8 md:mb-12 print:border-black">
                        <div className="text-sm md:text-lg font-bold text-slate-500 dark:text-slate-400 print:text-black mb-1 md:mb-0">UANG SEJUMLAH</div>
                        <div className="text-2xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400 print:text-black">
                            {formatRupiah(payment.amount)}
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between items-end mt-8 md:mt-16 px-2 md:px-12">
                        <div className="text-center">
                            <p className="text-xs md:text-sm mb-12 md:mb-16">Penyetor</p>
                            <p className="font-bold underline text-xs md:text-sm">{payment.bill.student.name}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs md:text-sm mb-1 md:mb-2">Penerima / Kasir</p>
                            <p className="text-[10px] md:text-xs text-slate-500 mb-8 md:mb-12 print:text-gray-600">{new Date(String(payment.payment_date).replace(/ /g, "T")).toLocaleDateString('id-ID')}</p>
                            <p className="font-bold underline text-xs md:text-sm uppercase">
                                {payment.cashier?.name || 'Sistem Digital'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-16 text-center text-xs text-slate-400 print:text-gray-500 border-t pt-4 print:border-black">
                        Kuitansi ini adalah bukti pembayaran yang sah. Harap disimpan dengan baik.
                    </div>
                </div>
            </div>
        </div>
    );
}
