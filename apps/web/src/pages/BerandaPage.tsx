import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Star, MessageCircle, CheckCircle } from 'lucide-react'
import { useAdminData } from '../context/AdminContext'
import Button from '../components/ui/Button'
import MaterialCard from '../components/ui/MaterialCard'

const STEPS = [
  {
    step: '01',
    judul: 'Atur Preferensi',
    deskripsi: 'Masukkan anggaran dan prioritas kriteria bahan sesuai kebutuhanmu.',
  },
  {
    step: '02',
    judul: 'Bandingkan Hasil',
    deskripsi: 'Sistem menghitung dan mengurutkan alternatif bahan berdasarkan bobot preferensimu.',
  },
  {
    step: '03',
    judul: 'Konsultasi ViaJersey',
    deskripsi: 'Hubungi ViaJersey langsung dengan bahan pilihanmu untuk memesan.',
  },
]

const FEATURES = [
  { icon: BarChart3, label: 'Berbasis data & perhitungan transparan' },
  { icon: Star, label: 'Rekomendasi sesuai prioritasmu' },
  { icon: MessageCircle, label: 'Konsultasi langsung via WhatsApp' },
]

export default function BerandaPage() {
  const { materials } = useAdminData()
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 sm:py-28 px-4"
        aria-label="Hero — ViaJersey SPK"
      >
        {/* Background decoration */}
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: 'var(--color-neon)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-8 pointer-events-none"
          style={{ backgroundColor: 'var(--color-cyan)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-[1200px] mx-auto text-center">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{
              borderColor: 'var(--color-neon-border)',
              color: 'var(--color-neon)',
              backgroundColor: 'var(--color-neon-soft)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
            Sistem Pendukung Keputusan
          </div>

          {/* H1 */}
          <h1
            className="font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5 max-w-4xl mx-auto"
            style={{ color: 'var(--color-text)' }}
          >
            Temukan Bahan Jersey yang{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--color-neon), var(--color-cyan))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Sesuai Kebutuhanmu
            </span>
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-muted)' }}>
            Hasil dihitung dari preferensi, harga, dan karakteristik bahan menggunakan metode
            Weighted Product. Bukan sekadar katalog — ini rekomendasi yang dipersonalisasi.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/rekomendasi" id="cta-mulai-rekomendasi">
              <Button variant="primary" size="lg" className="group">
                Mulai Rekomendasi
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-base" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/katalog" id="cta-lihat-katalog">
              <Button variant="secondary" size="lg">
                Lihat Katalog Bahan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16"
        aria-labelledby="steps-heading"
      >
        <h2 id="steps-heading" className="text-center text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Cara Kerja
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--color-muted)' }}>
          Tiga langkah mudah untuk menemukan bahan jersey terbaik
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              className="card-base relative p-6 hover:-translate-y-1 transition-base"
            >
              {/* Connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-full w-6 h-[2px] z-10"
                  style={{ backgroundColor: 'var(--color-border)' }}
                  aria-hidden="true"
                />
              )}
              <div
                className="text-4xl font-black mb-4 tabular-nums"
                style={{ color: 'var(--color-neon)', opacity: 'var(--step-num-opacity)' }}
                aria-hidden="true"
              >
                {s.step}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--color-text)' }}>{s.judul}</h3>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{s.deskripsi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        className="border-t border-b py-12 px-4"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        aria-labelledby="features-heading"
      >
        <div className="max-w-[1200px] mx-auto">
          <h2 id="features-heading" className="sr-only">Keunggulan ViaJersey SPK</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border"
                  style={{ backgroundColor: 'var(--color-neon-soft)', borderColor: 'var(--color-neon-border)' }}
                >
                  <Icon size={18} style={{ color: 'var(--color-neon)' }} aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Materials from Admin */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16" aria-labelledby="featured-materials-heading">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 id="featured-materials-heading" className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              Pilihan Bahan Kain Jersey
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
              Daftar bahan yang dapat dikelola dan disesuaikan langsung dari panel admin
            </p>
          </div>
          <Link
            to="/katalog"
            className="text-sm font-semibold flex items-center gap-1 transition-base"
            style={{ color: 'var(--color-neon)' }}
          >
            Lihat Semua Bahan ({materials.length}) <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.slice(0, 3).map(m => (
            <MaterialCard key={m.id} material={m} />
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center" aria-labelledby="cta-bottom-heading">
        <div
          className="card-base p-8 sm:p-12 border"
          style={{
            background: 'var(--color-cta-gradient)',
            borderColor: 'var(--color-neon-border)',
          }}
        >
          <h2 id="cta-bottom-heading" className="text-2xl sm:text-3xl font-black mb-4" style={{ color: 'var(--color-text)' }}>
            Mulai Temukan Bahan Jersey Terbaikmu
          </h2>
          <p className="mb-6 max-w-lg mx-auto text-sm" style={{ color: 'var(--color-muted)' }}>
            Isi preferensi satu kali, dapatkan ranking bahan yang dipersonalisasi, dan konsultasikan hasilnya langsung ke ViaJersey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/rekomendasi" id="cta-bottom-rekomendasi">
              <Button variant="primary" size="lg">
                <CheckCircle size={18} aria-hidden="true" />
                Mulai Rekomendasi Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
