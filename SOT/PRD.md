# PRD — ViaJersey SPK Rekomendasi Bahan Jersey

**Status:** Draft untuk ditinjau dan disetujui pengguna  
**Versi:** 1.0  
**Jenis dokumen:** Product Requirements Document  
**Produk:** Sistem Pendukung Keputusan Rekomendasi Pemilihan Bahan Kain Jersey Custom pada ViaJersey  

## 1. Ringkasan produk

Website membantu calon pelanggan ViaJersey yang belum memahami karakteristik kain jersey untuk membandingkan bahan dan memperoleh rekomendasi berdasarkan preferensi anggaran serta karakteristik kain. Rekomendasi dihitung menggunakan metode **Weighted Product (WP)** pada layanan backend yang dipisahkan dari frontend melalui arsitektur microservice.

Produk memiliki dua area penggunaan:
- **Pelanggan:** beranda, katalog, detail bahan, pengisian preferensi, hasil rekomendasi, perbandingan, dan tautan konsultasi WhatsApp.
- **Admin:** login dan pengelolaan data bahan, kriteria, bobot default, serta nilai penilaian alternatif.

## 2. Masalah yang diselesaikan

1. Pelanggan awam kesulitan membedakan bahan seperti Dryfit Milano, Benzema, Serena, dan Paving.
2. Penjelasan bahan berulang menyita waktu pemilik usaha.
3. Pelanggan perlu menyeimbangkan batas anggaran dengan kenyamanan dan kebutuhan penggunaan.
4. Rekomendasi yang diberikan perlu mempunyai dasar penilaian yang konsisten, bukan hanya deskripsi promosi.

## 3. Tujuan dan indikator keberhasilan

### Tujuan
- Membantu pelanggan menemukan alternatif bahan yang cocok dengan preferensinya.
- Menyajikan alasan yang mudah dipahami untuk hasil rekomendasi.
- Memusatkan pengelolaan data penilaian melalui area admin.
- Menjalankan kalkulasi WP pada layanan yang independen dari frontend.

### Indikator penerimaan versi awal
- Pelanggan dapat melihat katalog dan detail alternatif bahan tanpa login.
- Pelanggan dapat mengisi preferensi lima kriteria dan meminta rekomendasi.
- Backend mengembalikan nilai preferensi dan urutan alternatif yang konsisten dengan perhitungan WP pada data uji.
- Pelanggan dapat membandingkan bahan dan membuka tautan WhatsApp dengan bahan terpilih pada pesan awal.
- Admin yang terautentikasi dapat membuat, melihat, mengubah, dan menghapus alternatif bahan serta mengelola kriteria dan penilaiannya.
- Frontend responsif pada lebar ponsel, tablet, dan desktop.
- Kegagalan API dan masukan yang tidak valid ditampilkan sebagai pesan yang dapat dipahami.

## 4. Pengguna dan kebutuhan

### Pelanggan
- Tidak wajib membuat akun.
- Membutuhkan bahasa yang sederhana, harga yang jelas, dan penjelasan karakteristik kain.
- Dapat memberi prioritas berdasarkan kepentingan pribadi.
- Perlu melihat pilihan alternatif, bukan hanya satu jawaban tanpa konteks.

### Admin ViaJersey
- Login ke halaman pengelolaan.
- Memperbarui informasi bahan dan harga.
- Memelihara kriteria, bobot default, dan skor alternatif berdasarkan data yang telah diverifikasi.
- Tidak harus menguasai implementasi teknis algoritma untuk mengelola data.

## 5. Ruang lingkup

### Termasuk
- Semua fitur pelanggan dan admin yang tercantum pada bagian 6.
- Metode WP, validasi input, REST API, penyimpanan MySQL, dan pemisahan layanan frontend/API/SPK.
- Data dummy untuk pengembangan UI dan pengujian algoritma.
- Tampilan responsif dengan tema Modern Sporty: gelap dengan aksen neon.

### Tidak termasuk
- Desain jersey 3D atau editor desain jersey.
- Checkout, pembayaran daring, invoice, maupun keranjang belanja.
- Pelacakan pengiriman dan integrasi kurir.
- Riwayat rekomendasi atau akun pelanggan.
- Integrasi stok, penjualan, dan sistem kasir.
- Klaim bahwa nilai dummy atau harga contoh adalah data resmi ViaJersey.

## 6. Kebutuhan fungsional

### A. Area pelanggan

| ID | Fitur | Kebutuhan dan perilaku yang diharapkan | Kriteria penerimaan |
|---|---|---|---|
| CUS-01 | Beranda | Memperkenalkan ViaJersey, tujuan kalkulator rekomendasi, dan CTA menuju katalog atau mulai rekomendasi. | CTA menuju layar yang benar; layout responsif. |
| CUS-02 | Katalog bahan | Menampilkan alternatif yang tersedia beserta gambar, nama, ringkasan karakteristik, dan harga. | Data berasal dari API; kondisi loading, kosong, dan error tersedia. |
| CUS-03 | Detail bahan | Menampilkan foto, deskripsi, harga, kelebihan, daya serap, elastisitas, kualitas printing, dan ketebalan. | Detail sesuai ID bahan dan tidak menampilkan field yang tidak tersedia seolah-olah fakta. |
| CUS-04 | Form preferensi | Mengumpulkan preferensi harga/anggaran dan kepentingan empat kriteria karakteristik lainnya. | Form memiliki label, nilai terpilih jelas, dan validasi. |
| CUS-05 | Bobot preferensi | Mengubah prioritas pelanggan menjadi bobot aktif untuk kalkulasi; nilai awal dapat memakai bobot default admin. | Bobot tervalidasi, dinormalisasi, dan total bobot ternormalisasi = 1 (dengan toleransi numerik). |
| CUS-06 | Kalkulasi WP | Mengirim preferensi dan konteks alternatif ke layanan SPK melalui backend API. | Perhitungan tidak dilakukan sebagai sumber kebenaran di browser; error layanan ditangani. |
| CUS-07 | Hasil rekomendasi | Menunjukkan alternatif teratas, nilai preferensi, ringkasan alasan, harga, dan karakteristik. | Nilai dan ranking sama dengan respons backend; rekomendasi tidak mengklaim kepastian mutlak. |
| CUS-08 | Ranking | Mengurutkan semua alternatif yang lolos aturan kelayakan berdasarkan nilai V tertinggi. | Urutan menurun; nilai seri ditangani secara konsisten. |
| CUS-09 | Perbandingan | Memilih dan membandingkan alternatif berdasarkan harga dan lima kriteria. | Label, skala, dan satuan konsisten di seluruh alternatif. |
| CUS-10 | WhatsApp | Membuka WhatsApp ViaJersey dengan pesan konsultasi yang menyebut bahan terpilih. | Nomor tujuan berasal dari konfigurasi; nomor placeholder tidak dipakai untuk produksi. |

### B. Area admin

| ID | Fitur | Kebutuhan dan perilaku yang diharapkan | Kriteria penerimaan |
|---|---|---|---|
| ADM-01 | Login admin | Memverifikasi kredensial admin melalui backend. | Kredensial salah mendapat pesan umum; sesi/token dikelola dengan aman. |
| ADM-02 | Dashboard | Menampilkan ringkasan jumlah bahan, kriteria aktif, dan kelengkapan penilaian. | Ringkasan dihitung dari data, bukan angka statis ketika backend aktif. |
| ADM-03 | CRUD bahan | Membuat, membaca, mengubah, dan menghapus alternatif beserta foto/metadata yang didukung. | Validasi wajib; konfirmasi sebelum penghapusan; respons sukses/error jelas. |
| ADM-04 | Manajemen kriteria | Mengelola kode, nama, satuan, skala, status, dan jenis benefit/cost sesuai aturan. | Sistem mencegah konfigurasi yang tidak dapat dihitung. |
| ADM-05 | Bobot default | Mengatur bobot awal kriteria untuk pelanggan yang belum menyesuaikan preferensi. | Bobot positif/valid; perubahan memengaruhi preferensi default berikutnya. |
| ADM-06 | Penilaian alternatif | Mengelola skor karakteristik setiap bahan dan konfigurasi penilaian. | Data yang diperlukan untuk semua kriteria tersedia sebelum alternatif disertakan pada kalkulasi. |
| ADM-07 | Validasi data | Mencegah harga atau skor invalid, data wajib kosong, dan konfigurasi WP yang tidak sah. | Kesalahan diberitahukan pada field terkait sebelum disimpan. |

### C. Sistem dan arsitektur

| ID | Fitur | Kebutuhan dan perilaku yang diharapkan | Kriteria penerimaan |
|---|---|---|---|
| SYS-01 | REST API | Menyediakan endpoint terstruktur untuk katalog, autentikasi admin, data penilaian, dan rekomendasi. | Respons JSON konsisten; kode status HTTP sesuai. |
| SYS-02 | SPK service | Menghitung WP sebagai layanan terpisah dari UI. | Dapat diuji secara independen menggunakan input dan hasil acuan. |
| SYS-03 | MySQL | Menyimpan bahan, kriteria, bobot, skor, dan akun admin. | Skema memiliki relasi dan aturan integritas yang sesuai. |
| SYS-04 | Error handling | Menangani validasi, API tidak tersedia, timeout, dan data tidak lengkap. | Pengguna melihat pesan yang ramah; detail sensitif tidak bocor. |
| SYS-05 | Responsif | Mendukung ponsel, tablet, dan desktop. | Tidak ada scroll horizontal yang tidak disengaja pada lebar target. |
| SYS-06 | Pengujian | Memverifikasi fungsionalitas, API, integrasi layanan, dan hasil WP. | Ada test perhitungan, validasi, serta pemeriksaan build frontend. |

## 7. Aturan bisnis dan perhitungan WP

### Kriteria awal

| Kode | Kriteria | Jenis awal | Representasi |
|---|---|---|---|
| C1 | Harga per pcs | Cost | Nilai Rupiah positif; semakin rendah semakin diprioritaskan. |
| C2 | Daya serap keringat | Benefit | Skor kualitas 1–5 berdasarkan kemampuan menguapkan keringat. |
| C3 | Tingkat kelenturan / elastisitas kain | Benefit | Skor kualitas 1–5 berdasarkan keleluasaan gerak dinamis. |
| C4 | Kualitas kecerahan hasil printing | Benefit | Skor kualitas 1–5 berdasarkan ketajaman dan kecerahan sublimasi. |
| C5 | Ketebalan kain / gramasi | Konfigurabel | Arah benefit/cost disesuaikan (benefit = tebal/kokoh, cost = ringan/tipis). |
| C6 | Keawetan serat / anti-berbulu | Benefit | Skor kualitas 1–5 berdasarkan ketahanan kain terhadap gesekan/pilling. |
| C7 | Kecepatan kering / quick dry | Benefit | Skor kualitas 1–5 berdasarkan kecepatan kain mengering setelah basah. |

### Formula
Bobot kepentingan pelanggan dinormalisasi: `w_j = bobot_awal_j / Σ bobot_awal`. Untuk cost, bobot efektif bernilai negatif; untuk benefit, bobot efektif positif.

- `S_i = ∏ (x_ij ^ w_j)` dengan tanda bobot disesuaikan menjadi negatif untuk cost.
- `V_i = S_i / Σ S_i`.
- Alternatif diurutkan dari nilai `V_i` terbesar ke terkecil.

### Aturan penting
- Seluruh nilai yang dipangkatkan harus positif dan valid; nilai nol/negatif ditolak atau ditangani menggunakan aturan transformasi yang terdokumentasi, bukan dibiarkan menghasilkan `NaN`/infinity.
- Kriteria harga berjenis cost; semakin rendah harga relatif lebih diutamakan jika bobot harga tinggi.
- Preferensi anggaran maksimum, bila diaktifkan sebagai batas, harus dipisahkan dari bobot kepentingan harga. Jika tidak ada alternatif yang masuk anggaran, tampilkan kondisi “tidak ada alternatif dalam anggaran” dan tawarkan daftar terdekat dengan label yang jelas; jangan menyatakan bahan itu memenuhi anggaran.
- Nilai skor C2–C7 dan aturan konversi jawaban pelanggan ke bobot harus didokumentasikan dan konsisten.
- Ketebalan (C5) tidak selalu “semakin tinggi semakin bagus”. Admin/pelanggan dapat memilih arah kriteria yang sah (benefit = kokoh/tebal, cost = ringan/tipis).
- Hasil merupakan rekomendasi berdasarkan data dan bobot yang disediakan, bukan jaminan performa kain di semua kondisi.

## 8. Data dummy untuk pengembangan

**PENTING:** semua harga dan skor dalam tabel ini adalah **data dummy ilustratif**, bukan informasi resmi ViaJersey. Ganti setelah pemilik usaha mengonfirmasi harga, stok/varian, dan penilaian bahan.

| ID | Nama bahan | Harga dummy/pcs (Rp) | Serap keringat (1–5) | Elastisitas (1–5) | Printing (1–5) | Ketebalan dummy (1–5) | Keawetan serat (1–5) | Quick dry (1–5) |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| FAB-001 | Dryfit Milano | 45.000 | 4 | 4 | 4 | 3 | 4 | 4 |
| FAB-002 | Benzema | 40.000 | 3 | 4 | 4 | 3 | 4 | 4 |
| FAB-003 | Serena | 38.000 | 3 | 3 | 3 | 4 | 5 | 3 |
| FAB-004 | Paving | 35.000 | 3 | 3 | 3 | 3 | 3 | 3 |
| FAB-005 | Dryfit Premium (contoh) | 52.000 | 5 | 4 | 5 | 2 | 4 | 5 |

Nilai skor di atas hanya data uji untuk mengembangkan UI dan menguji algoritma. Jangan dipublikasikan sebagai klaim komersial sebelum diverifikasi oleh ViaJersey. Aset foto boleh berupa placeholder yang diberi label data demo sampai aset resmi tersedia.

### Bobot awal dummy
- C1 Harga per pcs: 5
- C2 Daya serap keringat: 4
- C3 Elastisitas: 3
- C4 Kualitas printing: 4
- C5 Ketebalan: 3
- C6 Keawetan serat: 3
- C7 Kecepatan kering: 4

Bobot contoh ini tidak bersifat rekomendasi bisnis; admin/pemilik harus meninjau sebelum pemakaian nyata.

## 9. Model data awal (konseptual)

- `admins`: id, nama, email/username, password_hash, created_at, updated_at.
- `materials`: id, nama, slug, deskripsi, harga_per_pcs, image_url, kelebihan, status_aktif, timestamps.
- `criteria`: id, kode, nama, tipe (`benefit`/`cost`), satuan, skala_min, skala_max, bobot_default, status_aktif.
- `material_scores`: id, material_id, criterion_id, nilai, catatan, timestamps.

Skema aktual, aturan upload gambar, dan autentikasi dipastikan pada fase implementasi setelah dokumen disetujui. Bobot preferensi pelanggan dapat dikirim sebagai input kalkulasi dan tidak wajib disimpan jika fitur riwayat tidak termasuk ruang lingkup.

## 10. Non-functional requirements

- **Responsif:** layout mengutamakan mobile dan tetap nyaman di desktop.
- **Aksesibilitas:** label form jelas, state tidak hanya dibedakan oleh warna, fokus keyboard terlihat, kontras teks memadai.
- **Kinerja:** daftar katalog tidak memuat gambar ukuran penuh tanpa optimasi; UI menyediakan loading state.
- **Keamanan:** kredensial admin tidak pernah ditanam di frontend; input diverifikasi backend; rahasia konfigurasi disimpan dalam environment variables.
- **Keandalan:** kesalahan jaringan tidak menyebabkan hasil palsu atau nilai ranking statis ditampilkan sebagai hasil terbaru.
- **Konsistensi:** satu sumber kebenaran untuk karakteristik material dan kalkulasi WP berada di backend.
- **Maintainability:** frontend, API, dan SPK dipisahkan secara eksplisit dengan kontrak request/response terdokumentasi.

## 11. Asumsi, keputusan tertunda, dan risiko

### Asumsi untuk draft
- Pelanggan tidak membutuhkan akun.
- Nomor WhatsApp dan aset produk resmi akan diberikan kemudian oleh ViaJersey.
- Skor karakteristik menggunakan skala numerik konsisten 1–5.
- Data demo digunakan selama tahap UI dan pengujian saja.

### Keputusan yang perlu disetujui sebelum implementasi
1. Apakah anggaran maksimum menjadi filter keras alternatif atau hanya preferensi cost? Rekomendasi default: sediakan batas anggaran opsional terpisah dari bobot harga.
2. Bagaimana tingkat kepentingan pelanggan dipetakan ke bobot numerik? Usulan awal: kontrol 1–5 per kriteria lalu dinormalisasi.
3. Bagaimana C5 ketebalan dinilai: benefit, cost, atau skor kecocokan yang disediakan admin? Arah harus dikunci sebelum data nyata dimasukkan.
4. Apakah data skor dan definisi tiap skala telah disetujui pemilik usaha?
5. Nomor WhatsApp resmi dan data bahan/foto apa yang boleh dipublikasikan?

### Risiko
- Skor dummy dianggap sebagai fakta jika label demo hilang.
- Harga dapat berubah; UI harus menyebutkan bahwa harga perlu dikonfirmasi.
- Hasil WP bias jika kriteria, skor, atau arah C5 tidak didefinisikan dengan benar.
- Arsitektur disebut microservice tetapi implementasi hanya satu proses; perlu pemisahan layanan nyata pada fase backend.

## 12. Definisi selesai untuk SOT

SOT siap masuk tahap implementasi ketika pengguna menyetujui ruang lingkup, lima kriteria dan arah C5, cara mengatur bobot, perlakuan terhadap anggaran, visual guideline, serta tahapan implementasi. Dokumen ini bukan persetujuan otomatis untuk mulai coding.
