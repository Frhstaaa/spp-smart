import React, { useState, useEffect } from 'react';
import ActionModal from './ActionModal';

export const appConfirm = (message, onConfirm, onCancel = () => {}) => {
 window.dispatchEvent(new CustomEvent('app-confirm-open', { 
 detail: { message, onConfirm, onCancel } 
 }));
};

// Also let's override native alert
export const overrideNativeAlert = () => {
 window.alert = (msg) => {
 window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: msg, type: 'warning', duration: 4000 } }));
 };
};

export default function GlobalConfirm() {
 const [state, setState] = useState({
 isOpen: false,
 message: '',
 onConfirm: null,
 onCancel: null
 });

 useEffect(() => {
 const handleOpen = (e) => {
 setState({
 isOpen: true,
 message: e.detail.message,
 onConfirm: e.detail.onConfirm,
 onCancel: e.detail.onCancel
 });
 };

 window.addEventListener('app-confirm-open', handleOpen);
 return () => window.removeEventListener('app-confirm-open', handleOpen);
 }, []);

 const handleConfirm = () => {
 if (state.onConfirm) state.onConfirm();
 close();
 };

 const close = () => {
 if (state.onCancel && state.isOpen) state.onCancel();
 setState({ ...state, isOpen: false });
 };

 return (
 <ActionModal
 isOpen={state.isOpen}
 onClose={close}
 onConfirm={handleConfirm}
 title="Konfirmasi Tindakan"
 description={state.message}
 type="confirm"
 intent="danger"
 confirmText="Ya, Lanjutkan"
 />
 );
}
