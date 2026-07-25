import { Head, useForm, Link } from '@inertiajs/react';
import { ClipboardDocumentListIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Framer motion variants
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
            <Head title="Login — Smart SPP Sekolah" />

            {/* Dynamic Background */}
            <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden font-sans">
                {/* Animated Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-[120px] pointer-events-none"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 blur-[150px] pointer-events-none"
                />

                {/* Glassmorphism Container */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
                >
                    {/* Left: Branding & Value Prop */}
                    <motion.div variants={itemVariants} className="w-full lg:w-1/2 text-center lg:text-left hidden lg:flex flex-col justify-center">
                        <div className="inline-flex items-center gap-3 mb-6 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 w-max shadow-2xl">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-wide">Smart SPP</h2>
                                <p className="text-xs text-indigo-200 font-medium">Smart School Payment Platform.</p>
                            </div>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 leading-tight">
                            Kelola Keuangan Sekolah dalam Satu Platform.
                        </h1>
                        <p className="text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
                            Platform modern untuk memonitor SPP dan kas secara transparan, mudah, dan terintegrasi langsung dengan WhatsApp.
                        </p>

                        {/* Features List */}
                        <div className="space-y-4">
                            {['Laporan Keuangan Real-time', 'Notifikasi WhatsApp Otomatis', 'Data Aman & Terpusat'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <CheckCircleIcon className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <span className="font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Login Card */}
                    <motion.div variants={itemVariants} className="w-full max-w-md lg:w-1/2">
                        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-6 sm:p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                            <div className="mb-6 text-center lg:text-left lg:hidden">
                                <div className="inline-flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-wide">Smart SPP</h2>
                                </div>
                            </div>

                            <motion.div variants={itemVariants} className="mb-8 text-center lg:text-left">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Selamat Datang</h3>
                                <p className="text-slate-400 text-sm">Silakan masuk menggunakan akun Anda</p>
                            </motion.div>

                            <form onSubmit={submit} className="space-y-6">
                                <AnimatePresence>
                                    {status && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-center gap-3"
                                        >
                                            <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                                            {status}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Email Field */}
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Alamat Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-indigo-400">
                                            <EnvelopeIcon className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-slate-500 group-focus-within:text-indigo-400'}`} />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            autoFocus
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@sekolah.com"
                                            className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/50 backdrop-blur-sm border text-white placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-800/80 ${errors.email
                                                ? 'border-red-500/50 focus:border-red-500'
                                                : 'border-white/10 hover:border-white/20 focus:border-indigo-500'
                                                }`}
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
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-slate-300">Kata Sandi</label>
                                        <Link href={route('password.request')} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Lupa sandi?</Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-indigo-400">
                                            <LockClosedIcon className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-indigo-400'}`} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className={`w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-800/50 backdrop-blur-sm border text-white placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-800/80 ${errors.password
                                                ? 'border-red-500/50 focus:border-red-500'
                                                : 'border-white/10 hover:border-white/20 focus:border-indigo-500'
                                                }`}
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

                                {/* Remember Me */}
                                <motion.div variants={itemVariants} className="flex items-center">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-md border transition-all duration-300 flex items-center justify-center ${data.remember
                                                ? 'bg-indigo-500 border-indigo-500'
                                                : 'bg-slate-800/50 border-white/20 group-hover:border-indigo-400'
                                                }`}>
                                                <motion.svg
                                                    initial={false}
                                                    animate={data.remember ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                                                    className="w-3.5 h-3.5 text-white"
                                                    viewBox="0 0 12 10"
                                                    fill="none"
                                                >
                                                    <path d="M1.5 5.5L4.5 8.5L10.5 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </motion.svg>
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Ingat Saya</span>
                                    </label>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                                            ) : 'Masuk'}
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
