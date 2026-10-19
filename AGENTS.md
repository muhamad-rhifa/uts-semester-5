# AGENTS.md — Kontrak Kerja Proyek ViaJersey SPK

## 1. Misi
Bangun website Sistem Pendukung Keputusan rekomendasi bahan kain jersey custom untuk ViaJersey sesuai `SOT/PRD.md`, `SOT/UI-GUIDELINE.md`, dan `SOT/IMPLEMENTATION_PLAN.md`.

## 2. Hierarki sumber kebenaran
1. Persetujuan tertulis terbaru dari pengguna.
2. `SOT/PRD.md` untuk kebutuhan, batasan, aturan bisnis, dan kriteria penerimaan.
3. `SOT/UI-GUIDELINE.md` untuk UI/UX, visual, navigasi, dan microcopy.
4. `SOT/IMPLEMENTATION_PLAN.md` untuk fase, arsitektur, serta keluaran tiap fase.
5. Konvensi teknis repo yang sudah ada, selama tidak bertentangan dengan sumber di atas.

Jika dokumen saling bertentangan atau ada keputusan yang belum disepakati, jelaskan konflik dan berhenti pada keputusan yang berdampak terhadap produk. Jangan diam-diam memilih interpretasi yang mengubah lingkup.

## 3. Gerbang persetujuan wajib

- Jangan menjalankan fase berikutnya tanpa persetujuan eksplisit pengguna untuk fase itu.
- Selesainya pekerjaan atau test tidak berarti fase berikutnya otomatis disetujui.
- Setelah menyelesaikan satu fase, berhenti dan berikan ringkasan: perubahan, file, hasil pemeriksaan, keterbatasan, dan keputusan terbuka.
- Minta persetujuan untuk lanjut. Persetujuan terhadap SOT bukan persetujuan otomatis untuk semua fase implementasi.
- Jika pengguna meminta revisi SOT, revisi dokumen terkait dahulu dan minta persetujuan kembali sebelum mengimplementasikan bagian yang berubah.

## 4. Hemat token dan fokus

- Baca hanya dokumen/file yang relevan dengan fase aktif; jangan mengulang isi seluruh SOT dalam respons.
- Rencanakan seperlunya, kerjakan perubahan terkecil yang lengkap, dan hindari abstraksi prematur.
- Jangan menulis ulang file tanpa kebutuhan.
- Jangan menambahkan fitur, dependency, layanan, halaman, atau refactor di luar fase.
- Gunakan data fixture terpusat untuk dummy data, bukan menyalinnya secara berbeda ke banyak komponen.

## 5. Kontrak produk

- Bahasa antarmuka: Bahasa Indonesia.
- Brand visual: Modern Sporty, tema gelap dengan aksen neon.
- Frontend: React.js + Vite + Tailwind CSS.
- Backend yang direncanakan: Node.js + Express.js; database: MySQL; kalkulasi WP di layanan SPK independen.
- Pelanggan tidak perlu akun pada versi awal.
- Data dummy wajib ditandai sebagai data demo dan tidak boleh dianggap sebagai harga/spesifikasi resmi.
- Tidak termasuk: transaksi pembayaran, keranjang belanja, desain jersey 3D, tracking pengiriman, akun pelanggan, serta riwayat rekomendasi.
- Jangan mengarang nomor WhatsApp, link produksi, kredensial, harga resmi, ketersediaan, atau spesifikasi bahan.

## 6. Kebenaran perhitungan WP

- Bobot pelanggan dinormalisasi sebelum kalkulasi.
- Kriteria cost diberi pangkat berbobot negatif; benefit menggunakan pangkat positif.
- Ranking disusun dari nilai preferensi akhir tertinggi ke terendah.
- Validasi seluruh nilai input yang dipangkatkan dan semua bobot.
- Harga maksimum (jika diberlakukan) adalah batas alternatif terpisah dari bobot preferensi harga.
- Arah kriteria ketebalan (C5) harus disepakati dan dikonfigurasi secara eksplisit sebelum kalkulasi final.
- Jangan menampilkan hasil fixture sebagai hasil kalkulasi live.
- Berikan unit test dan contoh perhitungan acuan sebelum menyatakan service WP akurat.

## 7. Keamanan dan kualitas

- Jangan menaruh password, token, atau secret dalam source frontend atau commit.
- Validasi data pada backend meskipun frontend juga memvalidasi.
- Jangan mengirim pesan error yang membocorkan stack trace atau detail rahasia kepada pelanggan.
- Periksa status loading, empty, success, dan error untuk alur yang memakai API.
- Ikuti aksesibilitas dasar: label terlihat, fokus keyboard, kontras yang memadai, dan feedback tak hanya mengandalkan warna.
- Jangan mengklaim lint, build, test, atau deployment berhasil kecuali perintahnya benar-benar dijalankan dan hasilnya diamati.

## 8. Protokol awal kerja

Sebelum mengedit repo:
1. Periksa struktur folder dan `package.json` yang sudah ada.
2. Pastikan fase aktif sudah disetujui.
3. Sebutkan singkat rencana perubahan untuk fase itu.
4. Pertahankan file pengguna dan konfigurasi yang tidak terkait.
5. Implementasikan hanya ruang lingkup fase aktif.
6. Jalankan pemeriksaan yang tersedia dan laporkan hasil sebenarnya.

## 9. Format laporan akhir fase

Gunakan format singkat:
- **Fase:** nomor dan nama.
- **Selesai:** keluaran yang benar-benar tersedia.
- **File:** file utama yang dibuat/diubah.
- **Validasi:** perintah yang dijalankan dan hasil aktual.
- **Belum selesai/risiko:** kendala atau keputusan terbuka.
- **Gerbang berikutnya:** minta persetujuan eksplisit sebelum lanjut.
