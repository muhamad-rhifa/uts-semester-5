import { useParams, Link } from 'react-router-dom'
import { useAdminData } from '../context/AdminContext'
import { formatRupiah } from '../data/fixtures'
import RatingBar from '../components/ui/RatingBar'
import DemoBanner from '../components/ui/DemoBanner'
import Button from '../components/ui/Button'
import WAButton from '../components/ui/WAButton'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function DetailBahanPage() {
  const { slug } = useParams<{ slug: string }>()
  const { materials } = useAdminData()
  const material = materials.find(m => m.slug === slug || m.id === slug)

  if (!material) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Bahan tidak ditemukan</h1>
        <Link to="/katalog">
          <Button variant="secondary">
            <ArrowLeft size={16} aria-hidden="true" />
            Kembali ke Katalog
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          to="/katalog"
          className="inline-flex items-center gap-1.5 text-sm transition-base"
          style={{ color: 'var(--color-muted)' }}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Kembali ke Katalog
        </Link>
      </nav>

      <div className="mb-4">
        <DemoBanner />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tampilan gambar atau placeholder */}
        <div
          className="relative rounded-2xl overflow-hidden h-72 lg:h-96 flex items-center justify-center border"
          style={{
            background: 'var(--color-card-gradient)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--card-shadow)',
          }}
          aria-label={`Foto bahan ${material.nama}`}
        >
          {material.gambarUrl ? (
            <img
              src={material.gambarUrl}
              alt={material.nama}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const fallback = e.currentTarget.parentElement?.querySelector('.detail-monogram-fallback')
                if (fallback) (fallback as HTMLElement).style.display = 'block'
              }}
            />
          ) : null}

          <div className={`text-center z-10 detail-monogram-fallback ${material.gambarUrl ? 'hidden' : 'block'}`}>
            <div
              className="text-8xl font-black tracking-tighter opacity-15"
              style={{ color: 'var(--color-neon)' }}
              aria-hidden="true"
            >
              {material.nama.substring(0, 2).toUpperCase()}
            </div>
            <p className="text-xs font-mono mt-2" style={{ color: 'var(--color-muted)' }}>
              {material.id} — {material.nama}
            </p>
            <p className="text-xs mt-1 italic opacity-60" style={{ color: 'var(--color-muted)' }}>
              Foto ilustrasi kain jersey
            </p>
          </div>

          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, var(--color-neon), var(--color-neon) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, var(--color-neon), var(--color-neon) 1px, transparent 1px, transparent 24px)' }}
            aria-hidden="true"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {/* Nama + ID */}
          <div>
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--color-text)' }}>
                {material.nama}
              </h1>
              <span
                className="text-xs font-mono px-2 py-1 rounded"
                style={{ backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-muted)' }}
              >
                {material.id}
              </span>
            </div>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-muted)' }}>
              {material.deskripsi}
            </p>
          </div>

          {/* Harga */}
          <div
            className="rounded-xl p-4 border"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--card-shadow)' }}
          >
            <div className="text-xs uppercase tracking-wide mb-1 font-semibold" style={{ color: 'var(--color-muted)' }}>
              Harga Demo
            </div>
            <div className="text-2xl font-black tabular-nums" style={{ color: 'var(--color-neon)' }}>
              {formatRupiah(material.hargaDemo)}/pcs
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-warning)' }}>
              Harga indikatif — konfirmasi sebelum memesan
            </div>
          </div>

          {/* Kelebihan */}
          <div>
            <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Kelebihan</h2>
            <ul className="space-y-1.5">
              {material.kelebihan.map(k => (
                <li key={k} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                  <CheckCircle size={14} style={{ color: 'var(--color-neon)' }} aria-hidden="true" className="shrink-0" />
                  {k}
                </li>
              ))}
            </ul>
          </div>

          {/* Kriteria rating */}
          <div>
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Karakteristik Bahan (Skor Demo)</h2>
            <div className="space-y-3">
              <RatingBar label="C2 — Daya Serap Keringat" value={material.serapKeringat} />
              <RatingBar label="C3 — Elastisitas Kain" value={material.elastisitas} />
              <RatingBar label="C4 — Kualitas Kecerahan Printing" value={material.printing} />
              <RatingBar label="C5 — Ketebalan Kain" value={material.ketebalan} />
              <RatingBar label="C6 — Keawetan Serat / Anti-Berbulu" value={material.keawetan} />
              <RatingBar label="C7 — Kecepatan Kering / Quick Dry" value={material.quickDry} />
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/rekomendasi" id={`cta-rekomendasi-from-${material.id}`} className="flex-1">
              <Button variant="primary" className="w-full">
                Mulai Rekomendasi
              </Button>
            </Link>
            <WAButton
              materialName={material.nama}
              className="flex-1"
              id={`cta-wa-${material.id}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
