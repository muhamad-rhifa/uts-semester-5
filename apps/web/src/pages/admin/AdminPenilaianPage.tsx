import { useState } from 'react'
import { Edit2, CheckCircle2, AlertCircle, Info, Calculator, Check } from 'lucide-react'
import { useAdminData } from '../../context/AdminContext'
import { formatRupiah, type Material } from '../../data/fixtures'
import DemoBanner from '../../components/ui/DemoBanner'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

export default function AdminPenilaianPage() {
  const { materials, arahC5, updateScores } = useAdminData()

  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [hargaInput, setHargaInput] = useState<number | string>('')
  const [serapInput, setSerapInput] = useState<number>(3)
  const [elastisInput, setElastisInput] = useState<number>(3)
  const [printingInput, setPrintingInput] = useState<number>(3)
  const [tebalInput, setTebalInput] = useState<number>(3)
  const [keawetanInput, setKeawetanInput] = useState<number>(3)
  const [quickDryInput, setQuickDryInput] = useState<number>(3)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleOpenEdit = (m: Material) => {
    setEditingMaterial(m)
    setHargaInput(m.hargaDemo)
    setSerapInput(m.serapKeringat)
    setElastisInput(m.elastisitas)
    setPrintingInput(m.printing)
    setTebalInput(m.ketebalan)
    setKeawetanInput(m.keawetan)
    setQuickDryInput(m.quickDry)
  }

  const handleSaveScores = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMaterial) return

    const hargaNum = Number(hargaInput)
    if (!hargaInput || isNaN(hargaNum) || hargaNum <= 0) {
      showToast('error', 'Harga harus berupa angka positif lebih dari 0.')
      return
    }

    if (
      serapInput < 1 || serapInput > 5 ||
      elastisInput < 1 || elastisInput > 5 ||
      printingInput < 1 || printingInput > 5 ||
      tebalInput < 1 || tebalInput > 5 ||
      keawetanInput < 1 || keawetanInput > 5 ||
      quickDryInput < 1 || quickDryInput > 5
    ) {
      showToast('error', 'Semua skor karakteristik kriteria harus berada dalam rentang 1 hingga 5.')
      return
    }

    updateScores(editingMaterial.id, {
      hargaDemo: hargaNum,
      serapKeringat: Number(serapInput),
      elastisitas: Number(elastisInput),
      printing: Number(printingInput),
      ketebalan: Number(tebalInput),
      keawetan: Number(keawetanInput),
      quickDry: Number(quickDryInput),
    })

    setEditingMaterial(null)
    showToast('success', `Matriks skor untuk bahan "${editingMaterial.nama}" berhasil diperbarui.`)
  }

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
          Matriks Penilaian Alternatif Bahan
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Kelola skor setiap bahan per kriteria (C1–C7) yang digunakan dalam perhitungan Weighted Product.
        </p>
      </div>

      <div className="mb-4">
        <DemoBanner />
      </div>

      {/* Notice info */}
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
          <span>
            <strong>Aturan Integritas Skor (PRD §7):</strong> Semua nilai matriks yang dipangkatkan harus bernilai positif (&gt; 0).
            Skor C2–C7 menggunakan skala 1–5. Arah kriteria C5 saat ini dikonfigurasi sebagai <strong>{arahC5}</strong>.
          </span>
        </div>
      </div>

      {/* Matrix Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="overflow-x-auto" role="region" aria-label="Tabel penilaian bahan per kriteria" tabIndex={0}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}>
                <th scope="col" className="text-left px-3 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                  Bahan Kain
                </th>
                <th scope="col" className="text-right px-3 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-cyan)' }}>
                  C1: Harga
                </th>
                <th scope="col" className="text-center px-2 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neon)' }}>
                  C2: Serap
                </th>
                <th scope="col" className="text-center px-2 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neon)' }}>
                  C3: Elastis
                </th>
                <th scope="col" className="text-center px-2 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neon)' }}>
                  C4: Print
                </th>
                <th scope="col" className="text-center px-2 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-warning)' }}>
                  C5: Tebal
                </th>
                <th scope="col" className="text-center px-2 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neon)' }}>
                  C6: Awet
                </th>
                <th scope="col" className="text-center px-2 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-neon)' }}>
                  C7: Quick Dry
                </th>
                <th scope="col" className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                  Status
                </th>
                <th scope="col" className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m, i) => {
                const isComplete =
                  m.hargaDemo > 0 &&
                  m.serapKeringat >= 1 &&
                  m.elastisitas >= 1 &&
                  m.printing >= 1 &&
                  m.ketebalan >= 1 &&
                  m.keawetan >= 1 &&
                  m.quickDry >= 1

                return (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: i < materials.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}
                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-3 py-3">
                      <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{m.nama}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>{m.id}</div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold text-xs" style={{ color: 'var(--color-cyan)' }}>
                      {formatRupiah(m.hargaDemo)}
                    </td>
                    <td className="px-2 py-3 text-center tabular-nums font-bold" style={{ color: 'var(--color-neon)' }}>
                      {m.serapKeringat}
                    </td>
                    <td className="px-2 py-3 text-center tabular-nums font-bold" style={{ color: 'var(--color-neon)' }}>
                      {m.elastisitas}
                    </td>
                    <td className="px-2 py-3 text-center tabular-nums font-bold" style={{ color: 'var(--color-neon)' }}>
                      {m.printing}
                    </td>
                    <td className="px-2 py-3 text-center tabular-nums font-bold" style={{ color: 'var(--color-warning)' }}>
                      {m.ketebalan}
                    </td>
                    <td className="px-2 py-3 text-center tabular-nums font-bold" style={{ color: 'var(--color-neon)' }}>
                      {m.keawetan}
                    </td>
                    <td className="px-2 py-3 text-center tabular-nums font-bold" style={{ color: 'var(--color-neon)' }}>
                      {m.quickDry}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1"
                        style={{
                          backgroundColor: isComplete ? 'rgba(198,255,61,0.1)' : 'rgba(255,100,124,0.1)',
                          color: isComplete ? 'var(--color-neon)' : 'var(--color-danger)',
                        }}
                      >
                        {isComplete ? (
                          <>
                            <Check size={12} aria-hidden="true" /> Lengkap
                          </>
                        ) : (
                          'Kurang Lengkap'
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 rounded-lg transition-base text-[var(--color-cyan)] hover:bg-[rgba(54,217,245,0.1)] inline-flex items-center gap-1 text-xs font-semibold"
                        aria-label={`Edit skor bahan ${m.nama}`}
                        title="Edit skor kriteria"
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

      {/* Modal Edit Skor */}
      <Modal
        isOpen={Boolean(editingMaterial)}
        onClose={() => setEditingMaterial(null)}
        title={`Edit Skor Bahan: ${editingMaterial?.nama || ''}`}
        description="Sesuaikan nilai harga dan skor kriteria kualitas untuk bahan ini."
      >
        {editingMaterial && (
          <form onSubmit={handleSaveScores} className="space-y-4" noValidate>
            <div>
              <label htmlFor="score-harga" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                C1: Harga Demo per pcs (Rp) — Kriteria Cost
              </label>
              <input
                id="score-harga"
                type="number"
                min="1000"
                step="500"
                value={hargaInput}
                onChange={e => setHargaInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent font-bold tabular-nums"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-cyan)' }}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="score-serap" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                  C2: Serap Keringat (1–5)
                </label>
                <select
                  id="score-serap"
                  value={serapInput}
                  onChange={e => setSerapInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent font-bold"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-neon)' }}
                >
                  {[1, 2, 3, 4, 5].map(v => (
                    <option key={v} value={v} style={{ backgroundColor: '#141c28', color: '#fff' }}>
                      {v} — {v === 5 ? 'Sangat Baik' : v === 4 ? 'Baik' : v === 3 ? 'Cukup' : v === 2 ? 'Rendah' : 'Sangat Rendah'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="score-elastis" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                  C3: Elastisitas Kain (1–5)
                </label>
                <select
                  id="score-elastis"
                  value={elastisInput}
                  onChange={e => setElastisInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent font-bold"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-neon)' }}
                >
                  {[1, 2, 3, 4, 5].map(v => (
                    <option key={v} value={v} style={{ backgroundColor: '#141c28', color: '#fff' }}>
                      {v} — {v === 5 ? 'Sangat Baik' : v === 4 ? 'Baik' : v === 3 ? 'Cukup' : v === 2 ? 'Rendah' : 'Sangat Rendah'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="score-printing" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                  C4: Kualitas Printing (1–5)
                </label>
                <select
                  id="score-printing"
                  value={printingInput}
                  onChange={e => setPrintingInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent font-bold"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-neon)' }}
                >
                  {[1, 2, 3, 4, 5].map(v => (
                    <option key={v} value={v} style={{ backgroundColor: '#141c28', color: '#fff' }}>
                      {v} — {v === 5 ? 'Sangat Baik' : v === 4 ? 'Baik' : v === 3 ? 'Cukup' : v === 2 ? 'Rendah' : 'Sangat Rendah'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="score-tebal" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                  C5: Ketebalan ({arahC5})
                </label>
                <select
                  id="score-tebal"
                  value={tebalInput}
                  onChange={e => setTebalInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent font-bold"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-warning)' }}
                >
                  {[1, 2, 3, 4, 5].map(v => (
                    <option key={v} value={v} style={{ backgroundColor: '#141c28', color: '#fff' }}>
                      {v} — {v === 5 ? 'Sangat Tebal' : v === 4 ? 'Tebal' : v === 3 ? 'Sedang' : v === 2 ? 'Tipis' : 'Sangat Tipis'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="score-keawetan" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                  C6: Keawetan Serat / Anti-Berbulu (1–5)
                </label>
                <select
                  id="score-keawetan"
                  value={keawetanInput}
                  onChange={e => setKeawetanInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent font-bold"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-neon)' }}
                >
                  {[1, 2, 3, 4, 5].map(v => (
                    <option key={v} value={v} style={{ backgroundColor: '#141c28', color: '#fff' }}>
                      {v} — {v === 5 ? 'Sangat Tahan / Tidak Berbulu' : v === 4 ? 'Tahan' : v === 3 ? 'Cukup' : v === 2 ? 'Rentan Berbulu' : 'Sangat Rentan'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="score-quickdry" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                  C7: Kecepatan Kering / Quick Dry (1–5)
                </label>
                <select
                  id="score-quickdry"
                  value={quickDryInput}
                  onChange={e => setQuickDryInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent font-bold"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-neon)' }}
                >
                  {[1, 2, 3, 4, 5].map(v => (
                    <option key={v} value={v} style={{ backgroundColor: '#141c28', color: '#fff' }}>
                      {v} — {v === 5 ? 'Sangat Cepat Kering' : v === 4 ? 'Cepat Kering' : v === 3 ? 'Standar' : v === 2 ? 'Agak Lambat' : 'Lambat Sekali'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <Button variant="secondary" size="sm" type="button" onClick={() => setEditingMaterial(null)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Simpan Nilai Matriks
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
