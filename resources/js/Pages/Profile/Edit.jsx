import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { PhotoIcon, KeyIcon, UserCircleIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';

const ROLE_LABELS = { super_admin: 'Super Admin', admin: 'Manajer / Admin', karyawan: 'Staff / Karyawan' };
const inputClass = "w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-white/[0.08] text-sm text-slate-950 dark:text-white outline-none focus:border-indigo-500";
const labelClass = "text-xs font-semibold text-slate-600 dark:text-slate-400";

function SectionHeader({ icon: Icon, title, description }) {
 return (
 <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200 dark:border-white/[0.05]">
 <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500"><Icon className="w-5 h-5" /></div>
 <div>
 <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
 {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
 </div>
 </div>
 );
}

function Field({ label, children }) {
 return (
 <div className="space-y-1">
 <label className={labelClass}>{label}</label>
 {children}
 </div>
 );
}

export default function Edit({ user }) {
 const fileInputRef = useRef(null);
 const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url);

 useEffect(() => { setPhotoPreview(user.profile_photo_url); }, [user.profile_photo_url]);

 // Photo form
 const { data: photoData, setData: setPhotoData, post: postPhoto, processing: photoProcessing, errors: photoErrors, reset: resetPhoto } = useForm({ profile_photo: null });

 // Info form
 const { data: infoData, setData: setInfoData, post: postInfo, processing: infoProcessing, errors: infoErrors } = useForm({
 phone: user.phone || '',
 address: user.address || '',
 birth_place: user.birth_place || '',
 birth_date: user.birth_date || '',
 religion: user.religion || '',
 marital_status: user.marital_status || '',
 });

 const handlePhotoChange = (e) => {
 const file = e.target.files[0];
         if (file) {
            if (file.size > 4 * 1024 * 1024) {
                alert('Maaf, ukuran foto terlalu besar! Batas maksimal adalah 4MB.');
                if (e.target) e.target.value = '';
                return;
            }
            setPhotoData('profile_photo', file); setPhotoPreview(URL.createObjectURL(file)); 
        }
 };

 const submitPhoto = (e) => {
 e.preventDefault();
 if (!photoData.profile_photo) return;
 postPhoto(route('profile.photo'), {
 forceFormData: true, preserveScroll: true,
 onSuccess: () => { resetPhoto('profile_photo'); if (fileInputRef.current) fileInputRef.current.value = ''; },
 });
 };

 const submitInfo = (e) => {
 e.preventDefault();
 postInfo(route('profile.info'), { preserveScroll: true });
 };

 return (
 <MainLayout>
 <Head title="Profil Saya" />
 <div className="max-w-3xl mx-auto space-y-5">

 {/* Header Card */}
 <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-5 rounded-2xl shadow-sm">
 <div className="flex items-center gap-4">
 <img src={user.profile_photo_url} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm" />
 <div className="flex-1 min-w-0">
 <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 truncate">{user.name}</h2>
 <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
 <div className="flex flex-wrap items-center gap-2 mt-1.5">
 <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
 {ROLE_LABELS[user.role] || user.role}
 </span>
 {user.department && <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{user.department}</span>}
 {user.status_karyawan && <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">{user.status_karyawan}</span>}
 </div>
 </div>
 </div>

 {/* Read-only data diri */}
 {(user.nip || user.position || user.phone || user.join_date) && (
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.05]">
 {user.nip && <div><p className="text-xs text-slate-400 font-bold ">NIP</p><p className="text-sm font-mono text-slate-700 dark:text-slate-200">{user.nip}</p></div>}
 {user.position && <div><p className="text-xs text-slate-400 font-bold ">Jabatan</p><p className="text-sm text-slate-700 dark:text-slate-200">{user.position}</p></div>}
 {user.gender && <div><p className="text-xs text-slate-400 font-bold ">Jenis Kelamin</p><p className="text-sm text-slate-700 dark:text-slate-200">{user.gender}</p></div>}
 {user.join_date && <div><p className="text-xs text-slate-400 font-bold ">Bergabung</p><p className="text-sm text-slate-700 dark:text-slate-200">{new Date(String(user.join_date).replace(/ /g, "T")).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'})}</p></div>}
 </div>
 )}
 </div>

 {/* Foto Profil */}
 <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-5 rounded-2xl shadow-sm">
 <SectionHeader icon={PhotoIcon} title="Foto Profil" description="Unggah foto. Akan otomatis dikonversi ke WebP untuk performa terbaik." />
 <form onSubmit={submitPhoto} className="space-y-4">
 <div className="flex items-start gap-5">
 <div className="shrink-0">
 {photoPreview
 ? <img src={photoPreview} alt="" className="w-24 h-24 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
 : <div className="w-24 h-24 rounded-full border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-400"><PhotoIcon className="w-8 h-8 mb-1 opacity-50" /><span className="text-xs font-medium">Belum Ada</span></div>
 }
 </div>
 <div className="flex-1 space-y-2 pt-2">
 <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handlePhotoChange}
 className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-600 hover:file:bg-indigo-500/20 dark:file:bg-indigo-500/20 dark:file:text-indigo-400 dark:hover:file:bg-indigo-500/30 file:cursor-pointer cursor-pointer border border-slate-200 dark:border-white/[0.05] p-1.5 rounded-2xl bg-white/50 dark:bg-black/20" />
 <p className="text-sm text-slate-500">Format: JPEG, PNG, atau WebP. Maks. 4MB. Sistem otomatis mengoptimalkan ke WebP.</p>
 {photoErrors.profile_photo && <p className="text-red-400 text-xs">{photoErrors.profile_photo}</p>}
 </div>
 </div>
 <div className="flex justify-end">
 <button type="submit" disabled={photoProcessing || !photoData.profile_photo}
 className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50">
 {photoProcessing ? 'Mengunggah...' : 'Simpan Foto'}
 </button>
 </div>
 </form>
 </div>

 {/* Data Diri */}
 <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-5 rounded-2xl shadow-sm">
 <SectionHeader icon={UserCircleIcon} title="Data Diri" description="Perbarui informasi kontak dan data pribadi Anda." />
 <form onSubmit={submitInfo} className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <Field label="No. Telepon / HP">
 <input type="text" value={infoData.phone} onChange={e => setInfoData('phone', e.target.value)} className={inputClass} placeholder="08123456789" />
 {infoErrors.phone && <p className="text-red-400 text-xs mt-0.5">{infoErrors.phone}</p>}
 </Field>
 <Field label="Agama">
 <select value={infoData.religion} onChange={e => setInfoData('religion', e.target.value)} className={inputClass}>
 <option value="">Pilih...</option>
 {['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu'].map(r => <option key={r} value={r}>{r}</option>)}
 </select>
 </Field>
 <Field label="Tempat Lahir">
 <input type="text" value={infoData.birth_place} onChange={e => setInfoData('birth_place', e.target.value)} className={inputClass} placeholder="Kota tempat lahir" />
 </Field>
 <Field label="Tanggal Lahir">
 <input type="date" value={infoData.birth_date} onChange={e => setInfoData('birth_date', e.target.value)} className={inputClass} />
 </Field>
 <Field label="Status Pernikahan">
 <select value={infoData.marital_status} onChange={e => setInfoData('marital_status', e.target.value)} className={inputClass}>
 <option value="">Pilih...</option>
 {['Belum Menikah','Menikah','Cerai'].map(s => <option key={s} value={s}>{s}</option>)}
 </select>
 </Field>
 </div>
 <Field label="Alamat Lengkap">
 <textarea rows={2} value={infoData.address} onChange={e => setInfoData('address', e.target.value)} className={inputClass + " resize-none"} placeholder="Jl. Contoh No. 1, Kota..." />
 {infoErrors.address && <p className="text-red-400 text-xs mt-0.5">{infoErrors.address}</p>}
 </Field>
 <div className="flex justify-end">
 <button type="submit" disabled={infoProcessing}
 className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50">
 {infoProcessing ? 'Menyimpan...' : 'Simpan Data Diri'}
 </button>
 </div>
 </form>
 </div>

 {/* Ubah Password */}
 <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-5 rounded-2xl shadow-sm">
 <SectionHeader icon={KeyIcon} title="Ubah Password" description="Perbarui password login Anda untuk menjaga keamanan akun." />
 <UpdatePasswordForm />
 </div>
 </div>
 </MainLayout>
 );
}
