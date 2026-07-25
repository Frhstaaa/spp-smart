import React, { useEffect, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '@/Components/Molecules/Toast';
import GlobalConfirm, { overrideNativeAlert } from '@/Components/Organisms/GlobalConfirm';
import CommandPalette from '@/Components/Organisms/CommandPalette';
import {
    HomeIcon,
    UsersIcon,
    ArchiveBoxArrowDownIcon,
    ClipboardDocumentListIcon,
    DocumentChartBarIcon,
    FolderIcon,
    ArrowRightStartOnRectangleIcon,
    SunIcon,
    MoonIcon,
    CogIcon,
    DocumentIcon,
    BuildingOfficeIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    BanknotesIcon,
    AcademicCapIcon,
    ClockIcon,
    TableCellsIcon,
    UserIcon,
    QrCodeIcon,
    ShieldCheckIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ROLE_LABELS = {
    yayasan: 'Yayasan / Kepsek',
    tata_usaha: 'Admin TU',
    siswa: 'Siswa / Orang Tua',
};

const ROLE_COLORS = {
    super_admin: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
    admin: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
    karyawan: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    kasir: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
};

const THEMES = {
    indigo: {
        textGradient: 'from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-500',
        bgGradient: 'from-indigo-500 to-indigo-700',
        navActiveBg: 'bg-gradient-to-r from-indigo-500/10 to-indigo-500/10 dark:from-indigo-500/20 dark:to-indigo-500/20',
        navActiveText: 'text-indigo-700 dark:text-indigo-300',
        navActiveBorder: 'border-indigo-500/20',
        iconBg: 'bg-indigo-500',
        iconShadow: 'shadow-indigo-500/20',
        dotShadow: 'shadow-[0_0_8px_rgba(99,102,241,0.8)]',
        bgGlow1: 'bg-indigo-500/10 dark:bg-indigo-500/15',
        bgGlow2: 'bg-indigo-400/10 dark:bg-indigo-400/15',
        bottomNavActiveIcon: 'text-indigo-600 dark:text-indigo-400',
        bottomNavActiveText: 'text-indigo-700 dark:text-indigo-400',
        bottomNavActiveBg: 'rgba(99, 102, 241, 0.15)',
        badgeBg: 'bg-indigo-100 dark:bg-indigo-500/20',
        badgeText: 'text-indigo-700 dark:text-indigo-400',
        ringClass: 'hover:ring-indigo-500/50',
    },
    blue: {
        textGradient: 'from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-500',
        bgGradient: 'from-blue-500 to-blue-700',
        navActiveBg: 'bg-gradient-to-r from-blue-500/10 to-blue-500/10 dark:from-blue-500/20 dark:to-blue-500/20',
        navActiveText: 'text-blue-700 dark:text-blue-300',
        navActiveBorder: 'border-blue-500/20',
        iconBg: 'bg-blue-500',
        iconShadow: 'shadow-blue-500/20',
        dotShadow: 'shadow-[0_0_8px_rgba(59,130,246,0.8)]',
        bgGlow1: 'bg-blue-500/10 dark:bg-blue-500/15',
        bgGlow2: 'bg-blue-400/10 dark:bg-blue-400/15',
        bottomNavActiveIcon: 'text-blue-600 dark:text-blue-400',
        bottomNavActiveText: 'text-blue-700 dark:text-blue-400',
        bottomNavActiveBg: 'rgba(59, 130, 246, 0.15)',
        badgeBg: 'bg-blue-100 dark:bg-blue-500/20',
        badgeText: 'text-blue-700 dark:text-blue-400',
        ringClass: 'hover:ring-blue-500/50',
    },
    teal: {
        textGradient: 'from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-500',
        bgGradient: 'from-teal-500 to-teal-700',
        navActiveBg: 'bg-gradient-to-r from-teal-500/10 to-teal-500/10 dark:from-teal-500/20 dark:to-teal-500/20',
        navActiveText: 'text-teal-700 dark:text-teal-300',
        navActiveBorder: 'border-teal-500/20',
        iconBg: 'bg-teal-500',
        iconShadow: 'shadow-teal-500/20',
        dotShadow: 'shadow-[0_0_8px_rgba(20,184,166,0.8)]',
        bgGlow1: 'bg-teal-500/10 dark:bg-teal-500/15',
        bgGlow2: 'bg-teal-400/10 dark:bg-teal-400/15',
        bottomNavActiveIcon: 'text-teal-600 dark:text-teal-400',
        bottomNavActiveText: 'text-teal-700 dark:text-teal-400',
        bottomNavActiveBg: 'rgba(20, 184, 166, 0.15)',
        badgeBg: 'bg-teal-100 dark:bg-teal-500/20',
        badgeText: 'text-teal-700 dark:text-teal-400',
        ringClass: 'hover:ring-teal-500/50',
    },
    emerald: {
        textGradient: 'from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-500',
        bgGradient: 'from-emerald-500 to-emerald-700',
        navActiveBg: 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/10 dark:from-emerald-500/20 dark:to-emerald-500/20',
        navActiveText: 'text-emerald-700 dark:text-emerald-300',
        navActiveBorder: 'border-emerald-500/20',
        iconBg: 'bg-emerald-500',
        iconShadow: 'shadow-emerald-500/20',
        dotShadow: 'shadow-[0_0_8px_rgba(16,185,129,0.8)]',
        bgGlow1: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        bgGlow2: 'bg-emerald-400/10 dark:bg-emerald-400/15',
        bottomNavActiveIcon: 'text-emerald-600 dark:text-emerald-400',
        bottomNavActiveText: 'text-emerald-700 dark:text-emerald-400',
        bottomNavActiveBg: 'rgba(16, 185, 129, 0.15)',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-500/20',
        badgeText: 'text-emerald-700 dark:text-emerald-400',
        ringClass: 'hover:ring-emerald-500/50',
    },
    rose: {
        textGradient: 'from-rose-600 to-rose-800 dark:from-rose-400 dark:to-rose-500',
        bgGradient: 'from-rose-500 to-rose-700',
        navActiveBg: 'bg-gradient-to-r from-rose-500/10 to-rose-500/10 dark:from-rose-500/20 dark:to-rose-500/20',
        navActiveText: 'text-rose-700 dark:text-rose-300',
        navActiveBorder: 'border-rose-500/20',
        iconBg: 'bg-rose-500',
        iconShadow: 'shadow-rose-500/20',
        dotShadow: 'shadow-[0_0_8px_rgba(244,63,94,0.8)]',
        bgGlow1: 'bg-rose-500/10 dark:bg-rose-500/15',
        bgGlow2: 'bg-rose-400/10 dark:bg-rose-400/15',
        bottomNavActiveIcon: 'text-rose-600 dark:text-rose-400',
        bottomNavActiveText: 'text-rose-700 dark:text-rose-400',
        bottomNavActiveBg: 'rgba(244, 63, 94, 0.15)',
        badgeBg: 'bg-rose-100 dark:bg-rose-500/20',
        badgeText: 'text-rose-700 dark:text-rose-400',
        ringClass: 'hover:ring-rose-500/50',
    }
};

const NavItem = ({ href, icon: Icon, label, active, onClick, themeC }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
            href={href}
            onClick={onClick}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${active
                    ? `${themeC.navActiveBg} ${themeC.navActiveText} border ${themeC.navActiveBorder}`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                }`}
        >
            <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 shrink-0 ${active ? `${themeC.iconBg} text-white shadow-md ${themeC.iconShadow}` : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                }`}>
                <Icon className="w-5 h-5" />
            </span>
            <span className="flex-1 leading-tight ">{label}</span>
            {active && <span className={`w-1.5 h-1.5 rounded-full ${themeC.iconBg} shrink-0 ${themeC.dotShadow}`} />}
        </Link>
    </motion.div>
);

const NavGroup = ({ label, children }) => (
    <div className="mb-1">
        <p className="px-3 mb-1.5 text-xs font-bold text-gray-600 select-none">
            {label}
        </p>
        <div className="space-y-0.5">{children}</div>
    </div>
);

// Mobile Bottom Nav Item
const BottomNavItem = ({ href, icon: Icon, label, active, onClick, themeC }) => {
    const Component = onClick ? 'button' : Link;
    return (
        <Component
            href={href}
            onClick={onClick}
            className="relative flex flex-col items-center justify-end h-full w-14 pb-0.5 focus:outline-none group"
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            <div className={`flex flex-col items-center justify-center gap-1 w-full transition-colors ${active ? '' : 'hover:bg-slate-100/30 dark:hover:bg-slate-800/30 rounded-xl'
                }`}>
                <div className={`p-1.5 rounded-full transition-all duration-300 ${active ? themeC.bottomNavActiveBg : ''}`}>
                    <Icon className={`w-6 h-6 transition-colors duration-300 ${active ? `${themeC.bottomNavActiveIcon} stroke-[2.5]` : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 stroke-[2]'
                        }`} />
                </div>

                <span className={`text-[9px] sm:text-[10px] font-bold ${active ? themeC.bottomNavActiveText : 'text-slate-400 dark:text-slate-500'
                    } whitespace-nowrap`}>
                    {label}
                </span>
            </div>
        </Component>
    );
};

export default function MainLayout({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    useEffect(() => {
        overrideNativeAlert();
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

    const markNotificationAsRead = (id) => {
        router.post(route('notifications.markAsRead', id), {}, { preserveScroll: true });
    };

    const { url, props } = usePage();
    const user = props.auth?.user;
    const role = user?.role ?? 'siswa';

    const isYayasan = role === 'yayasan';
    const isTataUsaha = role === 'tata_usaha';
    const isSiswa = role === 'siswa';

    const pageTitle = url.startsWith('/classes') ? 'Data Kelas'
        : url.startsWith('/students') ? 'Data Siswa'
            : url.startsWith('/tariffs') ? 'Tarif Pembayaran'
                : url.startsWith('/bills') ? 'Manajemen Tagihan'
                    : url.startsWith('/monitoring') ? 'Monitoring SPP'
                        : url.startsWith('/payments/cash') ? 'Kasir Tunai'
                            : url.startsWith('/my-bills') ? 'Tagihan Saya'
                                : url.startsWith('/my-payments') ? 'Riwayat Pembayaran'
                                    : url.startsWith('/executive') ? 'Dashboard Yayasan'
                                        : url.startsWith('/reports') ? 'Laporan'
                                            : url.startsWith('/profile') ? 'Profil Saya'
                                                : url.startsWith('/settings') ? 'Pengaturan'
                                                    : 'Dashboard';

    const appThemeKey = props.appTheme || 'indigo';
    const themeC = THEMES[appThemeKey] || THEMES.indigo;

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="shrink-0 h-20 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-white/[0.05]">
                <div className="flex items-center gap-3">
                    {props.appLogo ? (
                        <img src={props.appLogo} alt="Logo" className="w-10 h-10 object-contain shrink-0" />
                    ) : (
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${themeC.bgGradient} flex items-center justify-center shadow-lg ${themeC.iconShadow} shrink-0`}>
                            <span className="text-white font-bold text-lg tracking-wider">S</span>
                        </div>
                    )}
                    <div className="leading-tight">
                        <p className={`text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${themeC.textGradient} `}>
                            {props.appName || 'Smart SPP'}
                        </p>

                    </div>
                </div>
            </div>

            {/* Scrollable nav */}
            <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3 space-y-5">
                <NavGroup label="Utama">
                    <NavItem href={route('dashboard')} icon={HomeIcon} label="Dashboard" active={url === '/dashboard'} onClick={handleNavClick} themeC={themeC} />
                </NavGroup>

                {isTataUsaha && (
                    <NavGroup label="Master Data">
                        <NavItem href={route('classes.index')} icon={BuildingOfficeIcon} label="Data Kelas" active={url.startsWith('/classes')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('angkatans.index')} icon={AcademicCapIcon} label="Data Angkatan" active={url.startsWith('/angkatans')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('students.index')} icon={UsersIcon} label="Data Siswa" active={url.startsWith('/students')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('users.index')} icon={UsersIcon} label="Manajemen Pengguna" active={url.startsWith('/users')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('tariffs.index')} icon={ArchiveBoxArrowDownIcon} label="Tarif Pembayaran" active={url.startsWith('/tariffs')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('settings.index')} icon={CogIcon} label="Pengaturan Sistem" active={url.startsWith('/settings')} onClick={handleNavClick} themeC={themeC} />
                    </NavGroup>
                )}

                {isTataUsaha && (
                    <NavGroup label="Transaksi & Kasir">
                        <NavItem href={route('bills.index')} icon={ClipboardDocumentListIcon} label="Manajemen Tagihan" active={url.startsWith('/bills')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('monitoring.index')} icon={TableCellsIcon} label="Monitoring SPP" active={url.startsWith('/monitoring')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('payments.cashIndex')} icon={BanknotesIcon} label="Kasir Tunai" active={url.startsWith('/payments/cash')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('payments.pending')} icon={ClockIcon} label="Menunggu Persetujuan" active={url.startsWith('/payments/pending')} onClick={handleNavClick} themeC={themeC} />
                        <div className="border-t border-slate-200 dark:border-white/10 my-2" />
                        <NavItem href={route('expenses.index')} icon={BanknotesIcon} label="Buku Kas Keluar" active={url.startsWith('/expenses')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('audit-logs.index')} icon={ShieldCheckIcon} label="Audit Log" active={url.startsWith('/audit-logs')} onClick={handleNavClick} themeC={themeC} />
                        <div className="border-t border-slate-200 dark:border-white/10 my-2" />
                        <NavItem href={route('reports.index')} icon={DocumentChartBarIcon} label="Laporan Keuangan" active={url === '/reports'} onClick={handleNavClick} themeC={themeC} />
                    </NavGroup>
                )}

                {isSiswa && (
                    <NavGroup label="Portal Siswa">
                        <NavItem href={route('siswa.bills')} icon={ClipboardDocumentListIcon} label="Tagihanku" active={url.startsWith('/my-bills')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('siswa.payments')} icon={DocumentIcon} label="Riwayat Pembayaran" active={url.startsWith('/my-payments')} onClick={handleNavClick} themeC={themeC} />
                    </NavGroup>
                )}

                {isYayasan && (
                    <NavGroup label="Eksekutif">
                        <NavItem href={route('executive.dashboard')} icon={HomeIcon} label="Dashboard Yayasan" active={url.startsWith('/executive/dashboard')} onClick={handleNavClick} themeC={themeC} />
                        <NavItem href={route('executive.discounts')} icon={ArchiveBoxArrowDownIcon} label="Persetujuan Keringanan" active={url.startsWith('/executive/discounts')} onClick={handleNavClick} themeC={themeC} />
                    </NavGroup>
                )}
            </nav>

            {/* Footer: User Info + Logout */}
            <div className="shrink-0 border-t border-gray-200 dark:border-white/[0.06] px-3 py-3">
                <div className="flex items-center gap-1">
                    <Link
                        href={route('profile.edit')}
                        onClick={handleNavClick}
                        className="flex items-center gap-2.5 flex-1 min-w-0 rounded-xl px-2 py-2 hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors"
                    >
                        <img
                            src={user?.profile_photo_url}
                            alt={user?.name ?? 'User'}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{user?.name ?? 'User'}</p>
                            <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-xs font-semibold ${ROLE_COLORS[role] ?? 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                {ROLE_LABELS[role] ?? role}
                            </span>
                        </div>
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="shrink-0 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        title="Keluar"
                    >
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </>
    );

    return (
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-200 flex relative">
            {/* Background Glows (Pro Max Effect) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full ${themeC.bgGlow1} blur-[120px]`} />
                <div className={`absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full ${themeC.bgGlow2} blur-[120px]`} />
            </div>

            <Toast />
            <GlobalConfirm />
            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} userRole={role} />

            {/* ── MOBILE DRAWER OVERLAY & SIDEBAR (FOR "LAINNYA" MENU) ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 left-0 h-full w-[280px] bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-white/[0.05] shadow-2xl z-[70] flex flex-col"
                        >
                            {sidebarContent}

                            {/* Mobile Close Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-6 right-4 p-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors backdrop-blur-md"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="hidden md:flex flex-col w-[260px] shrink-0 h-full bg-white/60 dark:bg-[#111827]/60 border-r border-slate-200/50 dark:border-white/[0.05] shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 relative">
                {sidebarContent}
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Topbar */}
                <header className="shrink-0 h-16 md:h-20 bg-white/40 dark:bg-[#111827]/40 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/[0.05] flex items-center justify-between px-4 md:px-8 shadow-sm relative z-50">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="md:hidden flex items-center gap-3">
                            {props.appLogo ? (
                                <img src={props.appLogo} alt="Logo" className="w-9 h-9 object-contain shrink-0" />
                            ) : (
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${themeC.bgGradient} flex items-center justify-center shadow-md shrink-0`}>
                                    <span className="text-white font-bold text-sm">S</span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-800 dark:text-slate-100 text-[13px] sm:text-sm leading-tight truncate max-w-[150px]">
                                    SMAN 1 Pangalengan
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">Selamat datang kembali! 👋</span>
                            </div>
                        </div>
                        <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${themeC.bgGradient} hidden md:block`} />
                        <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 truncate hidden md:block">{pageTitle}</h2>
                    </div>
                    <div className="flex items-center gap-1 md:gap-4">
                        <button
                            onClick={() => setIsCommandPaletteOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                        >
                            <MagnifyingGlassIcon className="w-4 h-4" />
                            <span>Cari menu...</span>
                            <kbd className="font-sans px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-600 shadow-sm ml-2">Ctrl K</kbd>
                        </button>

                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block ml-2">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>

                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Notifications"
                            >
                                <BellIcon className="w-5 h-5" />
                                {user?.unread_notifications_count > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#111827]"></span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="fixed sm:absolute top-[70px] sm:top-auto right-4 sm:right-0 left-4 sm:left-auto sm:mt-2 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-[999] overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                                                <h3 className="font-bold text-slate-800 dark:text-slate-100">Notifikasi</h3>
                                                {user?.unread_notifications_count > 0 && (
                                                    <span className={`text-xs ${themeC.badgeBg} ${themeC.badgeText} px-2 py-0.5 rounded-full font-semibold`}>
                                                        {user.unread_notifications_count} Baru
                                                    </span>
                                                )}
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto content-scroll">
                                                {user?.notifications?.length > 0 ? (
                                                    user.notifications.map((notif) => (
                                                        <div key={notif.id} className="p-4 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors relative group">
                                                            <p className="text-sm text-slate-700 dark:text-slate-300 pr-8">{notif.data.message}</p>
                                                            <p className="text-xs text-slate-400 mt-1">{new Date(String(notif.created_at).replace(' ', 'T')).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                            <button
                                                                onClick={() => markNotificationAsRead(notif.id)}
                                                                className={`absolute right-4 top-4 text-xs font-semibold ${themeC.navActiveText} opacity-0 group-hover:opacity-100 transition-opacity`}
                                                            >
                                                                Tandai Dibaca
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                                        Belum ada notifikasi baru.
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="w-5 h-5" />
                            ) : (
                                <MoonIcon className="w-5 h-5" />
                            )}
                        </button>

                        <Link href={route('profile.edit')} className="hidden md:block">
                            <img
                                src={user?.profile_photo_url}
                                alt={user?.name ?? 'User'}
                                className={`w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 ${themeC.ringClass} transition-all`}
                            />
                        </Link>
                    </div>
                </header>

                {/* Page content - Added pb-24 for mobile bottom bar clearance */}
                <main className="flex-1 overflow-y-auto content-scroll px-4 py-2 sm:p-6 lg:p-8 pb-24 md:pb-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={url}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-8 mb-4 text-center text-xs font-bold text-slate-400 dark:text-slate-500 opacity-60 pointer-events-none select-none">
                        Developed by <span className={themeC.bottomNavActiveText}>Diginusa Studio</span>
                    </div>
                </main>
            </div>

            {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 pb-[env(safe-area-inset-bottom)] pointer-events-none">
                <div className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-2xl border-t border-slate-200/50 dark:border-white/[0.05] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] flex items-end justify-around h-[70px] pb-2 px-2 w-full pointer-events-auto relative">
                    <BottomNavItem
                        href={route('dashboard')}
                        icon={HomeIcon}
                        label="Home"
                        active={url === '/dashboard' || url.startsWith('/executive')}
                        themeC={themeC}
                    />

                    {isTataUsaha && (
                        <BottomNavItem
                            href={route('bills.index')}
                            icon={ClipboardDocumentListIcon}
                            label="Tagihan"
                            active={url.startsWith('/bills')}
                            themeC={themeC}
                        />
                    )}

                    {isSiswa && (
                        <BottomNavItem
                            href={route('siswa.bills')}
                            icon={ClipboardDocumentListIcon}
                            label="Tagihan"
                            active={url.startsWith('/siswa/bills')}
                            themeC={themeC}
                        />
                    )}

                    {/* Center Floating Action Button */}
                    <div className="relative -top-3 shrink-0 z-10 flex flex-col items-center justify-end w-14 group">
                        <Link
                            href={isTataUsaha ? route('payments.cashIndex') : isSiswa ? route('siswa.paySelection') : route('dashboard')}
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl bg-gradient-to-br ${themeC.bgGradient} ${themeC.iconShadow} transition-transform active:scale-95 border-4 border-slate-50 dark:border-[#0B0F19] mb-1`}
                        >
                            <span className="sr-only">Aksi Utama</span>
                            <QrCodeIcon className="w-6 h-6" />
                        </Link>
                        <span className={`text-[10px] font-bold ${url.includes('pay') ? themeC.bottomNavActiveText : 'text-slate-500 dark:text-slate-400'} opacity-0`}>Bayar</span>
                        <span className={`absolute -bottom-1.5 text-[10px] font-bold ${url.includes('pay') ? themeC.bottomNavActiveText : 'text-slate-500 dark:text-slate-400'}`}>Bayar</span>
                    </div>

                    <BottomNavItem
                        icon={BellIcon}
                        label="Notifikasi"
                        active={isNotificationOpen}
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        themeC={themeC}
                    />

                    <BottomNavItem
                        onClick={() => setIsMobileMenuOpen(true)}
                        icon={UserIcon}
                        label="Akun"
                        active={isMobileMenuOpen}
                        themeC={themeC}
                    />
                </div>
            </nav>
        </div>
    );
}
