import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Edit({ auth, student, classes, angkatans }) {
    const { data, setData, put, processing, errors } = useForm({
        nis: student.nis,
        nik: student.nik || '',
        name: student.name,
        gender: student.gender || '',
        birth_place: student.birth_place || '',
        birth_date: student.birth_date || '',
        class_id: student.school_class_id,
        angkatan_id: student.angkatan_id || '',
        address: student.address || '',
        father_name: student.father_name || '',
        mother_name: student.mother_name || '',
        guardian_name: student.guardian_name || '',
        parent_job: student.parent_job || '',
        phone: student.parent_phone || '',
        is_paid_yearly: student.is_paid_yearly || false,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('students.update', student.id));
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Edit Data Siswa</h2>}>
            <Head title="Edit Data Siswa" />

            <div className="py-2 md:py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Section 1: Data Pribadi Siswa */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-4 md:p-8">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">1. Data Pribadi Siswa</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">NIS / NISN <span className="text-rose-500">*</span></label>
                                        <input type="text" value={data.nis} onChange={e => setData('nis', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required />
                                        {errors.nis && <p className="text-rose-500 text-xs mt-1">{errors.nis}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">NIK (Kependudukan)</label>
                                        <input type="text" value={data.nik} onChange={e => setData('nik', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.nik && <p className="text-rose-500 text-xs mt-1">{errors.nik}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required />
                                        {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin</label>
                                        <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                                            <option value="">-- Pilih Jenis Kelamin --</option>
                                            <option value="L">Laki-laki (L)</option>
                                            <option value="P">Perempuan (P)</option>
                                        </select>
                                        {errors.gender && <p className="text-rose-500 text-xs mt-1">{errors.gender}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tempat Lahir</label>
                                        <input type="text" value={data.birth_place} onChange={e => setData('birth_place', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.birth_place && <p className="text-rose-500 text-xs mt-1">{errors.birth_place}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanggal Lahir</label>
                                        <input type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.birth_date && <p className="text-rose-500 text-xs mt-1">{errors.birth_date}</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap Siswa</label>
                                    <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows="3" className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Jalan, RT/RW, Desa, Kecamatan..."></textarea>
                                    {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Kelas <span className="text-rose-500">*</span></label>
                                        <select value={data.class_id} onChange={e => setData('class_id', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required>
                                            <option value="">-- Pilih Kelas --</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.year})</option>
                                            ))}
                                        </select>
                                        {errors.class_id && <p className="text-rose-500 text-xs mt-1">{errors.class_id}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Angkatan <span className="text-rose-500">*</span></label>
                                        <select value={data.angkatan_id} onChange={e => setData('angkatan_id', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" required>
                                            <option value="">-- Pilih Angkatan --</option>
                                            {angkatans.map(a => (
                                                <option key={a.id} value={a.id}>{a.name} {a.year ? `(${a.year})` : ''}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-slate-500 mt-1">Sistem akan menyesuaikan tagihan SPP rutin dengan angkatan ini.</p>
                                        {errors.angkatan_id && <p className="text-rose-500 text-xs mt-1">{errors.angkatan_id}</p>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Section 2: Data Orang Tua / Wali */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-4 md:p-8">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">2. Data Orang Tua / Wali</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Ayah</label>
                                        <input type="text" value={data.father_name} onChange={e => setData('father_name', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.father_name && <p className="text-rose-500 text-xs mt-1">{errors.father_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Ibu</label>
                                        <input type="text" value={data.mother_name} onChange={e => setData('mother_name', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.mother_name && <p className="text-rose-500 text-xs mt-1">{errors.mother_name}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Wali (Opsional)</label>
                                        <input type="text" value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.guardian_name && <p className="text-rose-500 text-xs mt-1">{errors.guardian_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pekerjaan Orang Tua/Wali</label>
                                        <input type="text" value={data.parent_job} onChange={e => setData('parent_job', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                                        {errors.parent_job && <p className="text-rose-500 text-xs mt-1">{errors.parent_job}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">No. HP Aktif (WhatsApp)</label>
                                        <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Contoh: 0812xxxxxx" />
                                        {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Section 3: Pengaturan Tagihan & Akun Portal */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-4 md:p-8">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">3. Pengaturan Sistem</h3>
                                
                                <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-2xl border border-teal-100 dark:border-teal-900/50 mb-6 mt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-teal-800 dark:text-teal-300 mb-1">Lunas 1 Tahun (Bebas Tagihan Rutin)</h4>
                                            <p className="text-sm text-teal-600 dark:text-teal-400">Jika diaktifkan, siswa ini tidak akan mendapatkan tagihan otomatis bulanan.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={data.is_paid_yearly} onChange={e => setData('is_paid_yearly', e.target.checked)} />
                                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-700/50 pt-6 mt-6">
                                    <div className="mb-4">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Reset Password Akun (Opsional)</h4>
                                        <p className="text-sm text-slate-500">Biarkan kosong jika tidak ingin mengubah password akun siswa ini.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Password Baru</label>
                                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" autoComplete="new-password" />
                                            {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Password</label>
                                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" autoComplete="new-password" />
                                            {errors.password_confirmation && <p className="text-rose-500 text-xs mt-1">{errors.password_confirmation}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 flex justify-end gap-4 border-t border-slate-100 dark:border-slate-700/50">
                                    <Link href={route('students.index')} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Batal</Link>
                                    <button type="submit" disabled={processing} className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50">
                                        {processing ? 'Menyimpan...' : 'Update Data Siswa'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
