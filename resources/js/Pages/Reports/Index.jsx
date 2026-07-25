import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BanknotesIcon, ExclamationTriangleIcon, CalendarDaysIcon, PrinterIcon } from '@heroicons/react/24/outline';

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number || 0);
};

export default function ReportsIndex({ auth, metrics, chartData, arrearsByClass }) {
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Convert arrears object to array for chart
    const arrearsChartData = Object.keys(arrearsByClass || {}).map(className => ({
        name: className,
        amount: arrearsByClass[className]
    }));

    const handlePrint = () => {
        window.print();
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Laporan Keuangan</h2>}>
            <Head title="Laporan Keuangan" />
            
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-area, #printable-area * { visibility: visible; }
                    #printable-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className="py-8" id="printable-area">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-between items-center no-print">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Ringkasan SPP</h3>
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-500/30">
                            <PrinterIcon className="w-5 h-5" /> Cetak Laporan
                        </button>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 relative overflow-hidden col-span-1">
                            <div className="absolute top-1/2 -translate-y-1/2 right-[-10px] md:top-0 md:-translate-y-0 md:right-0 md:p-4 opacity-10">
                                <BanknotesIcon className="w-16 h-16 md:w-24 md:h-24 text-emerald-600" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] md:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-tight">Bulan Ini</p>
                                <h4 className="text-base md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 md:mt-2">{formatRupiah(metrics?.incomeThisMonth)}</h4>
                            </div>
                        </motion.div>

                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 relative overflow-hidden col-span-1">
                            <div className="absolute top-1/2 -translate-y-1/2 right-[-10px] md:top-0 md:-translate-y-0 md:right-0 md:p-4 opacity-10">
                                <CalendarDaysIcon className="w-16 h-16 md:w-24 md:h-24 text-indigo-600" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] md:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-tight">Tahun Ini</p>
                                <h4 className="text-base md:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 md:mt-2">{formatRupiah(metrics?.incomeThisYear)}</h4>
                            </div>
                        </motion.div>

                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 relative overflow-hidden col-span-2 md:col-span-1">
                            <div className="absolute top-1/2 -translate-y-1/2 right-[-10px] md:top-0 md:-translate-y-0 md:right-0 md:p-4 opacity-10">
                                <ExclamationTriangleIcon className="w-16 h-16 md:w-24 md:h-24 text-rose-600" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[11px] md:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-tight">Total Tunggakan Aktif</p>
                                <h4 className="text-xl md:text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1 md:mt-2">{formatRupiah(metrics?.totalArrears)}</h4>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Income Chart */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Tren Pemasukan (30 Hari)</h4>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} tickFormatter={(str) => { const d = new Date(str); return `${d.getDate()}/${d.getMonth()+1}`; }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `Rp ${val / 1000000}M`} dx={-10} />
                                        <Tooltip 
                                            formatter={(value) => [formatRupiah(value), 'Pemasukan']}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Arrears Chart */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Tunggakan per Kelas</h4>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={arrearsChartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `Rp ${val / 1000000}M`} />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                                        <Tooltip 
                                            formatter={(value) => [formatRupiah(value), 'Tunggakan']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            cursor={{fill: 'rgba(244, 63, 94, 0.05)'}}
                                        />
                                        <Bar dataKey="amount" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Arrears Table Print Only */}
                    <div className="hidden print:block mt-8">
                        <h4 className="text-lg font-bold mb-4 border-b pb-2">Rincian Tunggakan per Kelas</h4>
                        <table className="w-full text-left text-[10px] md:text-sm border-collapse border border-slate-300">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-300 p-1 md:p-2">Nama Kelas</th>
                                    <th className="border border-slate-300 p-1 md:p-2 text-right">Total Tunggakan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrearsChartData.map(c => (
                                    <tr key={c.name}>
                                        <td className="border border-slate-300 p-1 md:p-2">{c.name}</td>
                                        <td className="border border-slate-300 p-1 md:p-2 text-right">{formatRupiah(c.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-8 text-right text-sm">
                            <p>Dicetak pada: {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                            <p className="mt-16 border-t inline-block w-48 text-center pt-2">Bagian Keuangan / Tata Usaha</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
