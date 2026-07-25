import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';

export default function Generate({ auth, tariffs, classes, students }) {
    const [targetType, setTargetType] = React.useState('all'); // 'all', 'class', 'specific'
    const { data, setData, post, processing, errors } = useForm({
        tariff_id: '',
        class_id: '',
        level: '',
        student_ids: [],
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toISOString().split('T')[0],
        generate_12_months: false
    });

    const uniqueLevels = [...new Set(classes.map(c => c.level))];

    const studentOptions = students ? students.map(s => ({
        value: s.id,
        label: `${s.name} (${s.school_class?.name || '-'})`
    })) : [];

    const handleStudentChange = (selectedOptions) => {
        setData('student_ids', selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleTargetTypeChange = (e) => {
        setTargetType(e.target.value);
        setData('class_id', '');
        setData('student_ids', []);
        setData('level', '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('bills.storeAuto'));
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Generate Tagihan Massal</h2>}>
            <Head title="Generate Tagihan" />

            <div className="py-2 md:py-8">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                        <div className="p-4 md:p-8">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                                <div className="p-4 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl">
                                    <DocumentPlusIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Buat Tagihan Otomatis</h3>
                                    <p className="text-slate-500 text-sm">Sistem akan membuat tagihan berdasarkan tarif yang dipilih untuk semua siswa yang berstatus aktif.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipe Sasaran Tagihan <span className="text-rose-500">*</span></label>
                                    <select value={targetType} onChange={handleTargetTypeChange} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                                        <option value="all">Semua Siswa (Mengikuti Tingkatan Tarif)</option>
                                        <option value="level">Berdasarkan Angkatan / Tingkat</option>
                                        <option value="class">Berdasarkan Kelas Tertentu</option>
                                        <option value="specific">Pilih Beberapa Siswa Spesifik</option>
                                    </select>
                                </div>

                                {targetType === 'level' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih Angkatan / Tingkat <span className="text-rose-500">*</span></label>
                                        <select value={data.level} onChange={e => setData('level', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required={targetType === 'level'}>
                                            <option value="">-- Pilih Angkatan --</option>
                                            {uniqueLevels.map(lvl => (
                                                <option key={lvl} value={lvl}>{lvl}</option>
                                            ))}
                                        </select>
                                        {errors.level && <p className="text-rose-500 text-xs mt-1">{errors.level}</p>}
                                    </motion.div>
                                )}

                                {targetType === 'class' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih Kelas Sasaran <span className="text-rose-500">*</span></label>
                                        <select value={data.class_id} onChange={e => setData('class_id', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required={targetType === 'class'}>
                                            <option value="">-- Pilih Kelas --</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} (Angkatan: {c.level})</option>
                                            ))}
                                        </select>
                                        {errors.class_id && <p className="text-rose-500 text-xs mt-1">{errors.class_id}</p>}
                                    </motion.div>
                                )}

                                {targetType === 'specific' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih Siswa Spesifik <span className="text-rose-500">*</span></label>
                                        <Select
                                            isMulti
                                            options={studentOptions}
                                            onChange={handleStudentChange}
                                            placeholder="Ketik nama siswa..."
                                            className="my-react-select-container"
                                            classNamePrefix="my-react-select"
                                            noOptionsMessage={() => "Siswa tidak ditemukan"}
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Anda dapat memilih lebih dari 1 siswa.</p>
                                        {errors.student_ids && <p className="text-rose-500 text-xs mt-1">{errors.student_ids}</p>}
                                        {errors['student_ids.0'] && <p className="text-rose-500 text-xs mt-1">Pilih setidaknya satu siswa.</p>}
                                    </motion.div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih Jenis Tarif <span className="text-rose-500">*</span></label>
                                    <select value={data.tariff_id} onChange={e => setData('tariff_id', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required>
                                        <option value="">-- Pilih Tarif --</option>
                                        {tariffs.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} - Rp {t.amount.toLocaleString('id-ID')} (Untuk Tingkat: {t.level_applied || 'Semua'})</option>
                                        ))}
                                    </select>
                                    {errors.tariff_id && <p className="text-rose-500 text-xs mt-1">{errors.tariff_id}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Bulan Tagihan <span className="text-rose-500">*</span></label>
                                        <select value={data.month} onChange={e => setData('month', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i+1} value={i+1}>
                                                    {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.month && <p className="text-rose-500 text-xs mt-1">{errors.month}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tahun Tagihan <span className="text-rose-500">*</span></label>
                                        <input type="number" value={data.year} onChange={e => setData('year', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required />
                                        {errors.year && <p className="text-rose-500 text-xs mt-1">{errors.year}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanggal Jatuh Tempo <span className="text-rose-500">*</span></label>
                                    <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required />
                                    {errors.due_date && <p className="text-rose-500 text-xs mt-1">{errors.due_date}</p>}
                                </div>

                                <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                                    <input 
                                        type="checkbox" 
                                        id="generate12"
                                        checked={data.generate_12_months}
                                        onChange={e => setData('generate_12_months', e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="generate12" className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                                        Buatkan Sekaligus untuk 1 Tahun (12 Bulan Kedepan)
                                        <p className="text-xs font-normal text-indigo-600 dark:text-indigo-400 mt-0.5">Sistem akan otomatis meng-generate 12 bulan tagihan berturut-turut dari bulan mulai yang Anda pilih di atas. Notifikasi WhatsApp hanya akan dikirim 1x per siswa untuk menghindari spam.</p>
                                    </label>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/50">
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Penting: Sistem akan otomatis melewati siswa yang sudah dibuatkan tagihan untuk Bulan dan Tahun yang sama dengan Jenis Tarif ini.</p>
                                </div>

                                <div className="pt-4 flex justify-end gap-4 border-t border-slate-100 dark:border-slate-700/50 mt-6">
                                    <Link href={route('bills.index')} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Batal</Link>
                                    <button type="submit" disabled={processing} className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50 flex items-center gap-2">
                                        {processing ? 'Memproses...' : (
                                            <>
                                                <DocumentPlusIcon className="w-5 h-5" /> Generate Sekarang
                                            </>
                                        )}
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
