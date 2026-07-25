import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CreditCardIcon, ReceiptPercentIcon, ClockIcon, DocumentArrowDownIcon, CalendarDaysIcon, CurrencyDollarIcon, CheckBadgeIcon, ChevronRightIcon, BanknotesIcon, DocumentTextIcon, QuestionMarkCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function StudentDashboard({ auth, student, currentBill, recentPayments, sppGrid }) {
    const { props } = usePage();
    const themeKey = props.appTheme || 'indigo';
    
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('id-ID', { month: 'long' });
    };

    const totalTagihan = sppGrid ? sppGrid.length : 0;
    const tagihanLunas = sppGrid ? sppGrid.filter(i => i.status === 'paid').length : 0;
    const belumLunas = sppGrid ? sppGrid.filter(i => i.status !== 'paid').length : 0;
    const sisaSaldoTagihan = sppGrid ? sppGrid.filter(i => i.status !== 'paid').reduce((sum, item) => sum + Number(item.amount), 0) : 0;
    const totalDibayar = sppGrid ? sppGrid.filter(i => i.status === 'paid').reduce((sum, item) => sum + Number(item.amount), 0) : 0;

    return (
        <MainLayout 
            user={auth.user} 
            header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200 leading-tight">Portal Siswa</h2>}
        >
            <Head title="Portal Siswa" />
            
            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Banner */}
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative rounded-3xl p-5 sm:p-8 text-white shadow-lg shadow-indigo-500/30" style={{ backgroundImage: `linear-gradient(to bottom right, ${props.appHeaderColorFrom || '#8B5CF6'}, ${props.appHeaderColorTo || '#6366F1'})` }}>
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 right-20 -mb-4 w-24 h-24 bg-purple-300 opacity-20 rounded-full blur-xl"></div>
                            {/* Spiral/Ripple Pattern */}
                            <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] opacity-10 rounded-full" style={{ backgroundImage: 'repeating-radial-gradient(circle at center, transparent 0, transparent 15px, white 15px, white 16px)' }}></div>
                        </div>
                        
                        <div className="relative z-10 w-[65%] sm:w-2/3">
                            <h3 className="text-[22px] sm:text-2xl font-bold mb-1.5 tracking-tight">Halo, {auth.user.name.split(' ')[0]}! 👋</h3>
                            <p className="text-white/90 text-[11px] sm:text-xs mb-5 leading-relaxed max-w-[200px] sm:max-w-md">
                                Kelola tagihan dan transaksi sekolah dengan cepat dan mudah hari ini.
                            </p>
                            <Link href="#ringkasan" className="bg-white text-[#4238E0] text-[11px] sm:text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm">
                                Lihat Ringkasan <ChevronRightIcon className="w-3.5 h-3.5" strokeWidth={3} />
                            </Link>
                        </div>
                        
                        <div className="absolute right-2 sm:right-6 md:right-8 lg:right-16 bottom-0 w-[165px] sm:w-[220px] md:w-[240px] lg:w-[320px] xl:w-[350px] h-[125%] lg:h-[140%] pointer-events-none flex items-end justify-end z-10">
                            <img src={props.appAvatar} alt="Avatar" className="w-full h-full object-contain object-bottom" onError={(e) => e.target.style.display='none'} />
                        </div>
                    </motion.div>

                    {/* Ringkasan Tagihan Grid */}
                    <motion.div id="ringkasan" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="mt-6">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">Ringkasan Tagihan</h4>
                            <Link href={route('siswa.bills')} className={`text-[11px] font-semibold text-[#8B5CF6] hover:text-[#6366F1]`}>Lihat Semua</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <DocumentTextIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Total Tagihan</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{totalTagihan}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">tahun ini</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <CheckBadgeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 dark:text-emerald-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Tagihan Lunas</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{tagihanLunas}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">tahun ini</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Belum Lunas</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{belumLunas}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">tahun ini</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <CurrencyDollarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Telah Dibayar</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{formatRupiah(totalDibayar)}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">tahun ini</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Aksi Cepat */}
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="mt-6 relative bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-visible">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                            <div className="absolute right-0 top-0 bottom-0 w-[80%] opacity-10 dark:opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #6366f1 0, #6366f1 1.5px, transparent 1.5px, transparent 12px)' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-800 dark:via-slate-800/80"></div>
                        </div>
                        
                        <div className="relative z-10">
                            <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white mb-4 px-1">Aksi Cepat</h4>
                            <div className="flex justify-start items-start gap-2 sm:gap-4 w-[75%]">
                                <Link href={route('siswa.payments')} className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-blue-100 transition-colors`}>
                                        <DocumentTextIcon className="w-5 h-5 text-blue-500" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Riwayat<br/>Transaksi</span>
                                </Link>
                                <Link href={currentBill ? route('siswa.bills') : '#'} className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-emerald-100 transition-colors`}>
                                        <CreditCardIcon className="w-5 h-5 text-emerald-500" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Pem-<br/>bayaran</span>
                                </Link>
                                <Link href={route('siswa.bills')} className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-purple-100 transition-colors`}>
                                        <ReceiptPercentIcon className="w-5 h-5 text-[#8B5CF6]" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Tagihan<br/>Saya</span>
                                </Link>
                                <a href={route('siswa.ledger.pdf')} className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-rose-100 transition-colors`}>
                                        <DocumentArrowDownIcon className="w-5 h-5 text-rose-500" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Rapor<br/>Keuangan</span>
                                </a>
                            </div>
                        </div>
                        {/* Avatar 2 */}
                        <div className="absolute right-2 sm:right-6 bottom-0 w-[130px] sm:w-[160px] h-[145%] pointer-events-none flex items-end justify-end z-0">
                            <img src={props.appAvatar2} alt="Avatar Aksi Cepat" className="w-full h-full object-contain object-bottom" onError={(e) => e.target.style.display='none'} />
                        </div>
                    </motion.div>
                    
                    {/* Security Badge */}
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }} className="mt-4 bg-[#6366F1]/10 dark:bg-[#6366F1]/20 rounded-[1.25rem] p-4 flex items-center justify-between border border-[#6366F1]/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#6366F1]/30">
                                <CheckBadgeIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h5 className="text-[12px] sm:text-sm font-bold text-[#6366F1] dark:text-[#8B5CF6]">Transaksi aman & terpercaya</h5>
                                <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight max-w-[200px]">Data kamu terlindungi dengan sistem keamanan terbaik.</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Current Bill Card */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                    <CurrencyDollarIcon className="w-32 h-32" />
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-6 relative z-10">Tagihan Berjalan</h4>
                                
                                {currentBill ? (
                                    <div className="flex-1 flex flex-col justify-between relative z-10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-rose-600">
                                                <ClockIcon className="w-5 h-5" />
                                                <span className="text-sm font-bold">Jatuh Tempo: {new Date(String(currentBill.due_date).replace(/ /g, "T")).toLocaleDateString('id-ID')}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium mb-1">Tagihan SPP Bulan {getMonthName(currentBill.month)} {currentBill.year}</p>
                                            <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-4">{formatRupiah(currentBill.amount)}</h3>
                                            
                                            <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-sm font-semibold mb-6 flex items-center justify-center">
                                                Status: BELUM LUNAS
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {currentBill.payments && currentBill.payments.length > 0 ? (
                                                <div className="w-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold py-4 rounded-xl text-center border border-amber-200 dark:border-amber-800/30 flex items-center justify-center gap-2">
                                                    <ClockIcon className="w-5 h-5" />
                                                    Menunggu Konfirmasi TU
                                                </div>
                                            ) : (
                                                <Link href={route('siswa.pay', currentBill.id)} method="post" as="button" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                                                    <CreditCardIcon className="w-5 h-5" />
                                                    Bayar Sekarang (VA/QRIS)
                                                </Link>
                                            )}
                                            <Link href={route('siswa.bills')} className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                                <ReceiptPercentIcon className="w-5 h-5" />
                                                Detail & Opsi Tagihan
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-10 relative z-10">
                                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                            <CheckBadgeIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Hore! Tidak ada tagihan.</h4>
                                        <p className="text-slate-500 text-sm">Semua tagihan SPP Anda saat ini sudah lunas.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Recent Payments History */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-bold text-slate-800 dark:text-white">Riwayat Pembayaran Terakhir</h4>
                                <Link href={route('siswa.payments')} className="text-sm text-teal-600 font-semibold hover:text-teal-700">Lihat Semua</Link>
                            </div>

                            <div className="space-y-4">
                                {recentPayments.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                                        <CalendarDaysIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">Belum ada riwayat pembayaran.</p>
                                    </div>
                                ) : (
                                    recentPayments.map((payment) => (
                                        <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 hover:border-teal-200 transition-colors">
                                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                <div className={`p-3 rounded-xl ${payment.method === 'cash' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                                                    <CreditCardIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-slate-800 dark:text-white">
                                                        {payment.bill?.tariff?.name || 'Tagihan'} {payment.bill?.month ? `Bulan ${getMonthName(payment.bill?.month)} ${payment.bill?.year}` : ''}
                                                    </h5>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-500 font-medium">{new Date(String(payment.payment_date).replace(/ /g, "T")).toLocaleDateString('id-ID')}</span>
                                                        <span className="text-xs text-slate-300">•</span>
                                                        <span className="text-xs font-bold text-slate-600 uppercase">{payment.method}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                                                <span className="font-extrabold text-slate-800 dark:text-white">
                                                    {formatRupiah(payment.amount)}
                                                </span>
                                                <Link href={route('siswa.receipt', payment.id)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors group" title="Download Kuitansi">
                                                    <DocumentArrowDownIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* 12 Months Grid */}
                    {sppGrid && sppGrid.length > 0 && (
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 mt-8">
                        <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-6">Status Tagihan 12 Bulan (Tahun Ajaran Ini)</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {sppGrid.map((item, index) => (
                                <div key={index} className={`p-4 rounded-2xl border flex flex-col justify-between h-32 relative overflow-hidden transition-all hover:shadow-md ${
                                    item.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30' :
                                    item.status === 'pending' ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/30' :
                                    'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                                }`}>
                                    {item.status === 'paid' && <div className="absolute -right-4 -top-4 text-emerald-500/10"><CheckBadgeIcon className="w-20 h-20" /></div>}
                                    
                                    <div className="relative z-10">
                                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.year}</div>
                                        <div className={`text-base font-black ${
                                            item.status === 'paid' ? 'text-emerald-800 dark:text-emerald-400' : 
                                            item.status === 'pending' ? 'text-rose-800 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                                        }`}>{getMonthName(item.month)}</div>
                                        <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1">{formatRupiah(item.amount)}</div>
                                    </div>

                                    <div className="mt-2 relative z-10">
                                        {item.status === 'paid' && (
                                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                                <CheckBadgeIcon className="w-4 h-4" /> Lunas
                                            </div>
                                        )}
                                        {item.status === 'pending' && (
                                            item.bill?.payments && item.bill.payments.length > 0 ? (
                                                <div className="w-full text-center text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold py-2 rounded-xl">
                                                    Menunggu
                                                </div>
                                            ) : (
                                                <Link href={route('siswa.pay', item.bill.id)} method="post" as="button" className="w-full text-center text-xs bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded-xl transition-colors shadow-sm shadow-rose-500/20">
                                                    Bayar
                                                </Link>
                                            )
                                        )}
                                        {item.status === 'unbilled' && (
                                            <Link href={route('siswa.payAdvance')} method="post" data={{ month: item.month, year: item.year }} as="button" className="w-full text-center text-xs bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold py-2 rounded-xl transition-colors">
                                                Bayar Awal
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    )}

                </div>
            </div>
        </MainLayout>
    );
}
