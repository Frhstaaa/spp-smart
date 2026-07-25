import { Head, useForm } from '@inertiajs/react';
import { ClipboardDocumentListIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <>
            <Head title="Reset Kata Sandi — SIM KAS Sekolah" />

            <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden font-sans py-12">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-[120px] pointer-events-none"
                />
                <motion.div 
                    animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 blur-[150px] pointer-events-none"
                />

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center"
                >
                    <motion.div variants={itemVariants} className="w-full max-w-md">
                        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-6 sm:p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                            <div className="mb-6 text-center flex flex-col items-center gap-3 justify-center">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 mt-2">Buat Sandi Baru</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Silakan buat kata sandi baru untuk mengamankan akun Anda.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                {/* Email Field (Read Only mostly or hidden, but we show it) */}
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Alamat Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <EnvelopeIcon className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-slate-500'}`} />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/50 backdrop-blur-sm border text-white placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/50 ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
                                            readOnly
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {errors.email && (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-400 mt-1">{errors.email}</motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Password Field */}
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Kata Sandi Baru</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <LockClosedIcon className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-indigo-400'}`} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Minimal 8 karakter"
                                            className={`w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-800/50 backdrop-blur-sm border text-white placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-800/80 ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 hover:border-white/20 focus:border-indigo-500'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {errors.password && (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-400 mt-1">{errors.password}</motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                
                                {/* Confirm Password Field */}
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Konfirmasi Kata Sandi</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <LockClosedIcon className={`h-5 w-5 ${errors.password_confirmation ? 'text-red-400' : 'text-slate-500 group-focus-within:text-indigo-400'}`} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi kata sandi baru"
                                            className={`w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-800/50 backdrop-blur-sm border text-white placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-800/80 ${errors.password_confirmation ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 hover:border-white/20 focus:border-indigo-500'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {errors.password_confirmation && (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-400 mt-1">{errors.password_confirmation}</motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            {processing ? (
                                                <>
                                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                    </svg>
                                                    Memproses...
                                                </>
                                            ) : 'Simpan Sandi Baru'}
                                        </span>
                                    </button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
