import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { ExclamationTriangleIcon, InformationCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export default function ActionModal({
 isOpen,
 onClose,
 onConfirm,
 title,
 description,
 type = 'confirm', // 'confirm' or 'prompt'
 confirmText = 'Konfirmasi',
 cancelText = 'Batal',
 intent = 'danger', // 'danger', 'primary', 'warning'
 promptPlaceholder = 'Masukkan teks...',
 promptRequired = true
}) {
 const [inputValue, setInputValue] = useState('');
 const [error, setError] = useState('');

 useEffect(() => {
 if (isOpen) {
 setInputValue('');
 setError('');
 }
 }, [isOpen]);

 const handleConfirm = () => {
 if (type === 'prompt' && promptRequired && !inputValue.trim()) {
 setError('Input ini wajib diisi.');
 return;
 }
 onConfirm(type === 'prompt' ? inputValue : true);
 onClose();
 };

 const intentStyles = {
 danger: {
 icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />,
 iconBg: 'bg-red-100 dark:bg-red-500/20',
 button: 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600',
 },
 warning: {
 icon: <QuestionMarkCircleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />,
 iconBg: 'bg-yellow-100 dark:bg-yellow-500/20',
 button: 'bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600',
 },
 primary: {
 icon: <InformationCircleIcon className="h-6 w-6 text-emerald-400" aria-hidden="true" />,
 iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
 button: 'bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600',
 }
 };

 const style = intentStyles[intent] || intentStyles.primary;

 return (
 <Transition show={isOpen} as={Fragment}>
 <Dialog as="div" className="relative z-50" onClose={onClose}>
 <TransitionChild
 as={Fragment}
 enter="ease-out duration-300"
 enterFrom="opacity-0"
 enterTo="opacity-100"
 leave="ease-in duration-200"
 leaveFrom="opacity-100"
 leaveTo="opacity-0"
 >
 <div className="fixed inset-0 bg-gray-100 dark:bg-gray-950/80 backdrop-blur-sm transition-opacity" />
 </TransitionChild>

 <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
 <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
 <TransitionChild
 as={Fragment}
 enter="ease-out duration-300"
 enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
 enterTo="opacity-100 translate-y-0 sm:scale-100"
 leave="ease-in duration-200"
 leaveFrom="opacity-100 translate-y-0 sm:scale-100"
 leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
 >
 <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-lg">
 <div className="bg-white dark:bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
 <div className="sm:flex sm:items-start">
 <div className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${style.iconBg}`}>
 {style.icon}
 </div>
 <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
 <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
 {title}
 </Dialog.Title>
 <div className="mt-2">
 <p className="text-sm text-gray-600 dark:text-gray-400">
 {description}
 </p>
 </div>

 {type === 'prompt' && (
 <div className="mt-4">
 <input
 type="text"
 className="block w-full rounded-md border-0 bg-white dark:bg-gray-800 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
 placeholder={promptPlaceholder}
 value={inputValue}
 onChange={(e) => {
 setInputValue(e.target.value);
 if (error) setError('');
 }}
 onKeyDown={(e) => {
 if (e.key === 'Enter') {
 e.preventDefault();
 handleConfirm();
 }
 }}
 autoFocus
 />
 {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
 </div>
 )}
 </div>
 </div>
 </div>
 <div className="bg-white dark:bg-gray-800/50 border-t border-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
 <button
 type="button"
 className={`inline-flex w-full justify-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm sm:ml-3 sm:w-auto ${style.button}`}
 onClick={handleConfirm}
 >
 {confirmText}
 </button>
 <button
 type="button"
 className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-50 dark:bg-gray-700 sm:mt-0 sm:w-auto"
 onClick={onClose}
 >
 {cancelText}
 </button>
 </div>
 </Dialog.Panel>
 </TransitionChild>
 </div>
 </div>
 </Dialog>
 </Transition>
 );
}
