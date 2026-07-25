import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
 ClipboardDocumentListIcon,
 ClockIcon,
 CheckCircleIcon,
 ExclamationTriangleIcon,
 ArrowTrendingUpIcon,
 UsersIcon,
 ChevronUpIcon,
 ChevronDownIcon,
 EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import {
 LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
 PieChart, Pie, Cell, Legend
} from 'recharts';

export default function Dashboard({ 
 totalTasks, 
 pendingTasks, 
 inProgressTasks, 
 reviewTasks, 
 completedTasks, 
 overdueTasks, 
 chartData = [], 
 leaderboard = [], 
 upcomingTasks = [] 
}) {
 const { auth } = usePage().props;
 const [expandedRows, setExpandedRows] = useState(new Set());

 const toggleExpand = (id) => {
 const newExpanded = new Set(expandedRows);
 if (newExpanded.has(id)) {
 newExpanded.delete(id);
 } else {
 newExpanded.add(id);
 }
 setExpandedRows(newExpanded);
 };

 const formatNumber = (num) => Number(num || 0).toLocaleString('id-ID');
 
 // Metronic Style Colors
 const stats = [
 { name: 'Total Tugas', stat: totalTasks, icon: ClipboardDocumentListIcon, bgColor: 'bg-primary-light', textColor: 'text-primary', iconColor: 'text-primary' },
 { name: 'Belum Mulai', stat: pendingTasks, icon: ClockIcon, bgColor: 'bg-warning-light', textColor: 'text-warning', iconColor: 'text-warning' },
 { name: 'Sedang Berjalan', stat: inProgressTasks, icon: ArrowTrendingUpIcon, bgColor: 'bg-info-light', textColor: 'text-info', iconColor: 'text-info' },
 { name: 'Perlu Ditinjau', stat: reviewTasks, icon: ClipboardDocumentListIcon, bgColor: 'bg-danger-light', textColor: 'text-danger', iconColor: 'text-danger' },
 { name: 'Selesai', stat: completedTasks, icon: CheckCircleIcon, bgColor: 'bg-success-light', textColor: 'text-success', iconColor: 'text-success' },
 { name: 'Terlambat', stat: overdueTasks, icon: ExclamationTriangleIcon, bgColor: 'bg-dark-light', textColor: 'text-dark', iconColor: 'text-dark' }
 ];

 const CustomTooltip = ({ active, payload, label }) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-white dark:bg-[#1e1e2d] border border-gray-200 dark:border-gray-800 p-3 rounded-lg shadow-sm text-sm">
 <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
 {payload.map((entry, index) => (
 <p key={index} className="font-medium text-indigo-500">
 {entry.value} Tugas Selesai
 </p>
 ))}
 </div>
 );
 }
 return null;
 };

 const isAdmin = ['super_admin', 'admin'].includes(auth.user.role);

 return (
 <MainLayout>
 <Head title={isAdmin ? "Dashboard Admin" : "Dashboard Karyawan"} />
 
 {/* Page Title & Breadcrumb - Metronic Style */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
 <div>
 <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
 {isAdmin ? 'Dashboard Admin' : 'Dashboard Karyawan'}
 </h1>
 <div className="flex items-center text-sm text-gray-500 font-medium">
 <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
 <span className="mx-2">•</span>
 <span className="text-gray-400">Dashboard</span>
 </div>
 </div>
 <div className="mt-4 md:mt-0 flex gap-3">
 <Link href={route('tasks.index')} className="bg-white dark:bg-[#1e1e2d] border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-sm">
 Lihat Tugas
 </Link>
 {isAdmin && (
 <Link href={route('reports.index')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-sm shadow-indigo-500/20">
 Buat Laporan
 </Link>
 )}
 </div>
 </div>

 {/* STATS OVERVIEW - Metronic Cards */}
 {/* STATS OVERVIEW - Metronic Cards */}
 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
 {stats.map((item) => {
 const bgClass = 
 item.bgColor === 'bg-primary-light' ? 'bg-indigo-50 dark:bg-indigo-500/10' :
 item.bgColor === 'bg-warning-light' ? 'bg-amber-50 dark:bg-amber-500/10' :
 item.bgColor === 'bg-info-light' ? 'bg-blue-50 dark:bg-blue-500/10' :
 item.bgColor === 'bg-danger-light' ? 'bg-rose-50 dark:bg-rose-500/10' :
 item.bgColor === 'bg-success-light' ? 'bg-emerald-50 dark:bg-emerald-500/10' :
 'bg-slate-50 dark:bg-slate-500/10';
 
 const iconClass = 
 item.iconColor === 'text-primary' ? 'text-indigo-600 dark:text-indigo-400' :
 item.iconColor === 'text-warning' ? 'text-amber-500 dark:text-amber-400' :
 item.iconColor === 'text-info' ? 'text-blue-500 dark:text-blue-400' :
 item.iconColor === 'text-danger' ? 'text-rose-500 dark:text-rose-400' :
 item.iconColor === 'text-success' ? 'text-emerald-500 dark:text-emerald-400' :
 'text-slate-500 dark:text-slate-400';

 return (
 <div key={item.name} className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
 <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
 <div>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-0.5">{formatNumber(item.stat)}</h3>
 <p className="text-sm sm:text-xs font-bold text-slate-500 dark:text-slate-400 ">{item.name}</p>
 </div>
 <div className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${bgClass}`}>
 <item.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconClass}`} />
 </div>
 </div>
 </div>
 );
 })}
 </div>
 
 {/* CHARTS SECTION */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
 
 {/* 7 DAYS TASK COMPLETION CHART */}
 <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
 <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
 <div>
 <h3 className="text-base font-bold text-slate-900 dark:text-white">Statistik Penyelesaian</h3>
 <span className="text-xs text-slate-500 font-medium">Dalam 7 Hari Terakhir</span>
 </div>
 <button className="text-slate-400 hover:text-indigo-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
 <EllipsisHorizontalIcon className="w-5 h-5" />
 </button>
 </div>
 <div className="p-6 h-72 w-full flex-1">
 {chartData.length > 0 ? (
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
 <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={10} />
 <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
 <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
 <Line 
 type="monotone" 
 name="Tugas"
 dataKey="Completed" 
 stroke="#4f46e5" 
 strokeWidth={3}
 dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#4f46e5" }}
 activeDot={{ r: 6, strokeWidth: 0, fill: "#4f46e5" }} 
 />
 </LineChart>
 </ResponsiveContainer>
 ) : (
 <div className="h-full flex items-center justify-center text-slate-400 font-medium">Tidak ada data tugas selesai.</div>
 )}
 </div>
 </div>

 {/* LEADERBOARD / STATS */}
 <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
 <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
 <h3 className="text-base font-bold text-slate-900 dark:text-white">
 {isAdmin ? 'Top Karyawan' : 'Distribusi Tugas'}
 </h3>
 <button className="text-slate-400 hover:text-indigo-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
 <EllipsisHorizontalIcon className="w-5 h-5" />
 </button>
 </div>
 <div className="p-5 flex-1 w-full h-72 overflow-y-auto">
 {leaderboard.length > 0 ? (
 <div className="flex flex-col gap-3">
 {leaderboard.map((item, index) => {
 const colors = [
 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20',
 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 border-pink-200/50 dark:border-pink-500/20',
 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200/50 dark:border-purple-500/20'
 ];
 const colorClass = colors[index % colors.length];

 return (
 <div key={index} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border border-slate-100 dark:border-white/5 group">
 <div className="flex items-center gap-3 sm:gap-4">
 <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shrink-0 border ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
 {item.name ? item.name.charAt(0).toUpperCase() : (index + 1)}
 </div>
 <div>
 <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
 <p className="text-sm sm:text-xs text-slate-500 font-medium mt-0.5">{isAdmin ? 'Performa Sangat Baik' : 'Kategori Tugas'}</p>
 </div>
 </div>
 <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/10 shadow-sm flex flex-col items-end">
 <span className="text-sm sm:text-base font-extrabold text-slate-700 dark:text-slate-200 leading-none">{item.qty}</span>
 <span className="text-xs sm:text-xs font-bold text-slate-400 mt-1">Tugas</span>
 </div>
 </div>
 );
 })}
 </div>
 ) : (
 <div className="h-full flex items-center justify-center text-slate-400 font-medium">Tidak ada data performa.</div>
 )}
 </div>
 </div>
 </div>

 {/* UPCOMING / URGENT TASKS - Metronic Data Table */}
 <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-sm mb-6 overflow-hidden flex flex-col">
 <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
 <div>
 <h3 className="text-base font-bold text-slate-900 dark:text-white">Tugas Urgent & Terdekat</h3>
 <p className="text-xs text-slate-500 mt-1">Daftar tugas yang membutuhkan perhatian segera</p>
 </div>
 <Link 
 href={route('tasks.index')} 
 className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 px-3.5 py-2 rounded-xl transition-colors shadow-sm"
 >
 Lihat Semua
 </Link>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
 <thead className="bg-slate-50/50 dark:bg-slate-800/20">
 <tr className="border-b border-slate-200/60 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold text-sm ">
 <th className="py-4 pl-6 pr-3">Info Tugas</th>
 <th className="py-4 px-3">Kategori</th>
 <th className="py-4 px-3">Prioritas</th>
 <th className="py-4 px-3">Status</th>
 <th className="py-4 px-3">Assignee</th>
 <th className="py-4 pr-6 pl-3 text-right">Batas Waktu</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-white/5">
 {upcomingTasks.length > 0 ? (
 upcomingTasks.map((task) => (
 <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
 <td className="py-4 pl-6 pr-3 font-semibold">
 <Link href={route('tasks.show', task.id)} className="text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 block text-sm transition-colors">
 {task.title}
 </Link>
 <span className="text-sm text-slate-400 font-normal mt-1 block">#{task.id.toString().padStart(4, '0')}</span>
 </td>
 <td className="py-4 px-3 text-slate-600 dark:text-slate-400 font-medium text-xs">
 {task.category ? task.category.name : '-'}
 </td>
 <td className="py-4 px-3">
 <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
 task.priority === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
 task.priority === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400'
 }`}>
 {task.priority === 'high' ? 'Tinggi' : task.priority === 'medium' ? 'Sedang' : 'Rendah'}
 </span>
 </td>
 <td className="py-4 px-3">
 <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
 task.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' :
 task.status === 'review' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400' :
 task.status === 'in_progress' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400' :
 task.status === 'overdue' ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400' :
 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-500/10 dark:border-slate-500/20 dark:text-slate-400'
 }`}>
 {task.status === 'completed' ? 'Selesai' :
 task.status === 'review' ? 'Review' :
 task.status === 'in_progress' ? 'Sedang Jalan' :
 task.status === 'overdue' ? 'Terlambat' : 'Belum Mulai'}
 </span>
 </td>
 <td className="py-4 px-3 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
 {task.assigned_to ? (
 <>
 <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
 {(typeof task.assigned_to === 'object' ? task.assigned_to.name : 'U')[0].toUpperCase()}
 </div>
 <span className="text-sm">{typeof task.assigned_to === 'object' ? (task.assigned_to.id === auth.user.id ? 'Saya' : task.assigned_to.name) : (task.assigned_to === auth.user.id ? 'Saya' : 'User')}</span>
 </>
 ) : '-'}
 </td>
 <td className="py-4 pr-6 pl-3 text-right text-slate-500 dark:text-slate-400 font-medium text-xs font-mono">
 {new Date(String(task.due_date).replace(/ /g, "T")).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
 Tidak ada tugas urgent saat ini. Kerja bagus!
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </MainLayout>
 );
}
