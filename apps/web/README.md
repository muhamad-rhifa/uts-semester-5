# ViaJersey SPK — Web Frontend

Aplikasi frontend Sistem Pendukung Keputusan (SPK) rekomendasi bahan jersey custom untuk ViaJersey.

> **STATUS: Phase 3 selesai** — Area Admin UI lengkap & interaktif (Login form responsif, Dashboard dinamis real-time, CRUD Bahan Kain dengan modal & validasi, Manajemen Kriteria & penetapan arah kriteria C5 benefit/cost, Matriks Penilaian Alternatif). Data demo tersinkronisasi antar-halaman admin melalui `AdminContext`.

## Stack

- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router v7**
- **Lucide React** (ikon)
- **Node.js Test Runner** (unit testing modul WP)

## Cara menjalankan

```bash
# Dari direktori apps/web
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`.

## Menjalankan Pengujian (Unit Test)

```bash
npm test
```

Menjalankan pengujian kalkulasi Weighted Product di `src/lib/wp.test.ts` (normalisasi bobot, cost/benefit, benchmark matematis acuan, dan validasi nilai positif).

## Build produksi

```bash
npm run build
```

Output ke `dist/`. Build terverifikasi bebas error TypeScript (exit code 0).

## Halaman yang tersedia

| Path | Halaman | Status |
|---|---|---|
| `/` | Beranda | Aktif |
| `/katalog` | Katalog Bahan (dengan pemilihan perbandingan) | Aktif |
| `/katalog/:slug` | Detail Bahan & Karakteristik | Aktif |
| `/rekomendasi` | Form Preferensi & Anggaran Pelanggan | Aktif (Interaktif) |
| `/rekomendasi/hasil` | Hasil Rekomendasi & Ranking WP Demo | Aktif |
| `/perbandingan` | Perbandingan Bahan Berdampingan (hingga 3 bahan) | Aktif |
| `/admin/login` | Login Admin (validasi client-side, notice mock) | Aktif (Phase 3 UI) |
| `/admin/dashboard` | Dashboard Admin (metrik dinamis, ringkasan C5, reset) | Aktif (Phase 3 UI) |
| `/admin/bahan` | Kelola Bahan Kain (CRUD modal, pencarian, validasi) | Aktif (Phase 3 UI) |
| `/admin/kriteria` | Kriteria & Bobot (skala 1–5, konfigurasi arah C5) | Aktif (Phase 3 UI) |
| `/admin/penilaian` | Matriks Penilaian Alternatif (skor C1–C5 per bahan) | Aktif (Phase 3 UI) |

## Konfigurasi Lingkungan (.env)

Buat file `.env` di `apps/web` berdasarkan `.env.example`:
```env
VITE_WA_NUMBER=628xxxxxxxxxx
```
Jika `VITE_WA_NUMBER` belum diisi, tombol WhatsApp akan menampilkan status non-aktif dengan keterangan bahwa nomor belum dikonfigurasi, menghindari penggunaan nomor palsu.

## Catatan Integritas Data & Algoritma

- **Semua data adalah DATA DEMO** — bersumber dari fixture dan disimpan di context/localStorage untuk demo admin interaktif.
- **Kalkulasi WP di frontend adalah demonstrasi UI** — hasil ditandai dengan flag `isDemo: true`. Backend REST API dan service WP independen akan dibangun pada Phase 4 & Phase 5.
- **Arah kriteria C5 (Ketebalan)** dapat dikonfigurasi langsung di menu Kriteria & Bobot (benefit vs cost).
