import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdminData } from '../../context/AdminContext'
import { checkBackendHealth } from '../../services/api'
import {
  Layers,
  SlidersHorizontal,
  ClipboardList,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Plus,
  Compass,
  Server,
  CheckCircle2,
} from 'lucide-react'
import DemoBanner from '../../components/ui/DemoBanner'
import Button from '../../components/ui/Button'
import { formatRupiah } from '../../data/fixtures'

export default function AdminDashboardPage() {
  const { materials, criteria, arahC5, resetToFixture } = useAdminData()
  const [apiStatus, setApiStatus] = useState<{ online: boolean; database?: string } | null>(null)

  useEffect(() => {
    checkBackendHealth().then(setApiStatus)
  }, [])

  // Hitung kelengkapan penilaian dinamis (C1–C7)
  const validEvaluatedCount = materials.filter(
    m =>
      m.hargaDemo > 0 &&
      m.serapKeringat >= 1 &&
      m.serapKeringat <= 5 &&
      m.elastisitas >= 1 &&
      m.elastisitas <= 5 &&
      m.printing >= 1 &&
      m.printing <= 5 &&
      m.ketebalan >= 1 &&
      m.ketebalan <= 5 &&
      m.keawetan >= 1 &&
      m.keawetan <= 5 &&
      m.quickDry >= 1 &&
      m.quickDry <= 5
  ).length

  const kelengkapanPct =
    materials.length > 0 ? Math.round((validEvaluatedCount / materials.length) * 100) : 0

  const activeCriteriaCount = criteria.filter(c => c.status === 'Aktif').length

  const handleReset = () => {
    if (window.confirm('Kembalikan semua data bahan dan kriteria admin ke data fixture default?')) {
      resetToFixture()
    }
  }

  const stats = [
    {
      label: 'Total Bahan',
      value: materials.length,
      sub: `${materials.length} alternatif tersedia`,
      icon: Layers,
      color: 'var(--color-neon)',
      to: '/admin/bahan',
    },
    {
      label: 'Kriteria Aktif',
      value: activeCriteriaCount,
      sub: `${criteria.length} kriteria terdaftar`,
      icon: SlidersHorizontal,
      color: 'var(--color-cyan)',
      to: '/admin/kriteria',
    },
    {
      label: 'Kelengkapan Penilaian',
      value: `${kelengkapanPct}%`,
      sub: `${validEvaluatedCount} dari ${materials.length} bahan lengkap`,
      icon: ClipboardList,
      color: kelengkapanPct === 100 ? 'var(--color-neon)' : 'var(--color-warning)',
      to: '/admin/penilaian',
    },
  ]

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1" style={{ color: 'var(--color-text)' }}>
            Dashboard Admin
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Ringkasan data bahan, kriteria, dan kelengkapan penilaian rekomendasi ViaJersey SPK.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-base"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-muted)',
            }}
            title="Kembalikan data ke fixture awal"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset Data Demo
          </button>
          <Link to="/admin/bahan">
            <Button variant="primary" size="sm">
              <Plus size={15} aria-hidden="true" />
              Kelola Bahan
            </Button>
          </Link>
        </div>
      </div>

      {/* Demo notice */}
      <div className="mb-5">
        <DemoBanner />
      </div>

      {/* Status Integrasi Arsitektur (Phase 6) */}
      <div
        className="rounded-xl border p-4 mb-6 flex items-start gap-3 text-sm"
        style={{
          backgroundColor: apiStatus?.online ? 'rgba(198,255,61,0.06)' : 'rgba(54,217,245,0.06)',
          borderColor: apiStatus?.online ? 'rgba(198,255,61,0.3)' : 'rgba(54,217,245,0.2)',
          color: apiStatus?.online ? 'var(--color-neon)' : 'var(--color-cyan)',
        }}
        role="status"
      >
        {apiStatus?.online ? (
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        ) : (
          <Server size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        )}
        <div className="flex-1">
          <div className="font-bold mb-0.5">
            Arsitektur Monorepo SPK — Phase 6 Integrasi Penuh
          </div>
          <div className="text-xs opacity-90" style={{ color: 'var(--color-text)' }}>
            Frontend terhubung secara hybrid dengan <strong>Backend REST API (Port 4000)</strong> dan <strong>SPK Microservice (Port 5001)</strong>.
            Status backend saat ini: <span className="font-semibold" style={{ color: apiStatus?.online ? 'var(--color-neon)' : 'var(--color-warning)' }}>{apiStatus?.online ? `Online (${apiStatus.database === 'mysql' ? 'MySQL Database' : 'Memory Repository Fallback'})` : 'Standalone Dev Mode (Sinkronisasi LocalStorage & In-Browser WP Engine Aktif)'}</span>.
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" role="list" aria-label="Statistik sistem">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              to={stat.to}
              className="rounded-2xl border p-5 flex flex-col gap-3 transition-base hover:border-[var(--color-neon)] group"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              role="listitem"
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-base group-hover:scale-105"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon size={20} style={{ color: stat.color }} aria-hidden="true" />
              </div>
              <div>
                <div className="text-3xl font-black tabular-nums" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--color-text)' }}>
                  {stat.label}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  {stat.sub}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* C5 Status Banner */}
      <div
        className="rounded-2xl border p-5 mb-8 flex items-center justify-between gap-4 flex-wrap"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ backgroundColor: 'rgba(255,200,87,0.1)' }}
          >
            <Compass size={18} style={{ color: 'var(--color-warning)' }} aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
              Konfigurasi Kriteria C5 (Ketebalan Kain)
            </div>
            <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>
              Arah saat ini:{' '}
              <span
                className="px-2 py-0.5 rounded uppercase font-mono text-xs font-bold"
                style={{
                  backgroundColor: arahC5 === 'benefit' ? 'rgba(198,255,61,0.15)' : 'rgba(54,217,245,0.15)',
                  color: arahC5 === 'benefit' ? 'var(--color-neon)' : 'var(--color-cyan)',
                }}
              >
                {arahC5}
              </span>{' '}
              ({arahC5 === 'benefit' ? 'Semakin tebal semakin diutamakan' : 'Semakin tipis semakin diutamakan'})
            </div>
          </div>
        </div>
        <Link
          to="/admin/kriteria"
          className="text-xs font-semibold flex items-center gap-1 transition-base"
          style={{ color: 'var(--color-cyan)' }}
        >
          Sesuaikan di Kriteria & Bobot <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {/* Quick overview of materials */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Daftar Bahan Terdaftar
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              {materials.length} alternatif yang masuk dalam pertimbangan SPK
            </p>
          </div>
          <Link
            to="/admin/bahan"
            className="text-xs font-semibold flex items-center gap-1 transition-base"
            style={{ color: 'var(--color-neon)' }}
          >
            Buka Kelola Bahan <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>ID</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>Nama Bahan</th>
                <th scope="col" className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>Harga Demo/pcs</th>
                <th scope="col" className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>Skor Lengkap?</th>
              </tr>
            </thead>
            <tbody>
              {materials.slice(0, 5).map((m, i) => {
                const isComplete =
                  m.serapKeringat > 0 && m.elastisitas > 0 && m.printing > 0 && m.ketebalan > 0
                return (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: i < Math.min(materials.length, 5) - 1 ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-muted)' }}>
                      {m.id}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text)' }}>
                      {m.nama}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: 'var(--color-neon)' }}>
                      {formatRupiah(m.hargaDemo)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: isComplete ? 'rgba(198,255,61,0.1)' : 'rgba(255,100,124,0.1)',
                          color: isComplete ? 'var(--color-neon)' : 'var(--color-danger)',
                        }}
                      >
                        {isComplete ? 'Lengkap' : 'Belum Lengkap'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
