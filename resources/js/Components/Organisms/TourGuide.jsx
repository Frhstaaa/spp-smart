import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export default function TourGuide() {
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Hanya jalankan jika user belum pernah melihat tour (simpan di localStorage)
        const hasSeenTour = localStorage.getItem('simkas_tour_completed');
        if (!hasSeenTour) {
            // Tandai sudah melihat tour seketika saat pertama kali mount
            // agar tidak muncul lagi jika user pindah halaman di tengah tour
            localStorage.setItem('simkas_tour_completed', 'true');

            // Beri sedikit delay agar halaman selesai dirender
            setTimeout(() => {
                setRun(true);
            }, 1000);
        }
    }, []);

    const steps = [
        {
            target: 'body',
            content: 'Selamat datang di Smart SPP! Mari ikuti tur singkat untuk mengenal fitur-fitur baru kami.',
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '#ringkasan',
            content: 'Di sini Anda bisa melihat ringkasan keuangan dan tagihan bulan ini secara real-time.',
            placement: 'bottom',
        },
        {
            target: '.group', // Aksi Cepat
            content: 'Gunakan tombol Aksi Cepat ini untuk langsung membuka Kasir, Generate SPP, atau menambah Siswa.',
            placement: 'right',
        },
        {
            target: '.recharts-wrapper', // Grafik
            content: 'Arahkan kursor Anda ke grafik ini untuk melihat detail perbandingan tagihan Lunas vs Belum Lunas.',
            placement: 'left',
        },
        {
            target: 'body',
            content: 'Satu lagi! Kapan saja, Anda bisa menekan tombol Ctrl + K (atau Cmd + K) untuk mencari menu dengan cepat. Selamat bekerja!',
            placement: 'center',
        }
    ];

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            localStorage.setItem('simkas_tour_completed', 'true');
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#6366F1',
                    textColor: '#1e293b',
                    backgroundColor: '#ffffff',
                },
                tooltipContainer: {
                    textAlign: 'left'
                },
                buttonNext: {
                    backgroundColor: '#6366F1',
                    borderRadius: '8px',
                    padding: '8px 16px'
                },
                buttonBack: {
                    color: '#64748b'
                }
            }}
            locale={{
                back: 'Kembali',
                close: 'Tutup',
                last: 'Selesai',
                next: 'Lanjut',
                skip: 'Lewati Tur'
            }}
        />
    );
}
