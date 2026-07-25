import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, EyeIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, logs }) {
    const [selectedLog, setSelectedLog] = useState(null);

    const getActionBadge = (action) => {
        switch (action) {
            case 'created': return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">Created</span>;
            case 'updated': return <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-bold uppercase">Updated</span>;
            case 'deleted': return <span className="px-2 py-1 rounded bg-rose-100 text-rose-700 text-xs font-bold uppercase">Deleted</span>;
            default: return <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold uppercase">{action}</span>;
        }
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Keamanan & Audit Trail</h2>}>
            <Head title="Audit Log" />

            <div className="py-2 md:py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Banner */}
                    <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-lg flex items-center gap-4 border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-50 -mt-20 -mr-20"></div>
                        <div className="p-4 bg-slate-800 rounded-2xl relative z-10">
                            <ShieldCheckIcon className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl md:text-2xl font-bold">Log Aktivitas Sistem</h3>
                            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                                Memantau setiap perubahan krusial di sistem. Rekaman ini bersifat *read-only* dan tidak dapat diubah, memastikan integritas dan transparansi penuh untuk keamanan sekolah.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left text-[10px] md:text-sm text-slate-500 dark:text-slate-400">
                                <thead className="text-[10px] md:text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                                    <tr>
                                        <th className="px-3 py-3 md:px-4 md:py-4">Waktu</th>
                                        <th className="px-3 py-3 md:px-4 md:py-4">Pengguna / IP</th>
                                        <th className="px-3 py-3 md:px-4 md:py-4">Aksi</th>
                                        <th className="px-3 py-3 md:px-4 md:py-4">Modul (ID)</th>
                                        <th className="px-3 py-3 md:px-4 md:py-4 text-right">Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-slate-500">Belum ada rekaman log aktivitas.</td>
                                        </tr>
                                    ) : (
                                        logs.data.map((log) => (
                                            <tr key={log.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="whitespace-nowrap px-3 py-3 md:px-4 font-medium text-slate-700 dark:text-slate-300">
                                                    {log.created_at}
                                                </td>
                                                <td className="px-3 py-3 md:px-4">
                                                    <div className="font-bold text-slate-800 dark:text-white">{log.user}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.ip_address || 'Unknown IP'}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3 md:px-4">
                                                    {getActionBadge(log.action)}
                                                </td>
                                                <td className="px-3 py-3 md:px-4">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200">{log.model_type}</div>
                                                    <div className="text-[10px] text-slate-400">ID: {log.model_id}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-3 md:px-4 text-right">
                                                    <button onClick={() => setSelectedLog(log)} className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-900/30 p-2 rounded-lg transition-colors">
                                                        <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination Component */}
                        {logs.links && logs.links.length > 3 && (
                            <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                                {logs.links.map((link, k) => (
                                    link.url ? (
                                        <Link
                                            key={k}
                                            href={link.url}
                                            className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-lg sm:rounded-xl transition-all ${
                                                link.active 
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span 
                                            key={k} 
                                            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-lg sm:rounded-xl text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Detail Log */}
            <AnimatePresence>
                {selectedLog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-20">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl relative my-auto border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <ShieldCheckIcon className="w-5 h-5 text-indigo-500" /> Detail Forensik Log
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">Ref ID: #{selectedLog.id} • {selectedLog.created_at}</p>
                                </div>
                                <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 md:p-6 space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Pengguna</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{selectedLog.user}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Aksi</p>
                                        <div>{getActionBadge(selectedLog.action)}</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Target Modul</p>
                                        <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">{selectedLog.model_type} (#{selectedLog.model_id})</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Alamat IP</p>
                                        <p className="font-mono text-xs text-slate-700 dark:text-slate-300">{selectedLog.ip_address || '-'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nilai Lama (Sebelum)</h4>
                                        <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-64 text-xs font-mono text-emerald-400 shadow-inner">
                                            {selectedLog.old_values ? (
                                                <pre>{JSON.stringify(selectedLog.old_values, null, 2)}</pre>
                                            ) : (
                                                <span className="text-slate-600 italic">Tidak ada (Data Baru)</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nilai Baru (Sesudah)</h4>
                                        <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-64 text-xs font-mono text-indigo-400 shadow-inner">
                                            {selectedLog.new_values ? (
                                                <pre>{JSON.stringify(selectedLog.new_values, null, 2)}</pre>
                                            ) : (
                                                <span className="text-slate-600 italic">Tidak ada (Data Dihapus)</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
