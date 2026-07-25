import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BanknotesIcon, ExclamationTriangleIcon, DocumentCheckIcon, ChevronRightIcon, ChartBarIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function ExecutiveDashboard({ auth, metrics, pendingDiscounts, revenueChart }) {
    const { props } = usePage();
    const themeKey = props.appTheme || 'indigo';

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <MainLayout 
            user={auth.user} 
            header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200 leading-tight">Dashboard Yayasan</h2>}
        >
            <Head title="Executive Dashboard" />
            
            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Banner */}
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative rounded-3xl p-5 sm:p-8 text-white overflow-hidden shadow-lg shadow-indigo-500/30" style={{ backgroundImage: `linear-gradient(to bottom right, ${props.appHeaderColorFrom || '#8B5CF6'}, ${props.appHeaderColorTo || '#6366F1'})` }}>
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 right-20 -mb-4 w-24 h-24 bg-purple-300 opacity-20 rounded-full blur-xl"></div>
                        {/* Spiral/Ripple Pattern */}
                        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] opacity-10 pointer-events-none rounded-full" style={{ backgroundImage: 'repeating-radial-gradient(circle at center, transparent 0, transparent 15px, white 15px, white 16px)' }}></div>
                        
                        <div className="relative z-10 w-[65%] sm:w-2/3">
                            <h3 className="text-[22px] sm:text-2xl font-bold mb-1.5 tracking-tight">Halo, {auth.user.name.split(' ')[0]}! 👋</h3>
                            <p className="text-white/90 text-[11px] sm:text-xs mb-5 leading-relaxed max-w-[200px] sm:max-w-md">
                                Berikut adalah ringkasan kesehatan finansial Smart SPP Sekolah hari ini.
                            </p>
                            <Link href="#ringkasan" className="bg-white text-[#4238E0] text-[11px] sm:text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm">
                                Lihat Laporan <ChevronRightIcon className="w-3.5 h-3.5" strokeWidth={3} />
                            </Link>
                        </div>
                        
                        <div className="absolute right-2 sm:right-6 md:right-8 lg:right-12 bottom-0 w-[165px] sm:w-[220px] md:w-[240px] lg:w-[260px] h-[125%] pointer-events-none flex items-end justify-end">
                            <img src={props.appAvatar} alt="Avatar" className="w-full h-full object-contain object-bottom" onError={(e) => e.target.style.display='none'} />
                        </div>
                    </motion.div>

                    {/* Ringkasan Finansial Grid */}
                    <motion.div id="ringkasan" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="mt-6">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">Ringkasan Finansial</h4>
                            <Link href={route('reports.index')} className={`text-[11px] font-semibold text-[#8B5CF6] hover:text-[#6366F1]`}>Laporan Lengkap</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <BanknotesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 dark:text-emerald-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Penerimaan</p>
                                    <h3 className="text-sm sm:text-lg font-extrabold text-slate-800 dark:text-white truncate">{formatRupiah(metrics.totalIncomeThisMonth)}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-0.5">bulan ini</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <ExclamationTriangleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 dark:text-rose-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Tunggakan Aktif</p>
                                    <h3 className="text-sm sm:text-lg font-extrabold text-slate-800 dark:text-white truncate">{formatRupiah(metrics.totalArrears)}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-0.5">total saat ini</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <DocumentCheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Keringanan</p>
                                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white">{metrics.pendingDiscountCount}</h3>
                                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-0.5">menunggu</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between">
                                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-2 sm:mb-3`}>
                                    <ChartBarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium mb-0.5 sm:mb-1 truncate">Laporan</p>
                                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate mt-1 text-[#6366F1]">
                                        <Link href={route('reports.index')}>Buka <ChevronRightIcon className="w-3 h-3 inline" strokeWidth={3} /></Link>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Aksi Cepat */}
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }} className="mt-6 relative bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-visible">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                            <div className="absolute right-0 top-0 bottom-0 w-[80%] opacity-10 dark:opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #6366f1 0, #6366f1 1.5px, transparent 1.5px, transparent 12px)' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-800 dark:via-slate-800/80"></div>
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white mb-4 px-1">Aksi Cepat</h4>
                            <div className="flex justify-start items-start gap-2 sm:gap-4 w-[75%]">
                                <Link href={route('reports.index')} className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-indigo-100 transition-colors`}>
                                        <ChartBarIcon className="w-5 h-5 text-indigo-500" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Laporan</span>
                                </Link>
                                <Link href={route('executive.discounts')} className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-amber-100 transition-colors`}>
                                        <DocumentCheckIcon className="w-5 h-5 text-amber-500" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Persetujuan</span>
                                </Link>
                                <Link href="#" className="flex flex-col items-center text-center gap-1.5 w-14 sm:w-16 group">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700/50 group-hover:bg-blue-100 transition-colors`}>
                                        <UserPlusIcon className="w-5 h-5 text-blue-500" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Bantuan</span>
                                </Link>
                            </div>
                        </div>
                        {/* Avatar 2 */}
                        <div className="absolute right-2 sm:right-6 lg:right-0 bottom-0 w-[130px] sm:w-[160px] lg:w-[115px] h-[145%] pointer-events-none flex items-end justify-end z-0">
                            <img src={props.appAvatar2} alt="Avatar Aksi Cepat" className="w-full h-full object-contain object-bottom" onError={(e) => e.target.style.display='none'} />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        {/* Chart */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Tren Pemasukan (6 Bulan)</h4>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueChart}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `Rp ${val / 1000000}M`} dx={-10} />
                                        <Tooltip 
                                            formatter={(value) => [formatRupiah(value), 'Pemasukan']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Pending Discounts Table/List */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-lg font-bold text-slate-800 dark:text-white">Persetujuan Pending</h4>
                                <Link href={route('executive.discounts')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Lihat Semua</Link>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                {pendingDiscounts.length === 0 ? (
                                    <div className="text-center py-10">
                                        <DocumentCheckIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500">Tidak ada pengajuan pending.</p>
                                    </div>
                                ) : (
                                    pendingDiscounts.map(discount => (
                                        <div key={discount.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h5 className="font-bold text-slate-800 dark:text-white">{discount.student?.user?.name || 'Siswa'}</h5>
                                                    <p className="text-xs text-slate-500">Tagihan: {discount.bill?.month}/{discount.bill?.year}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">Pending</span>
                                            </div>
                                            <div className="text-sm mt-2">
                                                <span className="text-slate-500">Pengajuan:</span> <span className="font-semibold text-slate-800 dark:text-white">{formatRupiah(discount.discount_amount)}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 italic truncate">"{discount.reason}"</p>
                                            <Link href={route('executive.discounts')} className="mt-3 block text-center w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-sm font-bold transition-colors">Tinjau Pengajuan</Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
