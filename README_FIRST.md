# ViaJersey SOT Pack — Mulai dari sini

Paket ini berisi dokumen sumber kebenaran dan kontrak untuk proyek website SPK rekomendasi bahan jersey ViaJersey.

## Isi paket

- `SOT/PRD.md` — kebutuhan produk, scope, fitur, aturan WP, data demo, dan kriteria penerimaan.
- `SOT/UI-GUIDELINE.md` — tema Modern Sporty, token visual, komponen, layout, dan panduan tiap layar.
- `SOT/IMPLEMENTATION_PLAN.md` — arsitektur usulan, fase kerja, keluaran, dan gerbang persetujuan.
- `AGENTS.md` — aturan kerja wajib untuk coding agent.
- `EXECUTION_PROMPT.md` — prompt implementasi Phase 1; hanya digunakan setelah persetujuan eksplisit.

## Cara menggunakan

1. Ekstrak isi ZIP ke root folder project atau repo.
2. Tinjau ketiga dokumen dalam folder `SOT`.
3. Minta revisi bila ada isi yang belum tepat, terutama aturan anggaran dan arah penilaian C5 (ketebalan kain).
4. Berikan persetujuan eksplisit sebelum memulai Phase 1.
5. Setelah setiap fase, coding agent wajib berhenti untuk meminta persetujuan sebelum melanjutkan.

## Peringatan data

Harga dan skor bahan yang tercantum di PRD adalah data dummy untuk UI/pengujian, bukan data resmi ViaJersey. Ganti setelah divalidasi oleh pemilik usaha.

Paket ini berisi dokumen dan prompt; **belum berisi source code aplikasi yang dapat dijalankan**. Implementasi aplikasi dimulai pada fase terpisah setelah SOT disetujui.
