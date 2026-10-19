# Prompt Eksekusi Awal — ViaJersey SPK

> **Gunakan prompt ini hanya setelah pengguna menyetujui SOT dan secara eksplisit mengizinkan Phase 1.** Jika belum ada persetujuan tersebut, jangan mengubah kode; lakukan review dokumen dan laporkan pertanyaan/konflik yang perlu diputuskan.

## Prompt untuk coding agent

Kamu adalah senior frontend engineer yang bekerja berdasarkan SOT. Ikuti `AGENTS.md` dan baca:
- `SOT/PRD.md`
- `SOT/UI-GUIDELINE.md`
- `SOT/IMPLEMENTATION_PLAN.md`

### Fase aktif
**Phase 1 — Scaffold frontend dan design system saja.** Jangan mengerjakan Phase 2 atau fase backend.

### Tujuan
Buat fondasi aplikasi frontend ViaJersey dengan **React.js + Vite + Tailwind CSS**, mengikuti tema **Modern Sporty** (dark UI dengan aksen neon lime dan cyan). Fase ini menghasilkan shell dan halaman awal yang bisa dijalankan serta ditinjau; bukan implementasi fitur penuh.

### Pekerjaan yang diizinkan
1. Audit repo dan package yang sudah ada sebelum membuat perubahan.
2. Jika repo kosong, siapkan scaffold React/Vite yang minimal dan kompatibel dengan konfigurasi Tailwind yang dipilih. Jangan menambah versi/package secara acak apabila package sudah tersedia.
3. Buat token warna, tipografi, radius, spacing, dan komponen dasar yang diperlukan menurut UI guideline.
4. Buat layout publik dengan wordmark ViaJersey, navigasi responsif, footer, dan tema visual konsisten.
5. Buat shell halaman awal untuk Beranda, Katalog, Rekomendasi, Login Admin, dan Dashboard Admin. Gunakan konten demo seperlunya, ditandai sebagai demo.
6. Sediakan state aktif navigasi, fokus keyboard yang tampak, dan layout yang nyaman di ponsel maupun desktop.
7. Siapkan routing minimum hanya jika sesuai dengan dependency yang sudah ada atau benar-benar diperlukan. Pilih solusi paling ringan.
8. Tambahkan instruksi menjalankan aplikasi yang akurat, berdasarkan script yang benar-benar ada di `package.json`.
9. Jalankan pemeriksaan build/lint yang tersedia. Jangan membuat klaim hasil test yang tidak dijalankan.

### Larangan pada fase ini
- Jangan membangun backend, REST API, MySQL, autentikasi nyata, atau microservice WP.
- Jangan mengimplementasikan CRUD atau kalkulasi WP final.
- Jangan menambahkan checkout, pembayaran, akun pelanggan, riwayat rekomendasi, desain 3D, atau pelacakan pengiriman.
- Jangan memakai harga, skor, nomor WhatsApp, foto, atau spesifikasi yang seolah-olah resmi. Gunakan data/asset demo yang diberi label.
- Jangan menambahkan library besar, chart, state manager, atau komponen UI pihak ketiga tanpa kebutuhan dan persetujuan.
- Jangan melanjutkan ke Phase 2 setelah Phase 1 selesai.

### Kriteria penerimaan
- Aplikasi dapat dijalankan dari instruksi yang disediakan.
- Build produksi berhasil, atau kegagalan dilaporkan dengan output/error yang relevan.
- Shell UI dan halaman awal mengikuti `SOT/UI-GUIDELINE.md`.
- Layout berfungsi pada layar ponsel dan desktop.
- Tidak ada tombol aktif yang memberi kesan fitur sudah berfungsi jika masih berupa placeholder; gunakan tautan nyata, status nonaktif yang jelas, atau label mock.
- Tidak ada rahasia atau kredensial di frontend.
- Perubahan tetap terbatas pada Phase 1.

### Format jawaban ketika fase selesai
Laporkan secara ringkas:
1. Fitur/shell yang selesai.
2. File penting yang ditambahkan atau diubah.
3. Cara menjalankan aplikasi.
4. Build/lint/test yang dijalankan beserta hasil sebenarnya.
5. Batasan atau keputusan yang belum terselesaikan.
6. Minta persetujuan eksplisit pengguna untuk **Phase 2** dan berhenti sampai ada jawaban.
