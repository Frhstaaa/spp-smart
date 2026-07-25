import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Combobox, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { HomeIcon, UsersIcon, BanknotesIcon, DocumentChartBarIcon, CogIcon, BuildingOfficeIcon, ClipboardDocumentListIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const menus = [
    { id: 1, name: 'Dashboard Admin', url: '/dashboard', icon: HomeIcon, role: 'tata_usaha' },
    { id: 2, name: 'Data Kelas', url: '/classes', icon: BuildingOfficeIcon, role: 'tata_usaha' },
    { id: 3, name: 'Data Siswa', url: '/students', icon: UsersIcon, role: 'tata_usaha' },
    { id: 4, name: 'Manajemen Tagihan', url: '/bills', icon: ClipboardDocumentListIcon, role: 'tata_usaha' },
    { id: 5, name: 'Kasir Tunai', url: '/payments/cash', icon: BanknotesIcon, role: 'tata_usaha' },
    { id: 6, name: 'Buku Kas Keluar', url: '/expenses', icon: BanknotesIcon, role: 'tata_usaha' },
    { id: 7, name: 'Laporan Keuangan', url: '/reports', icon: DocumentChartBarIcon, role: 'tata_usaha' },
    { id: 8, name: 'Audit Log Forensik', url: '/audit-logs', icon: ShieldCheckIcon, role: 'tata_usaha' },
    { id: 9, name: 'Pengaturan', url: '/settings', icon: CogIcon, role: 'tata_usaha' },
    { id: 10, name: 'Portal Siswa (Dashboard)', url: '/dashboard', icon: HomeIcon, role: 'siswa' },
    { id: 11, name: 'Tagihanku', url: '/my-bills', icon: ClipboardDocumentListIcon, role: 'siswa' },
    { id: 12, name: 'Riwayat Pembayaran', url: '/my-payments', icon: BanknotesIcon, role: 'siswa' },
    { id: 13, name: 'Dashboard Eksekutif', url: '/executive/dashboard', icon: HomeIcon, role: 'yayasan' },
];

export default function CommandPalette({ isOpen, setIsOpen, userRole }) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsOpen]);

    const filteredMenus = query === ''
        ? []
        : menus.filter((menu) => {
            const roleMatch = userRole === 'super_admin' || userRole === 'admin' ? menu.role === 'tata_usaha' : menu.role === userRole;
            const textMatch = menu.name.toLowerCase().includes(query.toLowerCase());
            return roleMatch && textMatch;
        });

    return (
        <Transition.Root show={isOpen} as={Fragment} afterLeave={() => setQuery('')}>
            <Dialog as="div" className="relative z-[999]" onClose={setIsOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all">
                            <Combobox onChange={(menu) => {
                                setIsOpen(false);
                                if(menu) router.visit(menu.url);
                            }}>
                                <div className="relative">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-slate-400"
                                        aria-hidden="true"
                                    />
                                    <Combobox.Input
                                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm outline-none"
                                        placeholder="Cari menu... (Coba ketik 'Tagihan')"
                                        onChange={(event) => setQuery(event.target.value)}
                                        autoComplete="off"
                                    />
                                </div>

                                {filteredMenus.length > 0 && (
                                    <Combobox.Options static className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-slate-800 dark:text-slate-200 custom-scrollbar">
                                        {filteredMenus.map((menu) => (
                                            <Combobox.Option
                                                key={menu.id}
                                                value={menu}
                                                className={({ active }) =>
                                                    `cursor-pointer select-none px-4 py-2 ${
                                                        active ? 'bg-indigo-600 text-white' : ''
                                                    }`
                                                }
                                            >
                                                {({ active }) => (
                                                    <div className="flex items-center gap-3">
                                                        <menu.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                                                        <span className="font-medium">{menu.name}</span>
                                                    </div>
                                                )}
                                            </Combobox.Option>
                                        ))}
                                    </Combobox.Options>
                                )}

                                {query !== '' && filteredMenus.length === 0 && (
                                    <p className="p-4 text-sm text-slate-500">Tidak ada menu yang ditemukan.</p>
                                )}
                                
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Tekan <kbd className="font-sans px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 mx-0.5">esc</kbd> untuk menutup</p>
                                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium flex items-center gap-1">Global Search <ShieldCheckIcon className="w-3 h-3 text-indigo-500" /></p>
                                </div>
                            </Combobox>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
