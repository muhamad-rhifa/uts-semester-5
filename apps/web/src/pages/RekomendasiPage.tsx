import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminData } from '../context/AdminContext'
import { SlidersHorizontal, ChevronRight, Info, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import type { UserPreferences } from '../lib/wp'

const PRIORITY_OPTIONS = [
  { value: 1, label: 'Tidak penting' },
  { value: 2, label: 'Kurang penting' },
  { value: 3, label: 'Cukup penting' },
  { value: 4, label: 'Penting' },
  { value: 5, label: 'Sangat penting' },
]

const KRITERIA = [
  { id: 'bobotHarga' as const, nama: 'Harga per pcs', desc: 'Semakin rendah harga, semakin diprioritaskan (cost)', tipe: 'cost' },
  { id: 'bobotSerap' as const, nama: 'Daya Serap Keringat', desc: 'Kemampuan menyerap & menguapkan keringat saat berolahraga', tipe: 'benefit' },
  { id: 'bobotElastis' as const, nama: 'Tingkat Kelenturan / Elastisitas Kain', desc: 'Keleluasaan gerak dinamis saat dikenakan', tipe: 'benefit' },
  { id: 'bobotPrinting' as const, nama: 'Kualitas Kecerahan Hasil Printing', desc: 'Ketajaman dan kecemerlangan warna cetak sublimasi', tipe: 'benefit' },
  { id: 'bobotTebal' as const, nama: 'Ketebalan Kain / Gramasi', desc: 'Arah kriteria mengikuti preferensi admin (kokoh vs ringan).', tipe: 'configurable' },
  { id: 'bobotKeawetan' as const, nama: 'Keawetan Serat / Anti-Berbulu', desc: 'Ketahanan kain terhadap gesekan berulang & anti-pilling', tipe: 'benefit' },
  { id: 'bobotQuickDry' as const, nama: 'Kecepatan Kering / Quick Dry', desc: 'Kecepatan kain mengering setelah basah atau dicuci', tipe: 'benefit' },
]

const DEFAULT_PREFS: UserPreferences = {
  bobotHarga: 3,
  bobotSerap: 3,
  bobotElastis: 3,
  bobotPrinting: 3,
  bobotTebal: 3,
  bobotKeawetan: 3,
  bobotQuickDry: 3,
  anggaranMaks: null,
  arahC5: 'benefit',
}

export default function RekomendasiPage() {
  const { arahC5 } = useAdminData()
  const navigate = useNavigate()
  const [prefs, setPrefs] = useState<UserPreferences>(() => ({
    ...DEFAULT_PREFS,
    arahC5,
  }))
  const [anggaranStr, setAnggaranStr] = useState('')
  const [step, setStep] = useState<'form' | 'preview'>('form')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setBobot = (key: keyof UserPreferences, value: number) => {
    setPrefs(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (anggaranStr && (isNaN(Number(anggaranStr)) || Number(anggaranStr) <= 0)) {
      newErrors.anggaran = 'Anggaran harus berupa angka positif.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreview = () => {
    if (!validate()) return
    const anggaranNum = anggaranStr ? Number(anggaranStr) : null
    setPrefs(prev => ({ ...prev, anggaranMaks: anggaranNum }))
    setStep('preview')
  }

  const handleHitung = () => {
    const anggaranNum = anggaranStr ? Number(anggaranStr) : null
    const finalPrefs = { ...prefs, anggaranMaks: anggaranNum }
    navigate('/rekomendasi/hasil', { state: { prefs: finalPrefs } })
  }

  const totalBobot = KRITERIA.reduce((sum, k) => sum + (prefs[k.id] as number), 0)

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <SlidersHorizontal size={20} style={{ color: 'var(--color-neon)' }} aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--color-text)' }}>
            Form Rekomendasi
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Atur prioritas dan anggaran untuk mendapatkan rekomendasi bahan jersey yang dipersonalisasi.
        </p>
      </div>

      {/* Demo notice */}
      <div
        className="rounded-xl border p-4 mb-6 flex items-start gap-3 text-sm"
        style={{ backgroundColor: 'rgba(255,200,87,0.06)', borderColor: 'rgba(255,200,87,0.25)', color: 'var(--color-warning)' }}
        role="note"
      >
        <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          <strong>Demo Phase 2 —</strong> Hasil dihitung dari data fixture lokal menggunakan metode WP.
          Bukan hasil dari backend produksi. Jangan gunakan sebagai acuan pemesanan resmi.
        </span>
      </div>

      {step === 'form' ? (
        <form onSubmit={e => { e.preventDefault(); handlePreview() }} aria-label="Form preferensi bahan jersey" noValidate>
          {/* Bagian A: Anggaran */}
          <fieldset
            className="rounded-2xl border p-6 mb-5"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <legend className="px-2 text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              A. Anggaran Maksimum (Opsional)
            </legend>
            <div className="mt-4">
              <label htmlFor="anggaran-max" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Batas anggaran per pcs (Rp)
              </label>
              <input
                id="anggaran-max"
                type="number"
                min={0}
                value={anggaranStr}
                onChange={e => { setAnggaranStr(e.target.value); if (errors.anggaran) setErrors(p => ({ ...p, anggaran: '' })) }}
                className="w-full px-3 py-2.5 rounded-xl text-sm border bg-transparent transition-base"
                style={{ borderColor: errors.anggaran ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text)', backgroundColor: 'var(--color-surface-raised)' }}
                placeholder="Contoh: 45000 — kosongkan jika tidak membatasi"
                aria-describedby="anggaran-hint anggaran-error"
                aria-invalid={Boolean(errors.anggaran)}
              />
              {errors.anggaran && (
                <p id="anggaran-error" className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--color-danger)' }} role="alert">
                  <AlertCircle size={12} aria-hidden="true" />
                  {errors.anggaran}
                </p>
              )}
              <p id="anggaran-hint" className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                Batas anggaran adalah filter terpisah dari prioritas harga di bawah.
                Jika tidak ada bahan yang masuk anggaran, sistem akan memberi tahu.
              </p>
            </div>
          </fieldset>

          {/* Bagian B: Prioritas kriteria */}
          <fieldset
            className="rounded-2xl border p-6 mb-5"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <legend className="px-2 text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              B. Prioritas Kriteria
            </legend>
            <p className="mt-2 text-xs mb-5" style={{ color: 'var(--color-muted)' }}>
              Pilih seberapa penting setiap faktor bagimu. Bobot akan dinormalisasi otomatis.
            </p>

            <div className="space-y-6">
              {KRITERIA.map(k => {
                const val = prefs[k.id] as number
                return (
                  <div key={k.id}>
                    <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{k.nama}</div>
                        <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{k.desc}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-md font-mono"
                          style={{
                            backgroundColor: k.tipe === 'benefit' ? 'rgba(198,255,61,0.1)' : k.tipe === 'cost' ? 'rgba(54,217,245,0.1)' : 'rgba(255,200,87,0.1)',
                            color: k.tipe === 'benefit' ? 'var(--color-neon)' : k.tipe === 'cost' ? 'var(--color-cyan)' : 'var(--color-warning)',
                          }}
                        >
                          {k.tipe.toUpperCase()}
                        </span>
                        <span className="text-sm font-bold w-4 text-center" style={{ color: 'var(--color-neon)' }}>
                          {val}
                        </span>
                      </div>
                    </div>

                    {/* Pilihan 1-5 dengan tombol */}
                    <div className="flex gap-2" role="group" aria-label={`Prioritas ${k.nama}`}>
                      {PRIORITY_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setBobot(k.id, opt.value)}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold transition-base border"
                          style={{
                            borderColor: val === opt.value ? 'var(--color-neon)' : 'var(--color-border)',
                            backgroundColor: val === opt.value ? 'rgba(198,255,61,0.12)' : 'var(--color-surface-raised)',
                            color: val === opt.value ? 'var(--color-neon)' : 'var(--color-muted)',
                          }}
                          aria-pressed={val === opt.value}
                          aria-label={`${k.nama}: ${opt.label}`}
                        >
                          {opt.value}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs mt-1 px-0.5" style={{ color: 'var(--color-muted)' }}>
                      <span>Tidak penting</span>
                      <span style={{ color: val === 3 ? 'var(--color-muted)' : 'transparent' }}>Cukup</span>
                      <span>Sangat penting</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </fieldset>

          <Button type="submit" variant="primary" size="lg" className="w-full" id="btn-preview-preferensi">
            Lihat Ringkasan Preferensi
            <ChevronRight size={18} aria-hidden="true" />
          </Button>
        </form>
      ) : (
        /* Preview sebelum hitung */
        <div>
          <div
            className="rounded-2xl border p-6 mb-5"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text)' }}>Ringkasan Preferensimu</h2>

            {prefs.anggaranMaks && (
              <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--color-surface-raised)' }}>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Batas Anggaran</div>
                <div className="font-bold tabular-nums" style={{ color: 'var(--color-cyan)' }}>
                  Rp {prefs.anggaranMaks.toLocaleString('id-ID')}/pcs
                </div>
              </div>
            )}

            <div className="space-y-3">
              {KRITERIA.map(k => {
                const val = prefs[k.id] as number
                const pct = (val / totalBobot * 100).toFixed(1)
                const label = PRIORITY_OPTIONS.find(o => o.value === val)?.label ?? val
                return (
                  <div key={k.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: 'var(--color-text)' }}>{k.nama}</span>
                      <span className="font-semibold tabular-nums" style={{ color: 'var(--color-neon)' }}>
                        {label} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: 'var(--color-neon)' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-xs mt-4" style={{ color: 'var(--color-muted)' }}>
              Total bobot: {totalBobot} → setelah dinormalisasi menjadi 100%.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setStep('form')}
              id="btn-kembali-ubah"
            >
              Ubah Preferensi
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleHitung}
              id="btn-hitung-rekomendasi"
            >
              Hitung Rekomendasi
              <ChevronRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
