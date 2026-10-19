# IMPLEMENTATION_PLAN — ViaJersey SPK WP

**Status:** Rencana; setiap fase implementasi menunggu persetujuan eksplisit pengguna  
**Versi:** 1.0  
**Stack frontend:** React.js + Vite + Tailwind CSS  
**Stack backend yang direncanakan:** Node.js + Express.js  
**Database:** MySQL  
**Metode SPK:** Weighted Product (WP)  

## 1. Prinsip pelaksanaan

- SOT menjadi sumber kebenaran untuk fitur, visual, batasan, dan kriteria penerimaan.
- Kerjakan satu fase pada satu waktu. Jangan mulai fase berikutnya hanya karena fase sebelumnya selesai.
- Di akhir setiap fase, tampilkan ringkasan perubahan, hasil test, kendala, dan minta persetujuan eksplisit untuk lanjut.
- Dilarang menambah fitur di luar PRD tanpa perubahan SOT yang disetujui.
- Data dummy harus diberi label dan tidak boleh disajikan sebagai fakta komersial.
- Frontend tidak menjadi sumber kebenaran untuk perhitungan WP.

## 2. Gambaran arsitektur

```text
Browser
  └── React + Vite + Tailwind (frontend independen)
        └── HTTPS/JSON REST API
              └── Backend API Service (Node.js + Express)
                    ├── MySQL (akses data melalui backend)
                    └── SPK Service (layanan kalkulasi WP independen)
```

### Tanggung jawab
- **Frontend:** routing/tampilan, form, validasi UX, status loading/error, konsumsi API.
- **Backend API:** endpoint publik/admin, autentikasi admin, validasi domain, pengambilan dan penyimpanan data, panggilan SPK service.
- **SPK service:** menerima matriks alternatif, bobot, dan tipe kriteria; memvalidasi masukan; menghitung `S`/`V`; mengembalikan ranking dan detail perhitungan.
- **MySQL:** menyimpan data bahan, kriteria, bobot default, skor bahan, serta admin.

Pemisahan proses/deployment SPK perlu nyata jika proyek akan mengklaim arsitektur microservice. Jangan hanya menamai satu fungsi di monolit sebagai “microservice”. Pada tahap awal, layanan bisa berjalan lokal pada port berbeda; deployment produksi dibahas kemudian.

## 3. Usulan struktur repositori

```text
viajersey-spk/
├── AGENTS.md
├── EXECUTION_PROMPT.md
├── SOT/
│   ├── PRD.md
│   ├── UI-GUIDELINE.md
│   └── IMPLEMENTATION_PLAN.md
├── apps/
│   └── web/                    # React + Vite + Tailwind
├── services/
│   ├── api/                    # Node.js + Express REST API
│   └── spk/                    # layanan WP independen
├── database/
│   ├── migrations/             # skema terkontrol versi
│   └── seed/                   # data demo dengan label yang jelas
├── docs/                       # kontrak API/test notes jika diperlukan
└── .env.example
```

Struktur adalah usulan awal, bukan kewajiban untuk membuat semua folder pada fase pertama jika belum diperlukan. Jangan menambahkan dependensi atau layanan infra yang tidak mendukung kebutuhan PRD.

## 4. Fase pelaksanaan dan gerbang persetujuan

### Phase 0 — SOT dan persetujuan (dokumen saat ini)
**Tujuan:** menyepakati kebutuhan produk, visual, aturan WP, dan urutan kerja.

Deliverables:
- `SOT/PRD.md`
- `SOT/UI-GUIDELINE.md`
- `SOT/IMPLEMENTATION_PLAN.md`
- `AGENTS.md`
- `EXECUTION_PROMPT.md`

**Gerbang:** pengguna meninjau dokumen dan menyebutkan perubahan atau memberi persetujuan eksplisit. Belum ada aplikasi yang dibangun dalam fase ini.

### Phase 1 — Scaffold frontend dan design system
**Tujuan:** membuat kerangka React/Vite/Tailwind, token tema, layout responsif, routing minimum, dan komponen UI dasar.

Output:
- Aplikasi berjalan lokal dengan instruksi start yang terverifikasi.
- Theme tokens Modern Sporty.
- Header/footer publik dan shell admin dasar.
- Halaman placeholder beranda, katalog, rekomendasi, login admin, dan dashboard yang mengikuti UI guideline.
- Data demo diberi indikator demo.

Tidak termasuk: koneksi API nyata, database, kalkulasi WP produksi, transaksi, atau fitur di luar PRD.

**Gerbang:** jalankan lint/build yang tersedia, beri daftar halaman yang bisa ditinjau, lalu minta persetujuan.

### Phase 2 — Alur pelanggan dengan data dummy
**Tujuan:** membangun katalog, detail bahan, input preferensi, hasil ranking demo, perbandingan, dan tautan WhatsApp placeholder yang aman.

Output:
- Interaksi utama UI berfungsi dengan data fixture lokal yang terpisah dari komponen.
- Status loading/empty/error disiapkan untuk integrasi API.
- Perhitungan frontend, jika dipakai sementara untuk demonstrasi UI, diberi batas yang jelas dan tidak menjadi sumber perhitungan final; rekomendasi disarankan memakai fixture hasil uji sampai SPK service siap.

**Gerbang:** demonstrasi skenario pelanggan dan minta persetujuan.

### Phase 3 — Area admin UI
**Tujuan:** membangun halaman login dan tampilan CRUD bahan, kriteria/bobot, penilaian, validasi, dan dashboard menggunakan data demo.

Output:
- Form dan tabel responsif.
- Konfirmasi penghapusan dan feedback validasi.
- Tidak ada autentikasi palsu yang diklaim aman; tandai sebagai mock hingga backend tersedia.

**Gerbang:** demo alur admin dan minta persetujuan.

### Phase 4 — Kontrak API, backend, dan MySQL
**Tujuan:** menetapkan kontrak endpoint dan membangun backend API serta skema database.

Output minimum:
- `GET /api/materials`, `GET /api/materials/:id`
- Endpoint admin untuk bahan, kriteria, bobot, dan skor dengan proteksi autentikasi
- Endpoint rekomendasi pada API backend yang meneruskan permintaan ke SPK service
- Migrasi dan seed data demo
- Validasi input dan format error konsisten

Detail URL, skema request/response, autentikasi, dan upload gambar dikunci sebelum coding fase ini.

**Gerbang:** test API, skema, validasi, dan minta persetujuan.

### Phase 5 — SPK microservice dan verifikasi WP
**Tujuan:** menjalankan kalkulasi WP sebagai layanan independen dan memverifikasi nilai ranking.

Output minimum:
- Kontrak input/output service terdokumentasi.
- Penormalan bobot; arah benefit/cost; penanganan nilai tidak valid.
- Unit test untuk bobot, nilai preferensi, urutan ranking, kondisi seri, dan kesalahan data.
- Hasil dibandingkan dengan perhitungan acuan yang diperiksa secara manual.

**Gerbang:** tunjukkan test dan contoh kalkulasi, lalu minta persetujuan.

### Phase 6 — Integrasi menyeluruh dan hardening
**Tujuan:** menghubungkan UI dengan API dan SPK, memperbaiki kondisi loading/error, menguji keamanan dasar dan responsivitas.

Output:
- Skenario ujung ke ujung pelanggan dan admin.
- Cek validasi/otorisasi admin, environment variables, CORS, dan tidak ada rahasia di frontend.
- Pengujian build, uji lint/typecheck jika disediakan, serta catatan bug yang tersisa.

**Gerbang:** ringkasan pengujian dan minta persetujuan sebelum dianggap siap dipakai.

### Phase 7 — Persiapan rilis (opsional, persetujuan terpisah)
Konfigurasi deployment, domain, HTTPS, backup database, dan monitoring hanya dikerjakan setelah diminta/disetujui. Jangan menganggap fase ini termasuk implementasi lokal otomatis.

## 5. Pola kerja tiap fase

1. Baca `AGENTS.md` dan ketiga dokumen SOT sebelum mengubah kode.
2. Pastikan fase yang diminta dan gerbang sebelumnya telah disetujui.
3. Audit isi repo sebelum mengubah file; jangan menimpa file pengguna tanpa alasan.
4. Implementasikan hanya output fase aktif.
5. Jalankan pemeriksaan yang tersedia; jangan mengklaim test lulus jika belum dijalankan.
6. Laporkan: file berubah, fitur selesai, perintah test dan hasilnya, keterbatasan, dan keputusan yang masih terbuka.
7. Berhenti. Minta persetujuan eksplisit sebelum fase berikutnya.

## 6. Kebijakan keputusan dan dependency

- Utamakan dependency minimal yang kompatibel dengan React + Vite + Tailwind.
- Jangan menambahkan library UI besar, state manager, ORM, container orchestration, atau layanan pihak ketiga kecuali diperlukan dan disetujui.
- Jika keputusan yang belum ditentukan mengubah perilaku produk (terutama anggaran dan C5), jangan menebak secara diam-diam. Gunakan default yang dinyatakan pada PRD untuk mockup; sebelum backend WP final, tandai keputusan yang harus disetujui.
- Semua harga, skor, kredensial, nomor WhatsApp, dan gambar demo harus jelas sebagai placeholder.
- Jangan membuat riwayat rekomendasi pelanggan, pembayaran, desain 3D, atau pelacakan kiriman.

## 7. Definisi selesai proyek awal (Phase 1)

- `npm install` dan `npm run dev` berhasil mengikuti README/instruksi yang dibuat oleh implementasi.
- `npm run build` berhasil; lint dijalankan jika script tersedia.
- Tema, navigasi, dan layout responsive konsisten dengan `UI-GUIDELINE.md`.
- Jalur halaman utama dapat ditinjau tanpa backend.
- Tidak ada tombol yang menjanjikan aksi tetapi tidak melakukan apa-apa tanpa penanda mock/disabled yang jelas.
- Tidak ada integrasi backend pura-pura, data resmi palsu, atau fitur di luar SOT.
- Ringkasan fase dan permintaan persetujuan diberikan sebelum Phase 2.
