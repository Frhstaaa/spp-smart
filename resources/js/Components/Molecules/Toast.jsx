import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { usePage } from '@inertiajs/react';
import { 
 CheckCircleIcon, 
 XCircleIcon, 
 ExclamationTriangleIcon, 
 InformationCircleIcon,
 XMarkIcon 
} from '@heroicons/react/24/outline';

// Utility function to trigger toast from anywhere (client-side)
export const triggerToast = (message, type = 'success', duration = 3000) => {
 window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type, duration } }));
};

export default function Toast() {
 const { flash, errors } = usePage().props;
 const [toasts, setToasts] = useState([]);

 const addToast = (message, type = 'success', duration = 3000) => {
 const id = Date.now() + Math.random().toString(36).substr(2, 9);
 setToasts((prev) => [...prev, { id, message, type }]);

 if (duration > 0) {
 setTimeout(() => {
 removeToast(id);
 }, duration);
 }
 };

 const removeToast = (id) => {
 setToasts((prev) => prev.filter((toast) => toast.id !== id));
 };

 // Listen for custom events
 useEffect(() => {
 const handleToastEvent = (e) => {
 const { message, type, duration } = e.detail;
 addToast(message, type, duration);
 };

 window.addEventListener('app-toast', handleToastEvent);
 return () => window.removeEventListener('app-toast', handleToastEvent);
 }, []);

 // Listen for Inertia flash & error changes
 useEffect(() => {
 if (flash?.success) addToast(flash.success, 'success');
 if (flash?.error) addToast(flash.error, 'error', 5000);
 if (flash?.warning) addToast(flash.warning, 'warning', 4000);
 if (flash?.info) addToast(flash.info, 'info');
 
 // Also catch generic errors returned via back()->withErrors(['message' => '...'])
 if (errors?.message) {
 addToast(errors.message, 'error', 5000);
 }
 }, [flash, errors]);

 return (
 <div className="fixed top-4 left-0 right-0 sm:left-auto sm:right-4 z-[100] flex flex-col gap-3 pointer-events-none px-4 sm:px-0 w-full sm:max-w-sm">
 {toasts.map((toast) => (
 <Transition
 key={toast.id}
 show={true}
 appear={true}
 enter="transform ease-out duration-300 transition"
 enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
 enterTo="translate-y-0 opacity-100 sm:translate-x-0"
 leave="transition ease-in duration-200"
 leaveFrom="opacity-100"
 leaveTo="opacity-0"
 >
 <div className="pointer-events-auto w-full overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-xl shadow-black/40 ring-1 ring-white/10 flex items-start p-4 backdrop-blur-sm">
 <div className="shrink-0 pt-0.5">
 {toast.type === 'success' && <CheckCircleIcon className="h-6 w-6 text-emerald-400" aria-hidden="true" />}
 {toast.type === 'error' && <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />}
 {toast.type === 'warning' && <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />}
 {toast.type === 'info' && <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />}
 </div>
 <div className="ml-3 w-0 flex-1">
 <p className="text-sm font-medium text-gray-900 dark:text-white">
 {toast.type === 'success' ? 'Sukses' 
 : toast.type === 'error' ? 'Kesalahan' 
 : toast.type === 'warning' ? 'Peringatan' 
 : 'Informasi'}
 </p>
 <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{toast.message}</p>
 </div>
 <div className="ml-4 flex shrink-0">
 <button
 type="button"
 className="inline-flex rounded-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 focus:outline-none"
 onClick={() => removeToast(toast.id)}
 >
 <span className="sr-only">Close</span>
 <XMarkIcon className="h-5 w-5" aria-hidden="true" />
 </button>
 </div>
 </div>
 </Transition>
 ))}
 </div>
 );
}
