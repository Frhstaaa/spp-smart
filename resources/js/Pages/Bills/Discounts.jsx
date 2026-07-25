import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Discounts({ auth, requests }) {
    return (
        <MainLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Approval Keringanan Biaya</h2>}>
            <Head title="Approval Keringanan Biaya" />
            <div className="py-4 md:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Daftar Pengajuan</h3>
                        {/* Table Placeholder */}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
