import { useSearchParams, Link } from 'react-router-dom'
import { useAdminData } from '../context/AdminContext'
import { formatRupiah } from '../data/fixtures'
import type { Material } from '../data/fixtures'
import { RATING_LABELS } from '../data/fixtures'
import DemoBanner from '../components/ui/DemoBanner'
import WAButton from '../components/ui/WAButton'
import Button from '../components/ui/Button'
import { ArrowLeft, GitCompare, TrendingUp, TrendingDown, Minus } from 'lucide-react'
function getBestWorst(materials: Material[], key: keyof Material, tipe: string) {
  const vals = materials.map(m => m[key] as number)
  const best = tipe === 'cost' ? Math.min(...vals) : Math.max(...vals)
  const worst = tipe === 'cost' ? Math.max(...vals) : Math.min(...vals)
  return { best, worst }
}

function ValueIndicator({ value, best, worst, tipe }: { value: number; best: number; worst: number; tipe: string }) {
  if (value === best) return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-semibold"
      style={{ color: 'var(--color-neon)' }}
      aria-label="Nilai terbaik"
    >
      <TrendingUp size={12} aria-hidden="true" />
      Terbaik
    </span>
  )
  if (value === worst) return (
    <span
      className="inline-flex items-center gap-0.5 text-xs"
      style={{ color: 'var(--color-danger)' }}
      aria-label="Nilai terendah"
    >
      <TrendingDown size={12} aria-hidden="true" />
      Terendah
    </span>
  )
  if (tipe === 'configurable') return (
    <span className="text-xs" style={{ color: 'var(--color-warning)' }} aria-label="Arah kriteria perlu dikonfigurasi">
      <Minus size={12} aria-hidden="true" className="inline" /> Perlu dikonfigurasi
    </span>
  )
  return null
}

export default function PerbandinganPage() {
  const { materials: allMaterials, arahC5 } = useAdminData()
  const [params] = useSearchParams()
  const ids = params.get('ids')?.split(',').filter(Boolean) ?? []

  const KRITERIA_ROWS = [
    { key: 'hargaDemo' as const, label: 'C1 — Harga/pcs (Demo)', tipe: 'cost', satuan: 'Rp' },
    { key: 'serapKeringat' as const, label: 'C2 — Daya Serap Keringat', tipe: 'benefit', satuan: 'Skor 1–5' },
    { key: 'elastisitas' as const, label: 'C3 — Tingkat Kelenturan / Elastisitas', tipe: 'benefit', satuan: 'Skor 1–5' },
    { key: 'printing' as const, label: 'C4 — Kualitas Kecerahan Printing', tipe: 'benefit', satuan: 'Skor 1–5' },
    { key: 'ketebalan' as const, label: 'C5 — Ketebalan Kain / Gramasi', tipe: arahC5, satuan: 'Skor 1–5' },
    { key: 'keawetan' as const, label: 'C6 — Keawetan Serat / Anti-Berbulu', tipe: 'benefit', satuan: 'Skor 1–5' },
    { key: 'quickDry' as const, label: 'C7 — Kecepatan Kering / Quick Dry', tipe: 'benefit', satuan: 'Skor 1–5' },
  ]

  const materials = ids
    .map(id => allMaterials.find(m => m.id === id))
    .filter((m): m is Material => Boolean(m))

  if (materials.length < 2) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
        <GitCompare size={40} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--color-muted)' }} aria-hidden="true" />
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Pilih minimal 2 bahan untuk dibandingkan
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
          Pergi ke Katalog, pilih bahan, lalu klik Bandingkan.
        </p>
        <Link to="/katalog">
          <Button variant="primary">
            <ArrowLeft size={15} aria-hidden="true" />
            Ke Katalog
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/katalog"
          className="inline-flex items-center gap-1.5 text-sm mb-4 transition-base"
          style={{ color: 'var(--color-muted)' }}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Kembali ke Katalog
        </Link>
        <div className="flex items-center gap-2">
          <GitCompare size={20} style={{ color: 'var(--color-neon)' }} aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--color-text)' }}>
            Perbandingan Bahan
          </h1>
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
          Membandingkan {materials.length} bahan: {materials.map(m => m.nama).join(', ')}.
        </p>
      </div>

      <div className="mb-5">
        <DemoBanner />
      </div>

      {/* Desktop: Tabel perbandingan */}
      <div className="hidden sm:block">
        <div
          className="card-base overflow-hidden"
          style={{ borderColor: 'var(--color-border)', boxShadow: 'var(--card-shadow)' }}
        >
          <div className="overflow-x-auto" role="region" aria-label="Tabel perbandingan bahan" tabIndex={0}>
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}>
                  <th scope="col" className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide w-48" style={{ color: 'var(--color-muted)' }}>
                    Kriteria
                  </th>
                  {materials.map(m => (
                    <th key={m.id} scope="col" className="text-left px-4 py-4">
                      <div className="font-black text-sm" style={{ color: 'var(--color-text)' }}>{m.nama}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>{m.id}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KRITERIA_ROWS.map((row, ri) => {
                  const { best, worst } = getBestWorst(materials, row.key, row.tipe)
                  return (
                    <tr
                      key={row.key}
                      style={{ borderBottom: ri < KRITERIA_ROWS.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                    >
                      <td className="px-5 py-4 align-top">
                        <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{row.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                          {row.satuan}
                          {row.tipe === 'cost' && ' · cost'}
                          {row.tipe === 'benefit' && ' · benefit'}
                          {row.tipe === 'configurable' && ' · perlu dikonfirmasi'}
                        </div>
                      </td>
                      {materials.map(m => {
                        const val = m[row.key] as number
                        return (
                          <td key={m.id} className="px-4 py-4 align-top">
                            <div className="font-bold tabular-nums text-base" style={{ color: 'var(--color-text)' }}>
                              {row.key === 'hargaDemo' ? formatRupiah(val) : `${val} — ${RATING_LABELS[val] ?? val}`}
                            </div>
                            <div className="mt-1">
                              <ValueIndicator value={val} best={best} worst={worst} tipe={row.tipe} />
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* CTA per bahan */}
          <div
            className="flex gap-0"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div className="w-48 px-5 py-4 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
              Konsultasi
            </div>
            {materials.map(m => (
              <div key={m.id} className="flex-1 px-4 py-4">
                <WAButton materialName={m.nama} size="sm" id={`wa-compare-${m.id}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Kartu per bahan */}
      <div className="sm:hidden space-y-5">
        {materials.map(m => (
          <div
            key={m.id}
            className="card-base overflow-hidden"
            style={{ borderColor: 'var(--color-border)', boxShadow: 'var(--card-shadow)' }}
          >
            <div
              className="px-5 py-4 font-bold border-b"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', backgroundColor: 'var(--color-surface-raised)' }}
            >
              {m.nama}
              <span className="text-xs font-mono ml-2" style={{ color: 'var(--color-muted)' }}>{m.id}</span>
            </div>
            <div className="px-5 py-4 space-y-4">
              {KRITERIA_ROWS.map(row => {
                const { best, worst } = getBestWorst(materials, row.key, row.tipe)
                const val = m[row.key] as number
                return (
                  <div key={row.key}>
                    <div className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>{row.label}</div>
                    <div className="font-bold tabular-nums" style={{ color: 'var(--color-text)' }}>
                      {row.key === 'hargaDemo' ? formatRupiah(val) : `${val} — ${RATING_LABELS[val] ?? val}`}
                    </div>
                    <ValueIndicator value={val} best={best} worst={worst} tipe={row.tipe} />
                  </div>
                )
              })}
              <WAButton materialName={m.nama} size="sm" className="w-full mt-2" id={`wa-mobile-compare-${m.id}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Catatan */}
      <p className="text-xs mt-6" style={{ color: 'var(--color-muted)' }}>
        ⚠ Nilai "terbaik" dan "terendah" ditentukan berdasarkan tipe kriteria (benefit/cost). Arah C5 (ketebalan) bersifat configurable — perlu dikonfirmasi admin sebelum digunakan sebagai acuan.
      </p>
    </div>
  )
}
