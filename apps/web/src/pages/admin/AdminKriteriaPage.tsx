import { useState } from 'react'
import { SlidersHorizontal, Edit2, CheckCircle2, AlertCircle, Info, HelpCircle } from 'lucide-react'
import { useAdminData, type CriterionConfig } from '../../context/AdminContext'
import DemoBanner from '../../components/ui/DemoBanner'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

export default function AdminKriteriaPage() {
  const { criteria, arahC5, updateCriterion, setArahC5 } = useAdminData()

  const [editingCriterion, setEditingCriterion] = useState<CriterionConfig | null>(null)
  const [bobotInput, setBobotInput] = useState<number>(3)
  const [deskripsiInput, setDeskripsiInput] = useState<string>('')
  const [tipeInput, setTipeInput] = useState<'benefit' | 'cost' | 'configurable'>('benefit')
  const [c5DirectionInput, setC5DirectionInput] = useState<'benefit' | 'cost'>(arahC5)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleOpenEdit = (c: CriterionConfig) => {
    setEditingCriterion(c)
    setBobotInput(c.bobotDefault)
    setDeskripsiInput(c.deskripsi)
    setTipeInput(c.tipe)
    if (c.kode === 'C5') {
      setC5DirectionInput(arahC5)
    }
  }

  const handleSaveCriterion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCriterion) return

    if (bobotInput < 1 || bobotInput > 5) {
      showToast('error', 'Bobot kriteria harus berada dalam rentang 1 hingga 5.')
      return
    }

    if (editingCriterion.kode === 'C5') {
      setArahC5(c5DirectionInput)
      updateCriterion('C5', {
        bobotDefault: Number(bobotInput),
        deskripsi: deskripsiInput.trim(),
        status: 'Aktif (Dikonfigurasi)',
      })
    } else {
      updateCriterion(editingCriterion.kode, {
        bobotDefault: Number(bobotInput),
        deskripsi: deskripsiInput.trim(),
      })
    }

    setEditingCriterion(null)
    showToast('success', `Pengaturan kriteria ${editingCriterion.kode} (${editingCriterion.nama}) berhasil diperbarui.`)
  }

  const totalBobotDefault = criteria.reduce((sum, c) => sum + c.bobotDefault, 0)

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-sm transition-all"
          style={{
            backgroundColor: toastMessage.type === 'success' ? '#0d2212' : '#260f13',
            borderColor: toastMessage.type === 'success' ? 'var(--color-neon)' : 'var(--color-danger)',
            color: toastMessage.type === 'success' ? 'var(--color-neon)' : 'var(--color-danger)',
          }}
          role="status"
          aria-live="polite"
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={16} aria-hidden="true" />
          ) : (
            <AlertCircle size={16} aria-hidden="true" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--color-text)' }}>
          Kriteria & Bobot Default
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Kelola 7 kriteria metode Weighted Product (WP), bobot default admin, dan penetapan arah kriteria.
        </p>
      </div>

      <div className="mb-4">
        <DemoBanner />
      </div>

      {/* Info Card Formula WP */}
      <div
        className="rounded-xl border p-4 mb-6 flex items-start gap-3 text-sm"
        style={{
          backgroundColor: 'rgba(54,217,245,0.06)',
          borderColor: 'rgba(54,217,245,0.2)',
          color: 'var(--color-cyan)',
        }}
        role="note"
      >
        <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold mb-1">Prinsip Matematis Weighted Product (WP):</p>
          <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
            <li>
              <strong>Benefit:</strong> Pangkat bobot bernilai positif ($+w_j$). Semakin tinggi skor, semakin tinggi nilai preferensi $S_i$.
            </li>
            <li>
              <strong>Cost:</strong> Pangkat bobot bernilai negatif ($-w_j$). Semakin rendah nilai (contoh: harga), semakin tinggi nilai preferensi $S_i$.
            </li>
            <li>
              <strong>Bobot Ternormalisasi:</strong> w_j = bobot_j / &Sigma; bobot. Total bobot default saat ini: <strong>{totalBobotDefault}</strong>.
            </li>
          </ul>
        </div>
      </div>

      {/* Table Card */}
      <div
        className="rounded-2xl border overflow-hidden mb-6"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="overflow-x-auto" role="region" aria-label="Tabel kriteria WP" tabIndex={0}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}>
                {['Kode', 'Nama Kriteria', 'Tipe Aturan', 'Satuan', 'Bobot Default (1–5)', 'Status', 'Aksi'].map(h => (
                  <th
                    key={h}
                    scope="col"
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((k, i) => {
                const effectiveTipe = k.kode === 'C5' ? arahC5 : k.tipe
                return (
                  <tr
                    key={k.kode}
                    style={{ borderBottom: i < criteria.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-xs" style={{ color: 'var(--color-neon)' }}>
                      {k.kode}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: 'var(--color-text)' }}>{k.nama}</div>
                      <div className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--color-muted)' }}>
                        {k.deskripsi}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-md font-mono uppercase font-bold"
                        style={{
                          backgroundColor:
                            effectiveTipe === 'benefit'
                              ? 'rgba(198,255,61,0.1)'
                              : effectiveTipe === 'cost'
                              ? 'rgba(54,217,245,0.1)'
                              : 'rgba(255,200,87,0.1)',
                          color:
                            effectiveTipe === 'benefit'
                              ? 'var(--color-neon)'
                              : effectiveTipe === 'cost'
                              ? 'var(--color-cyan)'
                              : 'var(--color-warning)',
                        }}
                      >
                        {k.kode === 'C5' ? `${effectiveTipe} (Arah C5)` : k.tipe}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                      {k.satuan}
                    </td>
                    <td className="px-4 py-3 tabular-nums font-bold" style={{ color: 'var(--color-text)' }}>
                      <span className="text-base" style={{ color: 'var(--color-neon)' }}>{k.bobotDefault}</span>
                      <span className="text-xs ml-1 font-normal opacity-60">
                        ({((k.bobotDefault / totalBobotDefault) * 100).toFixed(1)}%)
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: 'rgba(198,255,61,0.1)',
                          color: 'var(--color-neon)',
                        }}
                      >
                        {k.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleOpenEdit(k)}
                        className="p-1.5 rounded-lg transition-base text-[var(--color-cyan)] hover:bg-[rgba(54,217,245,0.1)] flex items-center gap-1 text-xs font-semibold"
                        aria-label={`Edit kriteria ${k.nama}`}
                        title="Edit kriteria & bobot"
                      >
                        <Edit2 size={14} aria-hidden="true" />
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Kriteria */}
      <Modal
        isOpen={Boolean(editingCriterion)}
        onClose={() => setEditingCriterion(null)}
        title={`Konfigurasi Kriteria: ${editingCriterion?.kode} — ${editingCriterion?.nama}`}
        description="Atur bobot default admin dan ketentuan perhitungan metode WP."
      >
        {editingCriterion && (
          <form onSubmit={handleSaveCriterion} className="space-y-4" noValidate>
            <div>
              <label htmlFor="edit-bobot" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                Bobot Default Admin (Skala 1–5) <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="edit-bobot"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={bobotInput}
                  onChange={e => setBobotInput(Number(e.target.value))}
                  className="flex-1 accent-[var(--color-neon)]"
                />
                <span className="w-8 text-center text-lg font-black tabular-nums" style={{ color: 'var(--color-neon)' }}>
                  {bobotInput}
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                1 = Sangat Rendah, 2 = Rendah, 3 = Cukup, 4 = Penting, 5 = Sangat Penting.
              </p>
            </div>

            {/* Khusus kriteria C5: Pemilihan Arah Benefit vs Cost */}
            {editingCriterion.kode === 'C5' && (
              <div
                className="p-4 rounded-xl border space-y-3"
                style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-warning)' }}>
                  <HelpCircle size={15} aria-hidden="true" />
                  Penetapan Arah Kriteria Ketebalan (C5)
                </div>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  Sesuai PRD §7, ketebalan tidak selalu "semakin tebal semakin bagus". Tentukan definisi arah kriteria:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-base ${
                      c5DirectionInput === 'benefit' ? 'border-[var(--color-neon)] bg-[rgba(198,255,61,0.06)]' : 'border-[var(--color-border)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="c5Direction"
                      value="benefit"
                      checked={c5DirectionInput === 'benefit'}
                      onChange={() => setC5DirectionInput('benefit')}
                      className="mt-0.5 accent-[var(--color-neon)]"
                    />
                    <div>
                      <div className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                        Benefit (Pangkat Positif)
                      </div>
                      <div className="text-[11px] mt-0.5 opacity-80" style={{ color: 'var(--color-muted)' }}>
                        Kain yang lebih tebal/berbobot dianggap lebih unggul (misal untuk cuaca dingin/feel premium).
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-base ${
                      c5DirectionInput === 'cost' ? 'border-[var(--color-cyan)] bg-[rgba(54,217,245,0.06)]' : 'border-[var(--color-border)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="c5Direction"
                      value="cost"
                      checked={c5DirectionInput === 'cost'}
                      onChange={() => setC5DirectionInput('cost')}
                      className="mt-0.5 accent-[var(--color-cyan)]"
                    />
                    <div>
                      <div className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                        Cost (Pangkat Negatif)
                      </div>
                      <div className="text-[11px] mt-0.5 opacity-80" style={{ color: 'var(--color-muted)' }}>
                        Kain yang lebih tipis/ringan dianggap lebih unggul (misal untuk sirkulasi lari/sepeda intensif).
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="edit-deskripsi-kriteria" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                Deskripsi Kriteria
              </label>
              <textarea
                id="edit-deskripsi-kriteria"
                rows={2}
                value={deskripsiInput}
                onChange={e => setDeskripsiInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent resize-none"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <Button variant="secondary" size="sm" type="button" onClick={() => setEditingCriterion(null)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Simpan Kriteria
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
