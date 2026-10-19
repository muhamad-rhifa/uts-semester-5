/**
 * FIXTURE DATA — DATA DEMO UNTUK PENGEMBANGAN
 * Semua harga, skor, dan data di bawah adalah CONTOH ILUSTRATIF (PRD §8).
 * Bukan informasi resmi ViaJersey. Perlu dikonfirmasi sebelum produksi.
 */

export interface Material {
  id: string
  nama: string
  hargaDemo: number
  serapKeringat: number   // C2 (1–5)
  elastisitas: number     // C3 (1–5)
  printing: number        // C4 (1–5)
  ketebalan: number       // C5 (1–5)
  keawetan: number        // C6 (1–5)
  quickDry: number        // C7 (1–5)
  deskripsi: string
  kelebihan: string[]
  slug: string
  gambarUrl?: string
}

export const MATERIALS_FIXTURE: Material[] = [
  {
    id: 'FAB-001',
    nama: 'Dryfit Milano',
    hargaDemo: 45000,
    serapKeringat: 4,
    elastisitas: 4,
    printing: 4,
    ketebalan: 3,
    keawetan: 4,
    quickDry: 4,
    deskripsi: 'Bahan jersey dryfit dengan tekstur milano yang halus dan nyaman digunakan untuk olahraga ringan hingga sedang.',
    kelebihan: ['Ringan dan breathable', 'Warna cerah tahan lama', 'Nyaman untuk aktivitas harian'],
    slug: 'dryfit-milano',
  },
  {
    id: 'FAB-002',
    nama: 'Benzema',
    hargaDemo: 40000,
    serapKeringat: 3,
    elastisitas: 4,
    printing: 4,
    ketebalan: 3,
    keawetan: 4,
    quickDry: 4,
    deskripsi: 'Bahan jersey populer dengan keseimbangan antara kenyamanan dan ketahanan printing sublimasi.',
    kelebihan: ['Elastis dan fleksibel', 'Printing tajam', 'Harga terjangkau'],
    slug: 'benzema',
  },
  {
    id: 'FAB-003',
    nama: 'Serena',
    hargaDemo: 38000,
    serapKeringat: 3,
    elastisitas: 3,
    printing: 3,
    ketebalan: 4,
    keawetan: 5,
    quickDry: 3,
    deskripsi: 'Bahan jersey dengan ketebalan lebih baik, cocok untuk cuaca lebih dingin atau kebutuhan premium feel.',
    kelebihan: ['Ketebalan optimal', 'Cocok cuaca dingin', 'Tekstur premium'],
    slug: 'serena',
  },
  {
    id: 'FAB-004',
    nama: 'Paving',
    hargaDemo: 35000,
    serapKeringat: 3,
    elastisitas: 3,
    printing: 3,
    ketebalan: 3,
    keawetan: 3,
    quickDry: 3,
    deskripsi: 'Bahan jersey ekonomis dengan performa seimbang, pilihan hemat untuk jersey tim dalam jumlah besar.',
    kelebihan: ['Harga paling ekonomis', 'Cocok untuk tim besar', 'Mudah dirawat'],
    slug: 'paving',
  },
  {
    id: 'FAB-005',
    nama: 'Dryfit Premium',
    hargaDemo: 52000,
    serapKeringat: 5,
    elastisitas: 4,
    printing: 5,
    ketebalan: 2,
    keawetan: 4,
    quickDry: 5,
    deskripsi: 'Bahan jersey dryfit kelas premium dengan daya serap terbaik dan hasil printing paling tajam.',
    kelebihan: ['Daya serap keringat terbaik', 'Printing ultra tajam', 'Material eksklusif'],
    slug: 'dryfit-premium',
  },
]

export const DEFAULT_WEIGHTS = {
  C1_harga: 5,
  C2_serap: 4,
  C3_elastis: 3,
  C4_printing: 4,
  C5_tebal: 3,
  C6_keawetan: 3,
  C7_quickDry: 4,
}

export const RATING_LABELS: Record<number, string> = {
  1: 'Sangat Rendah',
  2: 'Rendah',
  3: 'Cukup',
  4: 'Baik',
  5: 'Sangat Baik',
}

export const formatRupiah = (amount: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
