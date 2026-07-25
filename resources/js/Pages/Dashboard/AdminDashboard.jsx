import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, CheckBadgeIcon, ExclamationTriangleIcon, BanknotesIcon, UserPlusIcon, PlusCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import CustomTooltip from '@/Components/Atoms/Tooltip';
import TourGuide from '@/Components/Organisms/TourGuide';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function AdminDashboard({ auth, metrics, recentTransactions }) {
    const { props } = usePage();
    const themeKey = props.appTheme || 'indigo';

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const pieData = [
        { name: 'Lunas', value: metrics.paidBills },
        { name: 'Belum Lunas', value: metrics.unpaidBills },
    ];
    const COLORS = ['#10B981', '#F59E0B'];

    return (
        <MainLayout 
            user={auth.user} 
            header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200 leading-tight">Dashboard Tata Usaha</h2>}
        >
            <Head title="Admin Dashboard" />
            <TourGuide />
            
            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Banner */}
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative rounded-3xl p-5 sm:p-8 text-white shadow-lg shadow-indigo-500/30" style={{ backgroundImage: `linear-gradient(to bottom right, ${props.appHeaderColorFrom || '#8B5CF6'}, ${props.appHeaderColorTo || '#6366F1'})` }}>
                        {/* Decorative Elements wrapped in overflow-hidden to keep them inside the border */}
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
                            <Link href={route('bills.index')} className={`text-[11px] font-semibold text-[#8B5CF6] hover:text-[#6366F1]`}>Lihat Semua</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <DocumentTextIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Total Tagihan</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{metrics.totalBills}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">bulan ini</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <CheckBadgeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 dark:text-emerald-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Tagihan Lunas</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{metrics.paidBills}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">bulan ini</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <ExclamationTriangleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Belum Lunas</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{metrics.unpaidBills}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">bulan ini</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <BanknotesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Kasir Tunai</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{formatRupiah(metrics.cashToday)}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">hari ini</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <BanknotesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 dark:text-rose-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Total Pengeluaran</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{formatRupiah(metrics.totalExpenses)}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">keseluruhan</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <BanknotesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-500 dark:text-teal-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Saldo Kas Bersih</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{formatRupiah(metrics.netBalance)}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1 sm:mt-0.5">keseluruhan</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Aksi Cepat */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="mt-2 lg:col-span-1 relative bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-visible">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                                <div className="absolute right-0 top-0 bottom-0 w-[80%] opacity-10 dark:opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #6366f1 0, #6366f1 1.5px, transparent 1.5px, transparent 12px)' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-800 dark:via-slate-800/80"></div>
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white mb-4 px-1">Aksi Cepat</h4>
                                <div className="flex justify-start items-start gap-2 sm:gap-4 w-[75%]">
                                    <CustomTooltip text="Buka Kasir">
                                        <Link href={route('payments.cashIndex')} className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-indigo-100 transition-colors`}>
                                                <BanknotesIcon className="w-5 h-5 text-indigo-500" strokeWidth={2} />
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Kasir<br/>Tunai</span>
                                        </Link>
                                    </CustomTooltip>
                                    <CustomTooltip text="Buat Tagihan Baru">
                                        <Link href={route('bills.createAuto')} className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-emerald-100 transition-colors`}>
                                                <PlusCircleIcon className="w-5 h-5 text-emerald-500" strokeWidth={2} />
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Generate<br/>SPP</span>
                                        </Link>
                                    </CustomTooltip>
                                    <CustomTooltip text="Daftarkan Siswa">
                                        <Link href={route('students.create')} className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-blue-100 transition-colors`}>
                                                <UserPlusIcon className="w-5 h-5 text-blue-500" strokeWidth={2} />
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Tambah<br/>Siswa</span>
                                        </Link>
                                    </CustomTooltip>
                                </div>
                            </div>
                            {/* Avatar 2 */}
                            <div className="absolute right-2 sm:right-6 bottom-0 w-[130px] sm:w-[160px] h-[145%] pointer-events-none flex items-end justify-end z-0">
                                <img src={props.appAvatar2} alt="Avatar Aksi Cepat" className="w-full h-full object-contain object-bottom" onError={(e) => e.target.style.display='none'} />
                            </div>
                        </motion.div>

                        {/* Donut Chart */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Status Pembayaran Bulan Ini</h4>
                            <div className="flex-1 min-h-[200px] flex items-center justify-center">
                                {metrics.totalBills > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip 
                                                formatter={(value) => [`${value} Tagihan`, 'Jumlah']}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-slate-400 text-xs text-center">Belum ada tagihan bulan ini</div>
                                )}
                            </div>
                        </motion.div>

                        {/* Recent Transactions */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.6 }} className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-bold text-slate-800 dark:text-white">Transaksi Terakhir</h4>
                                <Link href={route('reports.index')} className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">Lihat Laporan</Link>
                            </div>
                            
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-[10px] md:text-sm text-left">
                                    <thead className="text-[10px] md:text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <tr>
                                            <th className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3 rounded-tl-xl md:rounded-l-xl">Tanggal</th>
                                            <th className="px-2 py-2 md:px-4 md:py-3 rounded-tl-xl sm:rounded-none">Siswa</th>
                                            <th className="hidden md:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Metode</th>
                                            <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">Nominal</th>
                                            <th className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 rounded-tr-xl md:rounded-r-xl text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">Belum ada transaksi</td>
                                            </tr>
                                        ) : (
                                            recentTransactions.map((tx) => (
                                                <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                                    <td className="hidden sm:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">{new Date(String(tx.payment_date).replace(/ /g, "T")).toLocaleDateString('id-ID')}</td>
                                                    <td className="px-2 py-2 md:px-4 md:py-3 font-semibold text-slate-800 dark:text-slate-200 min-w-[120px] leading-tight">
                                                        <div>{tx.bill?.student?.user?.name || 'Siswa'}</div>
                                                        <div className="text-[10px] text-slate-400 font-normal sm:hidden mt-1">{new Date(String(tx.payment_date).replace(/ /g, "T")).toLocaleDateString('id-ID')} • {tx.method.toUpperCase()}</div>
                                                    </td>
                                                    <td className="hidden md:table-cell whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold ${tx.method === 'cash' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {tx.method.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 font-medium">{formatRupiah(tx.amount)}</td>
                                                    <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3 text-right">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold ${tx.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
