import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm() {
 const passwordInput = useRef();
 const currentPasswordInput = useRef();

 const {
 data,
 setData,
 errors,
 put,
 reset,
 processing,
 recentlySuccessful,
 } = useForm({
 current_password: '',
 password: '',
 password_confirmation: '',
 });

 const updatePassword = (e) => {
 e.preventDefault();

 put(route('password.update'), {
 preserveScroll: true,
 onSuccess: () => reset(),
 onError: (errors) => {
 if (errors.password) {
 reset('password', 'password_confirmation');
 passwordInput.current?.focus();
 }
 if (errors.current_password) {
 reset('current_password');
 currentPasswordInput.current?.focus();
 }
 },
 });
 };

 const inputClass = "w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-white/[0.08] text-sm text-slate-950 dark:text-white outline-none focus:border-indigo-500";
 const labelClass = "text-xs font-semibold text-slate-600 dark:text-slate-400 ";

 return (
 <form onSubmit={updatePassword} className="space-y-4">
 <div className="space-y-1">
 <label htmlFor="current_password" className={labelClass}>Password Saat Ini</label>
 <input
 id="current_password"
 ref={currentPasswordInput}
 value={data.current_password}
 onChange={(e) => setData('current_password', e.target.value)}
 type="password"
 className={inputClass}
 autoComplete="current-password"
 placeholder="Masukkan password lama"
 />
 {errors.current_password && <p className="text-red-400 text-xs mt-1">{errors.current_password}</p>}
 </div>

 <div className="space-y-1">
 <label htmlFor="password" className={labelClass}>Password Baru</label>
 <input
 id="password"
 ref={passwordInput}
 value={data.password}
 onChange={(e) => setData('password', e.target.value)}
 type="password"
 className={inputClass}
 autoComplete="new-password"
 placeholder="Masukkan password baru"
 />
 {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
 </div>

 <div className="space-y-1">
 <label htmlFor="password_confirmation" className={labelClass}>Konfirmasi Password Baru</label>
 <input
 id="password_confirmation"
 value={data.password_confirmation}
 onChange={(e) => setData('password_confirmation', e.target.value)}
 type="password"
 className={inputClass}
 autoComplete="new-password"
 placeholder="Ulangi password baru"
 />
 {errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{errors.password_confirmation}</p>}
 </div>

 <div className="flex items-center gap-4 justify-end pt-2">
 <Transition
 show={recentlySuccessful}
 enter="transition ease-in-out"
 enterFrom="opacity-0"
 leave="transition ease-in-out"
 leaveTo="opacity-0"
 >
 <p className="text-sm text-emerald-500 font-medium">Password berhasil diperbarui.</p>
 </Transition>
 <button
 type="submit"
 disabled={processing}
 className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
 >
 {processing ? 'Menyimpan...' : 'Simpan Password'}
 </button>
 </div>
 </form>
 );
}
