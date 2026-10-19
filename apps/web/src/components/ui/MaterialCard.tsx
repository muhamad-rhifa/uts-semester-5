import { Link } from 'react-router-dom'
import type { Material } from '../../data/fixtures'
import { formatRupiah } from '../../data/fixtures'
import DemoBanner from './DemoBanner'
import RatingBar from './RatingBar'
import { Eye, PlusSquare, CheckSquare } from 'lucide-react'

interface MaterialCardProps {
  material: Material
  isSelected?: boolean
  onToggleCompare?: (id: string) => void
  disableCompare?: boolean
}

export default function MaterialCard({
  material,
  isSelected = false,
  onToggleCompare,
  disableCompare = false,
}: MaterialCardProps) {
  return (
    <article
      className="rounded-2xl border flex flex-col overflow-hidden transition-base hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: isSelected ? 'var(--color-neon)' : 'var(--color-border)',
        boxShadow: isSelected ? '0 0 0 1px var(--color-neon)' : 'none',
      }}
      aria-label={`Bahan ${material.nama}${isSelected ? ' — dipilih untuk perbandingan' : ''}`}
    >
      {/* Tampilan gambar atau placeholder */}
      <div
        className="relative h-44 flex items-center justify-center select-none overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-surface-raised) 0%, #0d1520 100%)' }}
        aria-hidden="true"
      >
        {material.gambarUrl ? (
          <img
            src={material.gambarUrl}
            alt={material.nama}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Jika URL gambar error/rusak, sembunyikan img agar fallback tampil
              e.currentTarget.style.display = 'none'
              const fallback = e.currentTarget.parentElement?.querySelector('.monogram-fallback')
              if (fallback) (fallback as HTMLElement).style.display = 'block'
            }}
          />
        ) : null}

        <div className={`text-center monogram-fallback ${material.gambarUrl ? 'hidden' : 'block'}`}>
          <div className="text-5xl font-black tracking-tighter opacity-20" style={{ color: 'var(--color-neon)' }}>
            {material.nama.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-xs mt-1 font-mono" style={{ color: 'var(--color-muted)' }}>{material.id}</div>
        </div>

        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, var(--color-neon), var(--color-neon) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, var(--color-neon), var(--color-neon) 1px, transparent 1px, transparent 24px)' }}
        />
        <div className="absolute top-2 right-2 z-10">
          <DemoBanner compact />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h2 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>{material.nama}</h2>
          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-muted)' }}>{material.deskripsi}</p>
        </div>

        {/* Harga */}
        <div>
          <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--color-neon)' }}>
            {formatRupiah(material.hargaDemo)}/pcs
          </div>
          <div className="text-xs" style={{ color: 'var(--color-warning)' }}>
            Harga indikatif — konfirmasi sebelum memesan
          </div>
        </div>

        {/* Karakteristik singkat */}
        <div className="space-y-1.5 flex-1">
          <RatingBar label="Serap Keringat" value={material.serapKeringat} />
          <RatingBar label="Elastisitas" value={material.elastisitas} />
          <RatingBar label="Kualitas Printing" value={material.printing} />
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <Link
            to={`/katalog/${material.slug}`}
            id={`lihat-detail-${material.id}`}
            className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl text-sm font-semibold transition-base border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', backgroundColor: 'var(--color-surface-raised)' }}
            aria-label={`Lihat detail bahan ${material.nama}`}
          >
            <Eye size={14} aria-hidden="true" />
            Detail
          </Link>

          {onToggleCompare && (
            <button
              id={`bandingkan-${material.id}`}
              onClick={() => onToggleCompare(material.id)}
              disabled={disableCompare && !isSelected}
              aria-pressed={isSelected}
              aria-label={isSelected ? `Batalkan pilihan ${material.nama} untuk perbandingan` : `Pilih ${material.nama} untuk perbandingan`}
              className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl text-sm font-semibold transition-base border"
              style={{
                borderColor: isSelected ? 'var(--color-neon)' : 'var(--color-border)',
                color: isSelected ? 'var(--color-neon)' : 'var(--color-muted)',
                backgroundColor: isSelected ? 'rgba(198,255,61,0.08)' : 'var(--color-surface-raised)',
                opacity: disableCompare && !isSelected ? 0.4 : 1,
                cursor: disableCompare && !isSelected ? 'not-allowed' : 'pointer',
              }}
            >
              {isSelected
                ? <CheckSquare size={14} aria-hidden="true" />
                : <PlusSquare size={14} aria-hidden="true" />
              }
              {isSelected ? 'Dipilih' : 'Bandingkan'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
