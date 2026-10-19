# UI-GUIDELINE — ViaJersey Modern Sporty

**Status:** Draft untuk ditinjau dan disetujui pengguna  
**Versi:** 1.0  
**Arah visual:** Modern Sporty — antarmuka gelap, aksen neon, tegas, bersih, dan mudah digunakan pelanggan awam.

## 1. Prinsip desain

1. **Rekomendasi lebih penting daripada dekorasi.** Pengguna harus cepat memahami langkah berikutnya.
2. **Bahasa nonteknis.** Hindari istilah “vektor S” atau “normalisasi” pada antarmuka pelanggan; istilah teknis berada di panel admin atau dokumentasi.
3. **Harga transparan.** Harga dummy diberi label data demo; harga resmi tetap perlu dikonfirmasi ke ViaJersey.
4. **Data mudah dibandingkan.** Gunakan label, satuan, dan skala yang konsisten.
5. **Mobile-first.** Form panjang, ranking, dan tabel perbandingan harus tetap bisa dipakai pada ponsel.
6. **Tidak menambah cakupan.** Tidak ada halaman checkout, akun pelanggan, desain 3D, atau pelacakan pengiriman.

## 2. Identitas visual

### Palet warna

| Token | Hex | Kegunaan |
|---|---|---|
| `--color-bg` | `#080B12` | Latar utama |
| `--color-surface` | `#111827` | Kartu dan panel |
| `--color-surface-raised` | `#172033` | Panel menonjol / hover |
| `--color-border` | `#2A3548` | Border halus |
| `--color-text` | `#F4F7FB` | Teks utama |
| `--color-muted` | `#9AA8BC` | Teks sekunder |
| `--color-neon` | `#C6FF3D` | Aksi utama, indikator positif, fokus merek |
| `--color-cyan` | `#36D9F5` | Data sekunder, link, elemen teknologi |
| `--color-warning` | `#FFC857` | Peringatan / harga perlu dikonfirmasi |
| `--color-danger` | `#FF647C` | Error dan tindakan destruktif |

Gunakan neon secara hemat untuk CTA, status terpilih, angka ranking utama, dan aksen. Hindari seluruh paragraf berwarna neon. Gradient boleh terbatas pada hero atau elemen visual utama; jangan mengorbankan keterbacaan.

### Tipografi
- Gunakan font sans-serif modern yang tersedia secara lokal/fallback, misalnya Inter atau `ui-sans-serif`.
- H1: 32–48 px desktop, 28–34 px mobile; tebal.
- H2: 24–32 px desktop, 22–26 px mobile.
- Body: 14–16 px; teks penting tidak di bawah 14 px.
- Angka harga dan nilai ranking menggunakan angka tabular bila tersedia.
- Hindari teks kapital penuh untuk paragraf; gunakan untuk label pendek saja.

### Bentuk dan efek
- Radius kartu: 16–20 px; kontrol input: 10–12 px.
- Border tipis; bayangan lembut dan glow neon hanya untuk elemen fokus.
- Animasi 150–220 ms untuk hover/focus; hindari animasi berlebihan.
- Gunakan ikon konsisten, idealnya Lucide, serta label teks untuk aksi penting.

## 3. Tata letak dan navigasi

### Navigasi publik
- Header: wordmark `ViaJersey`, tautan `Beranda`, `Katalog Bahan`, `Rekomendasi`, dan tombol `Konsultasi`.
- Header desktop dapat sticky; pada ponsel gunakan navigasi ringkas tanpa menutupi konten.
- Footer: nama usaha, ringkasan, tautan kontak/WhatsApp dan catatan harga perlu dikonfirmasi.

### Area admin
- Layout terpisah dengan sidebar desktop dan menu ringkas di layar kecil.
- Navigasi: Dashboard, Bahan Kain, Kriteria & Bobot, Penilaian, Keluar.
- Halaman admin tetap memakai tema yang sama, tetapi mengutamakan keterbacaan data.

### Grid
- Konten utama maksimal sekitar 1200 px.
- Desktop katalog: 3 kolom; tablet: 2 kolom; ponsel: 1 kolom.
- Form rekomendasi: satu kolom di ponsel; dua panel berdampingan pada desktop jika tidak membuat form terlalu padat.
- Tabel ranking di ponsel dapat menjadi kartu ranking; tabel admin boleh bergulir horizontal hanya pada kontainer tabel, bukan seluruh halaman.

## 4. Komponen UI

- **Button primary:** latar neon, teks gelap, label tindakan spesifik.
- **Button secondary:** panel gelap dengan border; digunakan untuk perbandingan atau kembali.
- **Button danger:** hanya untuk penghapusan dan aksi destruktif.
- **Material card:** gambar/placeholder, nama bahan, harga, dua atau tiga highlight, dan tombol `Lihat detail` / `Bandingkan`.
- **Rating indicator:** label tertulis dan nilai 1–5; jangan hanya memakai bintang atau warna.
- **Preference control:** slider atau pilihan 1–5 dengan label verbal dari `Rendah` sampai `Sangat tinggi`; pilihan yang aktif terlihat jelas dan dapat dioperasikan dengan keyboard.
- **Budget control:** input Rupiah dan/atau pilihan rentang; pisahkan batas maksimum dari bobot kepentingan harga.
- **Ranking item:** nomor peringkat, nama material, nilai preferensi, harga, ringkasan alasan, dan tombol detail.
- **Notice:** banner netral untuk label data demo, harga belum dikonfirmasi, atau tidak ada alternatif dalam anggaran.
- **Form feedback:** validasi dekat dengan field terkait.
- **Loading / empty / error:** gunakan skeleton atau pesan eksplisit; jangan biarkan area kosong tanpa penjelasan.
- **Admin data table:** pencarian hanya jika dibutuhkan oleh pengelolaan daftar; aksi edit dan hapus jelas; konfirmasi sebelum menghapus.

## 5. Panduan per layar

### 5.1 Beranda
- Hero dengan pesan utama: “Temukan bahan jersey yang sesuai kebutuhanmu.”
- Subteks menjelaskan bahwa hasil dihitung dari preferensi, harga, dan karakteristik bahan.
- CTA utama `Mulai Rekomendasi`; CTA sekunder `Lihat Katalog`.
- Tampilkan ringkas alur 3 langkah: Atur preferensi → Bandingkan hasil → Konsultasi ViaJersey.
- Gunakan visual tekstur kain/jersey sebagai aset yang tidak mengganggu teks.

### 5.2 Katalog
- Judul dan keterangan bahwa bahan yang ditampilkan adalah varian tersedia/aktif.
- Kartu bahan dengan harga dan karakteristik inti.
- Jika menggunakan data dummy, tampilkan badge atau banner `DATA DEMO — harga dan skor belum dikonfirmasi`.
- Kondisi loading, tidak ada bahan, dan error harus dirancang.

### 5.3 Detail bahan
- Foto/placeholder besar beserta nama dan harga.
- Ringkasan deskripsi, kelebihan, serta lima kriteria dengan satuan/skala konsisten.
- CTA `Pilih untuk dibandingkan` dan `Konsultasi WhatsApp`.
- Hindari klaim teknis yang belum terverifikasi.

### 5.4 Form rekomendasi
- Jelaskan proses menggunakan bahasa sederhana.
- Bagian A: batas anggaran maksimum opsional dan toggle/opsi “gunakan sebagai batas hasil”. Jangan mencampurnya dengan bobot harga.
- Bagian B: prioritas Harga, Daya Serap Keringat, Elastisitas, Kualitas Printing, dan Ketebalan.
- Untuk tiap prioritas gunakan skala 1–5 dengan deskripsi verbal.
- Tampilkan ringkasan preferensi sebelum tombol `Hitung Rekomendasi`.
- Tampilkan `Kembali` tanpa menghapus input yang valid.

### 5.5 Hasil rekomendasi dan ranking
- Bagian atas: `Rekomendasi utama untuk preferensimu` beserta nama bahan, harga, dan alasan singkat.
- Daftar ranking alternatif di bawahnya, nilai V (opsional untuk transparansi) dan karakteristik inti.
- Jelaskan bahwa ranking mengikuti bobot preferensi yang dipilih.
- Jika tidak ada alternatif dalam anggaran, gunakan peringatan yang jelas dan tampilkan daftar alternatif di luar anggaran sebagai opsi terpisah, bukan sebagai hasil yang memenuhi batas.
- Tombol: `Bandingkan bahan`, `Lihat detail`, `Konsultasi WhatsApp`, dan `Ubah preferensi`.

### 5.6 Perbandingan
- Desktop: kolom bahan; baris kriteria.
- Ponsel: kartu per bahan dengan urutan kriteria sama.
- Tandai nilai tertinggi/rendah hanya sesuai arah benefit/cost yang ditetapkan; jangan menganggap seluruh nilai tinggi selalu lebih baik.

### 5.7 Login admin dan dashboard
- Login minimal: username/email, password, tombol masuk, pesan error generik.
- Dashboard: kartu total bahan, kriteria aktif, kelengkapan penilaian, dan tautan ke pengelolaan.
- Jangan meletakkan kredensial demo rahasia atau data sensitif pada screenshot.

### 5.8 CRUD bahan, kriteria, bobot, dan penilaian
- Gunakan form berlabel, helper text untuk skala, validasi per field, status aktif, dan konfirmasi hapus.
- Untuk `benefit/cost`, tampilkan penjelasan bahwa arah tipe memengaruhi hasil WP.
- Jangan biarkan admin menyimpan alternatif yang belum memiliki nilai wajib untuk kalkulasi tanpa status pengecualian yang eksplisit.

## 6. Konten dan microcopy

Pakai Bahasa Indonesia yang lugas dan hangat. Contoh:
- CTA: `Mulai Rekomendasi`, `Hitung Rekomendasi`, `Lihat Detail`, `Bandingkan`, `Konsultasi WhatsApp`.
- Kosong: `Belum ada bahan yang tersedia.`
- Loading: `Sedang menghitung rekomendasi bahan…`
- Error: `Rekomendasi belum dapat dihitung. Periksa koneksi lalu coba lagi.`
- Data demo: `Contoh data untuk pengembangan. Harga dan karakteristik perlu dikonfirmasi ke ViaJersey.`
- Harga: `Harga indikatif — konfirmasi sebelum memesan.`
- Tidak ada alternatif dalam anggaran: `Belum ada bahan yang masuk batas anggaran ini.`

Hindari klaim seperti `paling nyaman untuk semua orang`, `dijamin terbaik`, atau angka spesifikasi yang belum diverifikasi.

## 7. Responsivitas dan aksesibilitas

- Breakpoint awal Tailwind: `sm`, `md`, `lg`, `xl`; layout menyesuaikan isi, bukan hanya ukuran layar.
- Tap target disarankan minimal 44 × 44 px.
- Seluruh input memiliki label yang terlihat; placeholder bukan pengganti label.
- Kontras teks dan komponen diperiksa, termasuk warna neon pada latar terang/gelap.
- Fokus keyboard terlihat; semua aksi utama bisa diakses keyboard.
- Status sukses/error memiliki ikon atau teks, bukan warna saja.
- Hormati `prefers-reduced-motion`.
- Gunakan alt text informatif untuk gambar bahan; gambar dekoratif memakai alt kosong.

## 8. Data demo dan aset

- Nama bahan contoh: Dryfit Milano, Benzema, Serena, Paving, dan Dryfit Premium (contoh).
- Harga/skor berasal dari tabel dummy di `PRD.md`, bukan data resmi.
- Gunakan gambar placeholder yang konsisten dan beri label demo. Aset resmi ditambahkan hanya setelah tersedia dan memiliki izin penggunaan.
- Semua nomor WhatsApp, URL gambar, dan URL API harus berasal dari konfigurasi atau data, bukan hardcode yang berpura-pura resmi.

## 9. Checklist persetujuan UI

- [ ] Tema Modern Sporty gelap + neon disetujui.
- [ ] Palet dan tipografi disetujui.
- [ ] Struktur navigasi pelanggan/admin disetujui.
- [ ] Form preferensi dan representasi bobot disetujui.
- [ ] Presentasi hasil ranking dan kondisi anggaran disetujui.
- [ ] Penanganan data demo dan harga belum terkonfirmasi disetujui.
