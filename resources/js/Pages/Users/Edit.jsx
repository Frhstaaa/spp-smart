import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    UserIcon, 
    ArrowLeftIcon,
    EnvelopeIcon,
    KeyIcon,
    BriefcaseIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import InputLabel from '@/Components/Atoms/InputLabel';
import TextInput from '@/Components/Atoms/TextInput';
import PrimaryButton from '@/Components/Atoms/PrimaryButton';

export default function Edit({ auth, user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <MainLayout user={auth.user} header={<h2 className="font-bold text-2xl text-slate-800 dark:text-slate-200">Edit Pengguna</h2>}>
            <Head title="Edit Pengguna" />

            <div className="py-2 md:py-8">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center gap-4">
                        <Link
                            href={route('users.index')}
                            className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30 transition-all group"
                        >
                            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </Link>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Edit Data Pengguna</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Perbarui profil pengguna atau reset password.</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                        <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-slate-700 dark:text-slate-300" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="block w-full pl-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="email" value="Alamat Email" className="text-slate-700 dark:text-slate-300" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block w-full pl-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                {/* Role */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="role" value="Peran (Role)" className="text-slate-700 dark:text-slate-300" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <BriefcaseIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <select
                                            id="role"
                                            name="role"
                                            value={data.role}
                                            className="block w-full pl-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                            onChange={(e) => setData('role', e.target.value)}
                                            required
                                        >
                                            <option value="tata_usaha">Admin TU (Tata Usaha)</option>
                                            <option value="yayasan">Yayasan / Kepsek</option>
                                            <option value="siswa">Siswa / Orang Tua</option>
                                        </select>
                                    </div>
                                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                                <div className="mb-4 flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-700 dark:text-indigo-300">
                                    <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-semibold">Reset Password (Opsional)</p>
                                        <p className="mt-1">Biarkan kosong jika tidak ingin mengubah password pengguna ini.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Password */}
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="password" value="Password Baru" className="text-slate-700 dark:text-slate-300" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <KeyIcon className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="block w-full pl-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                                                onChange={(e) => setData('password', e.target.value)}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" className="text-slate-700 dark:text-slate-300" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <KeyIcon className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="block w-full pl-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                                <Link
                                    href={route('users.index')}
                                    className="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mr-4"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton className="px-8 py-2.5 rounded-xl" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
