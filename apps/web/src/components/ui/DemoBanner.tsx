import { AlertTriangle } from 'lucide-react'

interface DemoBannerProps {
  compact?: boolean
}

/**
 * Banner wajib untuk menandai data demo.
 * Wajib ditampilkan di setiap halaman yang menggunakan data fixture.
 */
export default function DemoBanner({ compact = false }: DemoBannerProps) {
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide"
        style={{ backgroundColor: 'rgba(255,200,87,0.15)', color: 'var(--color-warning)', border: '1px solid rgba(255,200,87,0.3)' }}
        role="note"
        aria-label="Data demo — bukan data resmi"
      >
        <AlertTriangle size={11} aria-hidden="true" />
        DATA DEMO
      </span>
    )
  }

  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
      style={{ backgroundColor: 'rgba(255,200,87,0.08)', border: '1px solid rgba(255,200,87,0.25)', color: 'var(--color-warning)' }}
      role="note"
      aria-label="Informasi data demo"
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>
        <strong>DATA DEMO —</strong> Harga dan skor bahan di halaman ini adalah contoh untuk pengembangan.
        Bukan informasi resmi ViaJersey. Konfirmasi sebelum memesan.
      </span>
    </div>
  )
}
