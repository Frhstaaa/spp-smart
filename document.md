# Dokumentasi Sistem Manajemen Apotek

Dokumen ini berisi penjelasan komprehensif mengenai arsitektur, alur sistem, skema database, serta fitur-fitur yang terdapat dalam Aplikasi Manajemen Apotek ini.

---

## 1. Arsitektur & Teknologi (Tech Stack)
Aplikasi ini dibangun menggunakan tumpukan teknologi modern untuk memastikan kecepatan, keamanan, dan pengalaman pengguna yang interaktif:
* **Backend Framework:** Laravel (PHP)
* **Frontend Library:** React.js dengan pendekatan SPA (Single Page Application)
* **Penyambung (Connector):** Inertia.js (menjembatani Laravel dan React tanpa perlu membangun REST API secara manual untuk rendering halaman)
* **Styling & UI:** Tailwind CSS (dengan fitur terintegrasi Light Mode & Dark Mode)
* **Database:** SQLite (Dapat dimigrasikan dengan mudah ke MySQL/PostgreSQL di tingkat produksi)

---

## 2. Fitur Utama Aplikasi

Sistem ini dirancang untuk memfasilitasi operasional harian apotek secara *end-to-end*. Berikut adalah modul-modul utamanya:

### A. Modul Master Data
Modul ini bertugas untuk menyimpan data statis yang menjadi referensi utama bagi modul transaksi.
* **Master Obat:** Mencatat data obat, kategori (ABC-VEN), stok, harga beli (HPP), harga jual, PPN, serta tanggal kedaluwarsa (Expired Date).
* **Master Karyawan (User):** Mengelola akses login dengan Role Based Access Control (RBAC) seperti `super_admin`, `apoteker`, `kasir`.
* **Master Pelanggan:** Menyimpan data pelanggan atau pasien yang sering bertransaksi.
* **Master Supplier:** Menyimpan direktori PBF (Pedagang Besar Farmasi) beserta riwayat transaksinya.
* **Master Dokter:** Menyimpan data dokter untuk keperluan peresepan obat.

### B. Modul Transaksi Utama (Point of Sales & Restock)
* **Kasir Penjualan (POS):** Antarmuka responsif bagi kasir untuk melayani pembelian. Mendukung pencarian obat langsung, perhitungan diskon, PPN, serta mencetak struk kasir (*thermal receipt*). Terintegrasi langsung dengan pemotongan stok otomatis secara *real-time*.
* **Pembelian & Restock (Supplying):** Fitur untuk mencatat barang masuk (Purchase Order/PO) dari supplier. Otomatis akan menambah stok obat, memperbarui HPP dengan metode FIFO, serta menghitung PPN pembelian.
* **Manajemen Resep:** Modul khusus untuk melayani penebusan obat menggunakan resep dokter.

### C. Modul Manajemen Stok (Inventory)
* **Stock Opname:** Fitur untuk mencocokkan stok fisik di gudang/rak dengan stok di sistem.
* **Stock Adjustment:** Modul untuk melakukan penyesuaian stok jika terjadi kerusakan, kehilangan, obat *expired*, atau pembatalan transaksi (Void).
* **Approval Void (Pembatalan):** Kasir dapat mengajukan pembatalan nota penjualan, namun stok dan status void hanya akan disetujui (dieksekusi) oleh Kepala Apotek (Admin).

### D. Modul Laporan & Dashboard Analitik
Menyajikan matriks visual (Chart/Grafik) serta tabel data rekapitulasi, antara lain:
* **Laba / Rugi:** Perhitungan laba bersih berdasarkan HPP dan Harga Jual aktual.
* **Top 5 Selling:** Pemantauan obat terlaris beserta grafiknya.
* **Buku Defecta:** Daftar obat yang stoknya sudah menyentuh batas minimum (*Reorder Point*) untuk segera dipesan.
* **Dead Stock & Expired Warning:** Sistem otomatis mendeteksi obat yang mandek (tidak laku lebih dari 90 hari) dan obat yang mendekati masa kedaluwarsa.
* **Performa Supplier:** Melacak total transaksi per supplier.

---

## 3. Skema Database Utama (Database Tables)

Basis data aplikasi dirancang saling berelasi untuk menjaga integritas data akuntansi dan inventaris.

### Tabel Entitas Utama:
1. `users` (id, name, email, role, password)
2. `obats` (Id_Obat, Nama, Kategori, Harga_Beli, Harga_Jual, Stok, Expired_Date, dll)
3. `pelanggans` (Id_Pelanggan, Nama, Alamat, No_Telp)
4. `suppliers` (Id_Supplier, Nama, Alamat, No_Telp)
5. `dokters` (Id_Dokter, Nama, Spesialis, SIP)

### Tabel Transaksi:
6. `penjualans` (Id_Penjualan, Tanggal, Id_Pelanggan, Id_Karyawan, Total_Estimasi, Total, Diskon_Global, PPN, status, alasan_void)
7. `detail_penjualans` (Id_Penjualan, Id_Obat, Jumlah, Harga, Diskon, PPN, Subtotal, Hpp_Saat_Terjual)
8. `supplying_obats` (Id_PO, Tanggal, Id_Supplier, Status, Total)
9. `detail_supplying_obats` (Id_PO, Id_Obat, Harga_Beli, PPN, Jumlah, Subtotal)
10. `reseps` dan `detail_reseps` (Pencatatan dokter dan obat resep)

### Tabel Pengawasan Stok:
11. `stock_opnames` (Id_Opname, Tanggal, user_id, Keterangan, Status)
12. `stock_adjustments` (Id_Adjustment, Id_Obat, user_id, Jenis_Transaksi [penjualan/kerusakan/expired/dll], Stok_Awal, Jumlah_Perubahan, Stok_Akhir, Keterangan)

---

## 4. Alur Kerja Sistem (System Workflows)

### A. Alur Transaksi Penjualan (POS)
1. **Pilih Pelanggan** (opsional, bisa pelanggan umum).
2. **Cari Obat:** Kasir mengetik nama obat, sistem menampilkan *dropdown* beserta sisa stok dan harga.
3. **Add to Cart:** Obat masuk ke keranjang, sistem otomatis menghitung Subtotal + PPN + Diskon.
4. **Checkout:** Kasir menekan bayar. Sistem akan:
   - Menyimpan rekaman di tabel `penjualans` dengan status `completed`.
   - Menyimpan detail tiap item di `detail_penjualans` (mengunci harga HPP saat itu untuk akurasi laporan laba).
   - Memotong jumlah stok di tabel `obats`.
5. **Cetak Struk:** Struk dapat langsung dicetak menggunakan printer thermal.

### B. Alur Restock Obat (Pembelian dari Supplier)
1. Karyawan gudang membuat keranjang **Restock (Purchase Order)**.
2. Memasukkan nama Supplier, lalu mendata item obat yang datang beserta Harga Beli Baru dan PPN dari PBF.
3. Saat **Checkout/Selesai**, sistem akan:
   - Menyimpan data di tabel `supplying_obats` dan `detail_supplying_obats`.
   - Otomatis **menambahkan stok** di tabel `obats`.
   - (*Opsional/Logika Sistem*) Menyesuaikan Harga_Beli/HPP obat di master data jika ada kenaikan harga dari pabrik.

### C. Alur Pembatalan Transaksi (Void Flow)
Sistem memiliki kontrol keamanan yang ketat untuk mencegah penipuan oleh kasir.
1. Kasir di halaman Riwayat Penjualan menekan tombol **"Ajukan Void"** dan wajib mengisi Alasan Pembatalan.
2. Sistem akan mengubah status penjualan dari `completed` menjadi `pending_void`. (Stok belum kembali).
3. Super Admin/Kepala Apotek masuk ke **Dashboard Void Approvals**.
4. Kepala Apotek mengecek alasan dan menekan tombol **"Setujui Void"**.
5. Sistem akan:
   - Mengubah status penjualan menjadi `voided`.
   - Mengembalikan stok obat secara otomatis.
   - Mencatat aktivitas ini ke tabel `stock_adjustments` dengan kolom keterangan "Void Penjualan ID: TRX-XXX" dan mencatat `user_id` Kepala Apotek yang menyetujui.

---

## 5. Ringkasan Laporan & Audit
Karena apotek adalah bisnis retail dengan masa *expired* barang, aplikasi ini memfasilitasi audit dengan sangat baik. 
Aplikasi menjamin bahwa HPP (Harga Pokok Penjualan) tercatat **saat transaksi terjadi**, bukan HPP yang sekarang beredar. Ini berarti Laporan Laba Rugi akan selalu presisi walaupun harga *kulakan* obat dari pabrik sering naik-turun.

Selain itu, seluruh perubahan stok di luar jual-beli (seperti rusak, hilang, dsb) terekam secara independen di tabel `stock_adjustments` agar bisa diaudit oleh pemilik kapan saja.

---
*(Dokumen ini merupakan panduan arsitektural teknis untuk pengembangan, pemeliharaan, dan operasi sistem apotek Anda.)*
