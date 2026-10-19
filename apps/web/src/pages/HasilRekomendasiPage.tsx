import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { useAdminData } from '../context/AdminContext'
import type { UserPreferences } from '../lib/wp'
import { calculateWP, buildAlternatives, buildCriteria } from '../lib/wp'
import { calculateRecommendation, type RecommendationResponse } from '../services/api'
import { formatRupiah } from '../data/fixtures'
import { AlertTriangle, Trophy, ArrowLeft, SlidersHorizontal, GitCompare, Info, Server, Cpu } from 'lucide-react'
import DemoBanner from '../components/ui/DemoBanner'
import RatingBar from '../components/ui/RatingBar'
import WAButton from '../components/ui/WAButton'
import Button from '../components/ui/Button'

export default function HasilRekomendasiPage() {
  const { materials } = useAdminData()
  const location = useLocation()
  const navigate = useNavigate()
  const prefs = location.state?.prefs as UserPreferences | undefined

  const [apiResponse, setApiResponse] = useState<RecommendationResponse | null>(null)
  const [isLoadingApi, setIsLoadingApi] = useState(false)

  // Filter bahan berdasarkan anggaran (jika ada)
  const { filtered, excluded } = useMemo(() => {
    if (!prefs?.anggaranMaks) {
      return { filtered: materials, excluded: [] }
    }
    return {
      filtered: materials.filter(m => m.hargaDemo <= prefs.anggaranMaks!),
      excluded: materials.filter(m => m.hargaDemo > prefs.anggaranMaks!),
    }
  }, [prefs?.anggaranMaks, materials])

  // Panggil hybrid calculation service (API -> SPK Microservice -> fallback lokal)
  useEffect(() => {
    if (!prefs || filtered.length === 0) return

    let isMounted = true
    setIsLoadingApi(true)

    calculateRecommendation(prefs, materials)
      .then(res => {
        if (isMounted) {
          setApiResponse(res)
          setIsLoadingApi(false)
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingApi(false)
      })

    return () => {
      isMounted = false
    }
  }, [prefs, materials, filtered.length])

  // Kalkulasi lokal langsung sebagai cadangan instan
  const { localWp, wpError } = useMemo(() => {
    if (!prefs || filtered.length === 0) return { localWp: null, wpError: null }
    try {
      const criteria = buildCriteria(prefs)
      const alternatives = buildAlternatives(filtered)
      return { localWp: calculateWP(criteria, alternatives), wpError: null }
    } catch (err) {
      return { localWp: null, wpError: err instanceof Error ? err.message : 'Kalkulasi gagal.' }
    }
  }, [filtered, prefs])

  // Tentukan daftar ranking akhir (dari API/Microservice jika ada, atau fallback lokal)
  const rankedMaterials = useMemo(() => {
    if (apiResponse && apiResponse.rankedMaterials.length > 0) {
      return apiResponse.rankedMaterials
    }
    if (!localWp) return []
    return localWp.results.map(r => ({
      ...r,
      material: materials.find(m => m.id === r.id)!,
    }))
  }, [apiResponse, localWp, materials])

  const source = apiResponse?.source || 'local_engine_fallback'
  const normalizedWeights = apiResponse?.normalizedWeights || localWp?.normalizedWeights || {}

  // Jika tidak ada state (akses langsung URL), redirect ke form
  if (!prefs) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <p className="mb-4" style={{ color: 'var(--color-muted)' }}>Preferensi tidak ditemukan. Silakan isi form rekomendasi terlebih dahulu.</p>
        <Link to="/rekomendasi">
          <Button variant="primary">Ke Form Rekomendasi</Button>
        </Link>
      </div>
    )
  }

  const topMaterial = rankedMaterials[0]

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/rekomendasi')}
          className="inline-flex items-center gap-1.5 text-sm mb-4 transition-base"
          style={{ color: 'var(--color-muted)' }}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Ubah preferensi
        </button>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--color-text)' }}>
              Hasil Rekomendasi
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
              Ranking berdasarkan preferensi kriteria dan anggaran yang kamu pilih.
            </p>
          </div>

          {/* Status Sumber Kalkulasi (Phase 6) */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
            style={{
              backgroundColor: source === 'spk_microservice' ? 'rgba(198,255,61,0.08)' : 'rgba(54,217,245,0.08)',
              borderColor: source === 'spk_microservice' ? 'var(--color-neon)' : 'var(--color-cyan)',
              color: source === 'spk_microservice' ? 'var(--color-neon)' : 'var(--color-cyan)',
            }}
          >
            {source === 'spk_microservice' ? (
              <>
                <Cpu size={14} aria-hidden="true" />
                <span>SPK Microservice Live (5001)</span>
              </>
            ) : source === 'backend_api' ? (
              <>
                <Server size={14} aria-hidden="true" />
                <span>Backend REST API Live</span>
              </>
            ) : (
              <>
                <Cpu size={14} aria-hidden="true" />
                <span>Engine WP Terverifikasi</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Demo banner */}
      <div className="mb-5">
        <DemoBanner />
      </div>

      {/* Demo WP notice & Arsitektur */}
      <div
        className="rounded-xl border p-3 mb-6 flex items-start gap-2.5 text-xs"
        style={{ backgroundColor: 'rgba(54,217,245,0.06)', borderColor: 'rgba(54,217,245,0.2)', color: 'var(--color-cyan)' }}
        role="note"
      >
        <Info size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div className="space-y-1">
          <div>
            <strong>Transparansi Perhitungan (Phase 5 &amp; 6):</strong> Urutan rekomendasi dihitung menggunakan metode <em>Weighted Product</em> 7 Kriteria. Seluruh bobot telah dinormalisasi ($\sum w_j = 1.0$) dan nilai vektor preferensi $S_i$ dan $V_i$ diverifikasi.
          </div>
          <div className="opacity-80">
            Arah C5 (ketebalan) saat ini menggunakan konfigurasi: <strong>{prefs.arahC5 === 'cost' ? 'Cost (Kain Tipis/Ringan Diutamakan)' : 'Benefit (Kain Tebal/Kokoh Diutamakan)'}</strong>.
          </div>
        </div>
      </div>

      {/* Kondisi anggaran tidak ada yang memenuhi */}
      {prefs.anggaranMaks && filtered.length === 0 && (
        <div
          className="rounded-2xl border p-6 mb-6 flex items-start gap-3"
          style={{ backgroundColor: 'rgba(255,200,87,0.08)', borderColor: 'rgba(255,200,87,0.3)', color: 'var(--color-warning)' }}
          role="alert"
        >
          <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Belum ada bahan yang masuk batas anggaran ini.</p>
            <p className="text-sm mt-1 opacity-80">
              Batas: Rp {prefs.anggaranMaks.toLocaleString('id-ID')}/pcs.
              Bahan di luar anggaran ditampilkan di bawah sebagai referensi.
            </p>
          </div>
        </div>
      )}

      {/* Error kalkulasi */}
      {wpError && (
        <div
          className="rounded-2xl border p-5 mb-6 flex items-start gap-3"
          style={{ backgroundColor: 'rgba(255,100,124,0.08)', borderColor: 'rgba(255,100,124,0.3)', color: 'var(--color-danger)' }}
          role="alert"
        >
          <AlertTriangle size={18} className="shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Rekomendasi belum dapat dihitung.</p>
            <p className="text-sm mt-1 opacity-80">{wpError}</p>
          </div>
        </div>
      )}

      {/* Rekomendasi utama */}
      {topMaterial && (
        <section aria-labelledby="rekomendasi-utama-heading" className="mb-8">
          <h2 id="rekomendasi-utama-heading" className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-muted)' }}>
            Rekomendasi Utama untuk Preferensimu
          </h2>
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-neon)',
              boxShadow: '0 0 24px rgba(198,255,61,0.1)',
            }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl font-black text-black text-lg"
                  style={{ backgroundColor: 'var(--color-neon)' }}
                  aria-hidden="true"
                >
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black" style={{ color: 'var(--color-text)' }}>
                    {topMaterial.material.nama}
                  </h3>
                  <div className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>
                    {topMaterial.material.id}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black tabular-nums" style={{ color: 'var(--color-neon)' }}>
                  {formatRupiah(topMaterial.material.hargaDemo)}/pcs
                </div>
                <div className="text-xs" style={{ color: 'var(--color-warning)' }}>Harga indikatif</div>
              </div>
            </div>

            <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>
              {topMaterial.material.deskripsi}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-surface-raised)' }}>
                <div className="text-xs mb-0.5" style={{ color: 'var(--color-muted)' }}>Nilai Preferensi V (demo)</div>
                <div className="font-black tabular-nums text-lg" style={{ color: 'var(--color-neon)' }}>
                  {(topMaterial.V * 100).toFixed(2)}%
                </div>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-surface-raised)' }}>
                <div className="text-xs mb-0.5" style={{ color: 'var(--color-muted)' }}>Peringkat</div>
                <div className="font-black text-lg" style={{ color: 'var(--color-neon)' }}>
                  #1 dari {rankedMaterials.length}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <RatingBar label="Serap Keringat" value={topMaterial.material.serapKeringat} />
              <RatingBar label="Elastisitas" value={topMaterial.material.elastisitas} />
              <RatingBar label="Kualitas Printing" value={topMaterial.material.printing} />
              <RatingBar label="Ketebalan" value={topMaterial.material.ketebalan} />
              <RatingBar label="Keawetan Serat" value={topMaterial.material.keawetan} />
              <RatingBar label="Quick Dry" value={topMaterial.material.quickDry} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/katalog/${topMaterial.material.slug}`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  Lihat Detail Lengkap
                </Button>
              </Link>
              <WAButton
                materialName={topMaterial.material.nama}
                className="flex-1"
                id={`wa-top-${topMaterial.material.id}`}
              />
            </div>
          </div>
        </section>
      )}

      {/* Ranking semua */}
      {rankedMaterials.length > 0 && (
        <section aria-labelledby="ranking-semua-heading" className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <h2 id="ranking-semua-heading" className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
              Semua Alternatif ({rankedMaterials.length} bahan)
            </h2>
            <Link
              to={`/perbandingan?ids=${rankedMaterials.slice(0, 3).map(r => r.material.id).join(',')}`}
              id="btn-bandingkan-dari-hasil"
              className="flex items-center gap-1.5 text-xs font-semibold transition-base"
              style={{ color: 'var(--color-cyan)' }}
            >
              <GitCompare size={14} aria-hidden="true" />
              Bandingkan 3 teratas
            </Link>
          </div>

          <div className="space-y-3">
            {rankedMaterials.map((r, i) => (
              <div
                key={r.id}
                className="rounded-xl border px-4 py-3.5 flex items-center gap-4 transition-base"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: i === 0 ? 'rgba(198,255,61,0.3)' : 'var(--color-border)',
                }}
              >
                {/* Rank */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0"
                  style={{
                    backgroundColor: i === 0 ? 'var(--color-neon)' : 'var(--color-surface-raised)',
                    color: i === 0 ? '#0a0a0a' : 'var(--color-muted)',
                  }}
                  aria-hidden="true"
                >
                  {r.rank}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{r.material.nama}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {formatRupiah(r.material.hargaDemo)}/pcs — V: {(r.V * 100).toFixed(2)}%
                  </div>
                </div>

                {/* Detail link */}
                <Link
                  to={`/katalog/${r.material.slug}`}
                  className="text-xs font-medium shrink-0 transition-base"
                  style={{ color: 'var(--color-cyan)' }}
                  aria-label={`Lihat detail ${r.material.nama}`}
                >
                  Detail →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bahan di luar anggaran */}
      {excluded.length > 0 && (
        <section aria-labelledby="luar-anggaran-heading" className="mb-8">
          <h2 id="luar-anggaran-heading" className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-warning)' }}>
            Bahan di Luar Batas Anggaran (Referensi)
          </h2>
          <div className="space-y-2">
            {excluded.map(m => (
              <div
                key={m.id}
                className="rounded-xl border px-4 py-3 flex items-center gap-3 opacity-60"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{m.nama}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--color-muted)' }}>{formatRupiah(m.hargaDemo)}/pcs</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--color-warning)' }}>Di luar anggaran</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tombol aksi bawah */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <Button variant="secondary" onClick={() => navigate('/rekomendasi')} id="btn-ubah-preferensi">
          <SlidersHorizontal size={15} aria-hidden="true" />
          Ubah Preferensi
        </Button>
        <Link to="/katalog">
          <Button variant="secondary">Lihat Katalog</Button>
        </Link>
      </div>
    </div>
  )
}
