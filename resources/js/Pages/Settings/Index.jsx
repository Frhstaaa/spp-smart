import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Cog6ToothIcon, CheckCircleIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, settings, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        school_name: settings.school_name || '',
        academic_year: settings.academic_year || '',
        address: settings.address || '',
        phone: settings.phone || '',
        school_logo: null,
        dashboard_avatar: null,
        dashboard_avatar_2: null,
        auto_generate_bill: settings.auto_generate_bill === '1' || settings.auto_generate_bill === true || false,
        auto_generate_date: settings.auto_generate_date || '1',
        app_theme: settings.app_theme || 'indigo',
        dashboard_header_color_from: settings.dashboard_header_color_from || '#8B5CF6',
        dashboard_header_color_to: settings.dashboard_header_color_to || '#6366F1'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.update'));
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Pengaturan Sistem</h2>}>
            <Head title="Pengaturan Sistem" />

            <div className="py-2 md:py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                            <CheckCircleIcon className="w-5 h-5" /> {flash.success}
                        </div>
                    )}

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                        <div className="p-4 md:p-8">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                                <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                                    <Cog6ToothIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Informasi Instansi & Akademik</h3>
                                    <p className="text-slate-500 text-sm">Pengaturan ini akan digunakan pada kop surat, laporan, dan kuitansi pembayaran.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Sekolah / Instansi <span className="text-rose-500">*</span></label>
                                        <input type="text" value={data.school_name} onChange={e => setData('school_name', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required />
                                        {errors.school_name && <p className="text-rose-500 text-xs mt-1">{errors.school_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tahun Ajaran Aktif <span className="text-rose-500">*</span></label>
                                        <input type="text" value={data.academic_year} onChange={e => setData('academic_year', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Misal: 2026/2027 Ganjil" required />
                                        {errors.academic_year && <p className="text-rose-500 text-xs mt-1">{errors.academic_year}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap</label>
                                        <textarea value={data.address} onChange={e => setData('address', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" rows="3"></textarea>
                                        {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor Telepon</label>
                                        <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Logo Sekolah</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={e => setData('school_logo', e.target.files[0])} 
                                            className="w-full text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/20 dark:file:text-indigo-400" 
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Kosongkan jika tidak ingin mengubah logo. Format: JPG, PNG, SVG, WEBP. Maks 2MB.</p>
                                        {errors.school_logo && <p className="text-rose-500 text-xs mt-1">{errors.school_logo}</p>}
                                        {settings.school_logo && (
                                            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl inline-block border border-slate-200 dark:border-slate-700">
                                                <p className="text-xs text-slate-500 mb-2 font-semibold">Logo saat ini:</p>
                                                <img src={`/storage/${settings.school_logo}`} alt="Logo Sekolah" className="h-20 object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Avatar Dashboard Utama</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={e => setData('dashboard_avatar', e.target.files[0])} 
                                            className="w-full text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/20 dark:file:text-indigo-400" 
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Kosongkan jika tidak ingin mengubah avatar. Gambar ini akan tampil di bagian kanan Banner Selamat Datang di Dashboard. Direkomendasikan gambar dengan latar transparan (PNG). Maks 2MB.</p>
                                        {errors.dashboard_avatar && <p className="text-rose-500 text-xs mt-1">{errors.dashboard_avatar}</p>}
                                        {settings.dashboard_avatar && (
                                            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl inline-block border border-slate-200 dark:border-slate-700">
                                                <p className="text-xs text-slate-500 mb-2 font-semibold">Avatar saat ini:</p>
                                                <img src={`/storage/${settings.dashboard_avatar}`} alt="Avatar Dashboard" className="h-20 object-contain bg-slate-200 dark:bg-slate-800 rounded-lg" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Avatar Aksi Cepat (Avatar 2)</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={e => setData('dashboard_avatar_2', e.target.files[0])} 
                                            className="w-full text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/20 dark:file:text-indigo-400" 
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Kosongkan jika tidak ingin mengubah avatar. Gambar ini akan tampil di bagian kanan menu Aksi Cepat. Direkomendasikan gambar dengan latar transparan (PNG). Maks 2MB.</p>
                                        {errors.dashboard_avatar_2 && <p className="text-rose-500 text-xs mt-1">{errors.dashboard_avatar_2}</p>}
                                        {settings.dashboard_avatar_2 && (
                                            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl inline-block border border-slate-200 dark:border-slate-700">
                                                <p className="text-xs text-slate-500 mb-2 font-semibold">Avatar 2 saat ini:</p>
                                                <img src={`/storage/${settings.dashboard_avatar_2}`} alt="Avatar Aksi Cepat" className="h-20 object-contain bg-slate-200 dark:bg-slate-800 rounded-lg" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-4">
                                    <div className="p-4 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Automatisasi Tagihan SPP</h3>
                                        <p className="text-slate-500 text-sm">Sistem dapat menerbitkan tagihan secara otomatis setiap bulannya kepada seluruh siswa aktif yang tidak Lunas 1 Tahun.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-teal-50 dark:bg-teal-900/10 p-6 rounded-3xl border border-teal-100 dark:border-teal-900/50">
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-teal-800 dark:text-teal-300 mb-1">Aktifkan Automatisasi</h4>
                                                <p className="text-sm text-teal-600 dark:text-teal-400">Jalankan pembuatan tagihan SPP rutin setiap bulan otomatis oleh sistem.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={data.auto_generate_bill} onChange={e => setData('auto_generate_bill', e.target.checked)} />
                                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-teal-800 dark:text-teal-300 mb-1">Tanggal Terbit Tagihan Otomatis</label>
                                        <select disabled={!data.auto_generate_bill} value={data.auto_generate_date} onChange={e => setData('auto_generate_date', e.target.value)} className="w-full rounded-xl border-teal-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-teal-900/50 dark:border-teal-800 dark:text-white disabled:opacity-50">
                                            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                                <option key={day} value={day}>Tanggal {day} Setiap Bulannya</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-teal-600 dark:text-teal-500 mt-2">Maksimal tanggal 28 untuk menghindari masalah perhitungan hari pada bulan Februari.</p>
                                    </div>
                                </div>

                                <div className="mt-8 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-4">
                                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                                        <PaintBrushIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tampilan & Tema Warna</h3>
                                        <p className="text-slate-500 text-sm">Pilih tema warna utama yang sesuai dengan preferensi Anda. Warna akan diterapkan ke seluruh aplikasi.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { id: 'indigo', name: 'Nila (Indigo)', color: 'bg-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-300' },
                                        { id: 'blue', name: 'Biru (Blue)', color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300' },
                                        { id: 'teal', name: 'Teal (Hijau Kebiruan)', color: 'bg-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-700 dark:text-teal-300' },
                                        { id: 'emerald', name: 'Zamrud (Emerald)', color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300' },
                                        { id: 'rose', name: 'Mawar (Rose)', color: 'bg-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300' },
                                    ].map(theme => (
                                        <button
                                            key={theme.id}
                                            type="button"
                                            onClick={() => setData('app_theme', theme.id)}
                                            className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all overflow-hidden ${
                                                data.app_theme === theme.id 
                                                    ? 'border-indigo-500 shadow-md scale-100 bg-white dark:bg-slate-800' 
                                                    : 'border-slate-100 dark:border-slate-700/50 scale-95 hover:scale-100 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-full ${theme.color} flex items-center justify-center shadow-inner`}>
                                                {data.app_theme === theme.id && <CheckCircleIcon className="w-6 h-6 text-white" />}
                                            </div>
                                            <span className={`text-xs font-bold text-center ${data.app_theme === theme.id ? theme.text : 'text-slate-500 dark:text-slate-400'}`}>
                                                {theme.name}
                                            </span>
                                            {data.app_theme === theme.id && (
                                                <div className={`absolute inset-0 ${theme.bg} pointer-events-none rounded-xl`} style={{ mixBlendMode: 'multiply' }}></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {errors.app_theme && <p className="text-rose-500 text-xs mt-1">{errors.app_theme}</p>}

                                <div className="mt-8 mb-4 border-t border-slate-100 dark:border-slate-700/50 pt-8">
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Gradien Header Dashboard</h4>
                                    <p className="text-sm text-slate-500 mb-6">Sesuaikan warna gradien latar belakang untuk banner utama (Welcome Banner) di halaman Dashboard.</p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Warna Gradien Awal (Kiri/Atas)</label>
                                            <div className="flex items-center gap-3">
                                                <input type="color" value={data.dashboard_header_color_from} onChange={e => setData('dashboard_header_color_from', e.target.value)} className="w-12 h-12 p-1 rounded-lg cursor-pointer border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                                                <input type="text" value={data.dashboard_header_color_from} onChange={e => setData('dashboard_header_color_from', e.target.value)} className="flex-1 rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white uppercase" placeholder="#8B5CF6" />
                                            </div>
                                            {errors.dashboard_header_color_from && <p className="text-rose-500 text-xs mt-1">{errors.dashboard_header_color_from}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Warna Gradien Akhir (Kanan/Bawah)</label>
                                            <div className="flex items-center gap-3">
                                                <input type="color" value={data.dashboard_header_color_to} onChange={e => setData('dashboard_header_color_to', e.target.value)} className="w-12 h-12 p-1 rounded-lg cursor-pointer border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                                                <input type="text" value={data.dashboard_header_color_to} onChange={e => setData('dashboard_header_color_to', e.target.value)} className="flex-1 rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white uppercase" placeholder="#6366F1" />
                                            </div>
                                            {errors.dashboard_header_color_to && <p className="text-rose-500 text-xs mt-1">{errors.dashboard_header_color_to}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-6 p-6 rounded-2xl" style={{ backgroundImage: `linear-gradient(to bottom right, ${data.dashboard_header_color_from}, ${data.dashboard_header_color_to})` }}>
                                        <h4 className="text-white font-bold text-lg mb-1">Pratinjau Banner</h4>
                                        <p className="text-white/80 text-sm">Warna gradien ini akan diterapkan pada banner dashboard pengguna.</p>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-700/50 mt-8">
                                    <button type="submit" disabled={processing} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50">
                                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
