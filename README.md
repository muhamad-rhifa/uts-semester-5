# ViaJersey SPK — Sistem Pendukung Keputusan Pemilihan Bahan Jersey Custom

Aplikasi web modern berbasis **Weighted Product (WP)** untuk membantu pelanggan memilih bahan kain jersey terbaik yang dipersonalisasi sesuai kebutuhan olahraga, kenyamanan, dan anggaran.

---

## 🚀 Fitur Utama & 9 Modul Sistem

1. **Modul Autentikasi Admin:** Proteksi otentikasi login admin dan pengelolaan sesi token JWT.
2. **Modul Beranda & Informasi:** Informasi pengenalan SPK, alur kerja sistem, dan akses cepat.
3. **Modul Katalog & Detail Bahan:** Spesifikasi 5 bahan jersey aktif beserta visualisasi karakteristik.
4. **Modul Manajemen Master Data Bahan & Kriteria:** Panel admin terpadu (CRUD bahan, matriks penilaian skor, kelola 7 kriteria & bobot).
5. **Modul Form Preferensi & Penilaian:** Input prioritas bobot 1–5 untuk 7 kriteria dan batas anggaran.
6. **Modul Mesin Perhitungan SPK (WP Core Engine):** Kalkulasi independen Weighted Product (WP) dengan normalisasi bobot, eksponen cost/benefit, dan peringkat relatif.
7. **Modul Hasil Rekomendasi & Ranking:** Rekomendasi bahan peringkat #1, rincian skor, transparansi normalisasi bobot, dan pemisahan bahan di luar anggaran.
8. **Modul Perbandingan Bahan Kain:** Komparasi matriks berdampingan (*side-by-side*) hingga 3 alternatif bahan.
9. **Modul Integrasi Konsultasi WhatsApp:** Penghubung langsung ke customer service dengan template pesan dinamis berisi nama bahan rekomendasi.

---

## 📊 7 Kriteria Penilaian (Metode WP)

| Kode | Kriteria | Sifat | Keterangan |
| :---: | :--- | :---: | :--- |
| **C1** | Harga per Pcs | *Cost* | Nilai Rupiah, semakin rendah semakin diutamakan. |
| **C2** | Daya Serap Keringat | *Benefit* | Skor 1–5, kemampuan menguapkan keringat. |
| **C3** | Tingkat Kelenturan / Elastisitas | *Benefit* | Skor 1–5, fleksibilitas gerak dinamis. |
| **C4** | Kualitas Kecerahan Hasil Printing | *Benefit* | Skor 1–5, ketajaman warna sublimasi. |
| **C5** | Ketebalan Kain / Gramasi | *Disesuaikan* | *Benefit* (tebal/kokoh) atau *Cost* (ringan/adem). |
| **C6** | Keawetan Serat / Anti-Berbulu | *Benefit* | Skor 1–5, ketahanan gesekan (*anti-pilling*). |
| **C7** | Kecepatan Kering / Quick Dry | *Benefit* | Skor 1–5, kecepatan kain mengering saat intensif. |

---

## 🛠️ Struktur Monorepo

```text
viajersey-sot-pack/
├── apps/
│   └── web/                    # Frontend React 19 + Vite + Tailwind CSS
├── services/
│   ├── api/                    # Backend REST API (Node.js + Express)
│   └── spk/                    # Layanan Kalkulasi WP Independen (Port 5001)
├── database/
│   ├── migrations/             # Skema DDL MySQL (001_initial_schema.sql)
│   ├── seed/                   # Data Demo Awal (seed_demo_data.sql)
│   └── scripts/                # Skrip Otomatisasi Backup & Restore Database
├── docs/
│   ├── API_CONTRACT.md         # Spesifikasi REST API Backend
│   ├── SPK_SERVICE_CONTRACT.md # Spesifikasi Microservice WP
│   └── DEPLOYMENT_GUIDE.md     # Panduan Deployment Produksi & Docker
├── SOT/                        # Single Source of Truth Dokumen Spesifikasi
└── docker-compose.yml          # Konfigurasi Container Produksi Terpadu
```

---

## 💻 Panduan Menjalankan Sistem Secara Lokal

### 1. Jalankan Frontend (Mode Cepat / Demo)
```bash
npm run dev
```
Buka browser di `http://localhost:5173`. Frontend memiliki engine WP lokal dan sinkronisasi data antar-tab via localStorage sehingga langsung dapat digunakan secara penuh tanpa ketergantungan wajib pada backend.

### 2. Jalankan Backend REST API (Port 4000)
```bash
npm run api:dev
```

### 3. Jalankan SPK Microservice (Port 5001)
```bash
npm run spk:dev
```

### 4. Menjalankan Seluruh Pengujian Otomatis
```bash
npm test
```
Menjalankan seluruh 21 unit & integration test untuk frontend web, backend API, dan SPK microservice.

---

## 🐳 Deployment Produksi (Docker Compose)

Cukup satu perintah di server:
```bash
docker compose up -d --build
```
Layanan otomatis aktif:
- Frontend Web: `http://localhost:80`
- Backend REST API: `http://localhost:4000/api`
- SPK Microservice: `http://localhost:5001`
- MySQL Database: `localhost:3306`
