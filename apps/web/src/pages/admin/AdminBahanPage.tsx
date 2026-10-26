import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, CheckCircle2, AlertCircle, Layers, Image as ImageIcon, Upload, X } from 'lucide-react'
import { useAdminData } from '../../context/AdminContext'
import { formatRupiah, type Material } from '../../data/fixtures'
import DemoBanner from '../../components/ui/DemoBanner'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

interface MaterialFormData {
  id: string
  nama: string
  hargaDemo: number | string
  deskripsi: string
  kelebihanStr: string
  gambarUrl: string
  serapKeringat: number
  elastisitas: number
  printing: number
  ketebalan: number
  keawetan: number
  quickDry: number
}

const EMPTY_FORM: MaterialFormData = {
  id: '',
  nama: '',
  hargaDemo: '',
  deskripsi: '',
  kelebihanStr: '',
  gambarUrl: '',
  serapKeringat: 3,
  elastisitas: 3,
  printing: 3,
  ketebalan: 3,
  keawetan: 3,
  quickDry: 3,
}

export default function AdminBahanPage() {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useAdminData()

  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null)

  // Form states
  const [formData, setFormData] = useState<MaterialFormData>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Filtered materials
  const filteredMaterials = materials.filter(
    m =>
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFormErrors(prev => ({ ...prev, gambarUrl: 'File harus berupa gambar (JPG, PNG, WebP, dll).' }))
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, gambarUrl: 'Ukuran foto maksimal 3MB.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({ ...prev, gambarUrl: reader.result as string }))
        setFormErrors(prev => {
          const copy = { ...prev }
          delete copy.gambarUrl
          return copy
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleOpenAdd = () => {
    const nextNum = materials.length + 1
    setFormData({
      ...EMPTY_FORM,
      id: `FAB-${String(nextNum).padStart(3, '0')}`,
      gambarUrl: '',
    })
    setFormErrors({})
    setIsAddModalOpen(true)
  }

  const handleOpenEdit = (m: Material) => {
    setEditingMaterial(m)
    setFormData({
      id: m.id,
      nama: m.nama,
      hargaDemo: m.hargaDemo,
      deskripsi: m.deskripsi,
      kelebihanStr: m.kelebihan.join(', '),
      gambarUrl: m.gambarUrl || '',
      serapKeringat: m.serapKeringat,
      elastisitas: m.elastisitas,
      printing: m.printing,
      ketebalan: m.ketebalan,
      keawetan: m.keawetan,
      quickDry: m.quickDry,
    })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {}
    if (!formData.nama.trim()) {
      errs.nama = 'Nama bahan wajib diisi.'
    }
    const hargaNum = Number(formData.hargaDemo)
    if (!formData.hargaDemo || isNaN(hargaNum) || hargaNum <= 0) {
      errs.hargaDemo = 'Harga demo harus berupa angka positif.'
    }
    if (!formData.deskripsi.trim()) {
      errs.deskripsi = 'Deskripsi bahan wajib diisi.'
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const kelebihan = formData.kelebihanStr
      .split(',')
      .map(k => k.trim())
      .filter(Boolean)

    addMaterial({
      id: formData.id.trim() || undefined,
      nama: formData.nama.trim(),
      hargaDemo: Number(formData.hargaDemo),
      deskripsi: formData.deskripsi.trim(),
      kelebihan: kelebihan.length > 0 ? kelebihan : ['Standar bahan jersey berkualitas'],
      gambarUrl: formData.gambarUrl.trim() || undefined,
      serapKeringat: Number(formData.serapKeringat),
      elastisitas: Number(formData.elastisitas),
      printing: Number(formData.printing),
      ketebalan: Number(formData.ketebalan),
      keawetan: Number(formData.keawetan),
      quickDry: Number(formData.quickDry),
      slug: formData.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    })

    setIsAddModalOpen(false)
    showToast('success', `Bahan "${formData.nama}" berhasil ditambahkan ke daftar.`)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMaterial || !validateForm()) return

    const kelebihan = formData.kelebihanStr
      .split(',')
      .map(k => k.trim())
      .filter(Boolean)

    updateMaterial(editingMaterial.id, {
      nama: formData.nama.trim(),
      hargaDemo: Number(formData.hargaDemo),
      deskripsi: formData.deskripsi.trim(),
      kelebihan: kelebihan.length > 0 ? kelebihan : editingMaterial.kelebihan,
      gambarUrl: formData.gambarUrl.trim() || undefined,
      serapKeringat: Number(formData.serapKeringat),
      elastisitas: Number(formData.elastisitas),
      printing: Number(formData.printing),
      ketebalan: Number(formData.ketebalan),
      keawetan: Number(formData.keawetan),
      quickDry: Number(formData.quickDry),
    })

    setEditingMaterial(null)
    showToast('success', `Data bahan "${formData.nama}" berhasil diperbarui.`)
  }

  const handleConfirmDelete = () => {
    if (!deletingMaterial) return
    const nama = deletingMaterial.nama
    deleteMaterial(deletingMaterial.id)
    setDeletingMaterial(null)
    showToast('success', `Bahan "${nama}" berhasil dihapus.`)
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
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--color-text)' }}>
            Kelola Bahan Kain
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Daftar alternatif bahan jersey dan karakteristiknya untuk kalkulasi WP.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} id="btn-tambah-bahan">
          <Plus size={15} aria-hidden="true" />
          Tambah Bahan
        </Button>
      </div>

      <div className="mb-4">
        <DemoBanner />
      </div>

      {/* Search & Stats Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--color-muted)' }}
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau ID bahan..."
            aria-label="Cari nama atau ID bahan"
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border bg-transparent transition-base"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />
        </div>
        <div className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
          Menampilkan <span style={{ color: 'var(--color-neon)' }}>{filteredMaterials.length}</span> dari {materials.length} bahan
        </div>
      </div>

      {/* Table Card */}
      <div
        className="card-base overflow-hidden"
      >
        <div className="overflow-x-auto" role="region" aria-label="Tabel bahan kain" tabIndex={0}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}>
                {['ID', 'Nama Bahan', 'Harga Demo/pcs', 'Karakteristik (C2–C7)', 'Status', 'Aksi'].map(h => (
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
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
                    Tidak ada bahan yang cocok dengan pencarian "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((m, i) => (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: i < filteredMaterials.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}
                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: 'var(--color-cyan)' }}>
                      {m.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {m.gambarUrl ? (
                          <img
                            src={m.gambarUrl}
                            alt={m.nama}
                            className="w-10 h-10 rounded-lg object-cover border shrink-0 bg-[var(--color-surface-raised)]"
                            style={{ borderColor: 'var(--color-border)' }}
                            onError={e => {
                              (e.currentTarget as HTMLElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border"
                            style={{
                              backgroundColor: 'rgba(54,217,245,0.06)',
                              borderColor: 'rgba(54,217,245,0.2)',
                              color: 'var(--color-cyan)',
                            }}
                            title="Placeholder monogram (belum ada foto)"
                          >
                            {m.nama.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--color-text)' }}>{m.nama}</div>
                          <div className="text-xs line-clamp-1 max-w-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                            {m.deskripsi}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums font-semibold" style={{ color: 'var(--color-neon)' }}>
                      {formatRupiah(m.hargaDemo)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span title="C2 Serap">S: <strong style={{ color: 'var(--color-neon)' }}>{m.serapKeringat}</strong></span>
                        <span title="C3 Elastis">E: <strong style={{ color: 'var(--color-neon)' }}>{m.elastisitas}</strong></span>
                        <span title="C4 Printing">P: <strong style={{ color: 'var(--color-neon)' }}>{m.printing}</strong></span>
                        <span title="C5 Tebal">T: <strong style={{ color: 'var(--color-neon)' }}>{m.ketebalan}</strong></span>
                        <span title="C6 Awet">A: <strong style={{ color: 'var(--color-neon)' }}>{m.keawetan}</strong></span>
                        <span title="C7 Quick Dry">Q: <strong style={{ color: 'var(--color-neon)' }}>{m.quickDry}</strong></span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: 'var(--color-neon-soft)', color: 'var(--color-neon)' }}
                      >
                        Aktif
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg transition-base text-[var(--color-cyan)] hover:bg-[rgba(54,217,245,0.1)]"
                          aria-label={`Edit bahan ${m.nama}`}
                          title="Edit bahan"
                        >
                          <Edit2 size={15} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => setDeletingMaterial(m)}
                          className="p-1.5 rounded-lg transition-base text-[var(--color-danger)] hover:bg-[rgba(255,100,124,0.1)]"
                          aria-label={`Hapus bahan ${m.nama}`}
                          title="Hapus bahan"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Bahan */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Alternatif Bahan Kain"
        description="Lengkapi detail bahan dan skor karakteristik awal untuk kalkulasi WP."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="input-id" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                Kode ID Bahan
              </label>
              <input
                id="input-id"
                type="text"
                value={formData.id}
                onChange={e => setFormData(p => ({ ...p, id: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent font-mono"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
                placeholder="Contoh: FAB-006"
              />
            </div>
            <div>
              <label htmlFor="input-nama" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                Nama Bahan <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="input-nama"
                type="text"
                value={formData.nama}
                onChange={e => setFormData(p => ({ ...p, nama: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent"
                style={{ borderColor: formErrors.nama ? 'var(--color-danger)' : 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
                placeholder="Contoh: Dryfit Waffle"
                required
              />
              {formErrors.nama && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{formErrors.nama}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="input-harga" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
              Harga Demo per pcs (Rp) <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="input-harga"
              type="number"
              min="1000"
              step="500"
              value={formData.hargaDemo}
              onChange={e => setFormData(p => ({ ...p, hargaDemo: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent tabular-nums"
              style={{ borderColor: formErrors.hargaDemo ? 'var(--color-danger)' : 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
              placeholder="Contoh: 42000"
              required
            />
            {formErrors.hargaDemo && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{formErrors.hargaDemo}</p>}
          </div>

          <div>
            <label htmlFor="input-deskripsi" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
              Deskripsi Karakteristik Bahan <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <textarea
              id="input-deskripsi"
              rows={2}
              value={formData.deskripsi}
              onChange={e => setFormData(p => ({ ...p, deskripsi: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent resize-none"
              style={{ borderColor: formErrors.deskripsi ? 'var(--color-danger)' : 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
              placeholder="Jelaskan tekstur, peruntukan olahraga, dan rasa kain saat digunakan..."
              required
            />
            {formErrors.deskripsi && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{formErrors.deskripsi}</p>}
          </div>

          <div>
            <label htmlFor="input-kelebihan" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
              Poin Kelebihan (Pisahkan dengan tanda koma)
            </label>
            <input
              id="input-kelebihan"
              type="text"
              value={formData.kelebihanStr}
              onChange={e => setFormData(p => ({ ...p, kelebihanStr: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
              placeholder="Contoh: Sejuk dipakai, Cepat kering, Elastis tinggi"
            />
          </div>

          {/* Foto Bahan Kain */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-muted)' }}>
              Foto / Sampel Kain Jersey (Opsional)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              {/* Preview Box */}
              <div
                className="w-20 h-20 rounded-xl border flex items-center justify-center overflow-hidden shrink-0 relative bg-[var(--color-surface-raised)]"
                style={{ borderColor: formData.gambarUrl ? 'var(--color-cyan)' : 'var(--color-border)' }}
              >
                {formData.gambarUrl ? (
                  <>
                    <img
                      src={formData.gambarUrl}
                      alt="Preview kain"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gambarUrl: '' }))}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:bg-red-600 transition-colors"
                      title="Hapus Foto"
                      aria-label="Hapus Foto"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2 text-[var(--color-muted)]">
                    <ImageIcon size={20} className="opacity-40 mb-0.5" />
                    <span className="text-[9px] leading-tight opacity-70">Tanpa Foto</span>
                  </div>
                )}
              </div>

              {/* Upload & URL input */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <label
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-base hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)]"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
                  >
                    <Upload size={13} />
                    <span>Upload Foto Lokal</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                  </label>
                  {formData.gambarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gambarUrl: '' }))}
                      className="text-xs text-[var(--color-danger)] hover:underline"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.gambarUrl}
                    onChange={e => setFormData(p => ({ ...p, gambarUrl: e.target.value }))}
                    placeholder="Atau tempel URL gambar (https://...)"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border bg-transparent font-mono"
                    style={{
                      borderColor: formErrors.gambarUrl ? 'var(--color-danger)' : 'var(--color-border)',
                      backgroundColor: 'var(--color-surface-raised)',
                      color: 'var(--color-text)',
                    }}
                  />
                  {formErrors.gambarUrl && (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                      {formErrors.gambarUrl}
                    </p>
                  )}
                </div>
                <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                  Mendukung upload gambar PNG/JPG/WebP atau URL langsung. Jika dikosongkan, kartu menampilkan monogram inisial neon.
                </p>
              </div>
            </div>
          </div>

          {/* Skor kriteria C2-C7 */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-muted)' }}>
              Skor Karakteristik Awal (Skala 1–5)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'C2 Serap', key: 'serapKeringat' as const },
                { label: 'C3 Elastis', key: 'elastisitas' as const },
                { label: 'C4 Printing', key: 'printing' as const },
                { label: 'C5 Tebal', key: 'ketebalan' as const },
                { label: 'C6 Keawetan', key: 'keawetan' as const },
                { label: 'C7 Quick Dry', key: 'quickDry' as const },
              ].map(item => (
                <div key={item.key}>
                  <label htmlFor={`score-${item.key}`} className="block text-xs font-medium mb-1" style={{ color: 'var(--color-muted)' }}>
                    {item.label}
                  </label>
                  <select
                    id={`score-${item.key}`}
                    value={formData[item.key]}
                    onChange={e => setFormData(p => ({ ...p, [item.key]: Number(e.target.value) }))}
                    className="w-full px-2 py-1.5 rounded-lg text-sm border bg-transparent font-bold"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-neon)' }}
                  >
                    {[1, 2, 3, 4, 5].map(v => (
                      <option key={v} value={v} style={{ backgroundColor: '#141c28', color: '#fff' }}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Simpan Bahan Baru
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Bahan */}
      <Modal
        isOpen={Boolean(editingMaterial)}
        onClose={() => setEditingMaterial(null)}
        title={`Edit Bahan: ${editingMaterial?.nama || ''}`}
        description="Perbarui informasi dan karakteristik bahan jersey."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="edit-nama" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
              Nama Bahan <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="edit-nama"
              type="text"
              value={formData.nama}
              onChange={e => setFormData(p => ({ ...p, nama: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent"
              style={{ borderColor: formErrors.nama ? 'var(--color-danger)' : 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
              required
            />
            {formErrors.nama && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{formErrors.nama}</p>}
          </div>

          <div>
            <label htmlFor="edit-harga" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
              Harga Demo per pcs (Rp) <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="edit-harga"
              type="number"
              min="1000"
              step="500"
              value={formData.hargaDemo}
              onChange={e => setFormData(p => ({ ...p, hargaDemo: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent tabular-nums"
              style={{ borderColor: formErrors.hargaDemo ? 'var(--color-danger)' : 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
              required
            />
            {formErrors.hargaDemo && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{formErrors.hargaDemo}</p>}
          </div>

          <div>
            <label htmlFor="edit-deskripsi" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
              Deskripsi Karakteristik Bahan <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <textarea
              id="edit-deskripsi"
              rows={2}
              value={formData.deskripsi}
              onChange={e => setFormData(p => ({ ...p, deskripsi: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent resize-none"
              style={{ borderColor: formErrors.deskripsi ? 'var(--color-danger)' : 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
              required
            />
            {formErrors.deskripsi && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{formErrors.deskripsi}</p>}
          </div>

          <div>
            <label htmlFor="edit-kelebihan" className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
              Poin Kelebihan (Pisahkan dengan tanda koma)
            </label>
            <input
              id="edit-kelebihan"
              type="text"
              value={formData.kelebihanStr}
              onChange={e => setFormData(p => ({ ...p, kelebihanStr: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
            />
          </div>

          {/* Foto Bahan Kain (Edit) */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-muted)' }}>
              Foto / Sampel Kain Jersey (Opsional)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              {/* Preview Box */}
              <div
                className="w-20 h-20 rounded-xl border flex items-center justify-center overflow-hidden shrink-0 relative bg-[var(--color-surface-raised)]"
                style={{ borderColor: formData.gambarUrl ? 'var(--color-cyan)' : 'var(--color-border)' }}
              >
                {formData.gambarUrl ? (
                  <>
                    <img
                      src={formData.gambarUrl}
                      alt="Preview kain"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gambarUrl: '' }))}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:bg-red-600 transition-colors"
                      title="Hapus Foto"
                      aria-label="Hapus Foto"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2 text-[var(--color-muted)]">
                    <ImageIcon size={20} className="opacity-40 mb-0.5" />
                    <span className="text-[9px] leading-tight opacity-70">Tanpa Foto</span>
                  </div>
                )}
              </div>

              {/* Upload & URL input */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <label
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-base hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)]"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
                  >
                    <Upload size={13} />
                    <span>Upload Foto Lokal</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                  </label>
                  {formData.gambarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gambarUrl: '' }))}
                      className="text-xs text-[var(--color-danger)] hover:underline"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.gambarUrl}
                    onChange={e => setFormData(p => ({ ...p, gambarUrl: e.target.value }))}
                    placeholder="Atau tempel URL gambar (https://...)"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border bg-transparent font-mono"
                    style={{
                      borderColor: formErrors.gambarUrl ? 'var(--color-danger)' : 'var(--color-border)',
                      backgroundColor: 'var(--color-surface-raised)',
                      color: 'var(--color-text)',
                    }}
                  />
                  {formErrors.gambarUrl && (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                      {formErrors.gambarUrl}
                    </p>
                  )}
                </div>
                <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                  Mendukung upload gambar PNG/JPG/WebP atau URL langsung. Jika dikosongkan, kartu menampilkan monogram inisial neon.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-muted)' }}>
              Skor Karakteristik (Skala 1–5)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'C2 Serap', key: 'serapKeringat' as const },
                { label: 'C3 Elastis', key: 'elastisitas' as const },
                { label: 'C4 Printing', key: 'printing' as const },
                { label: 'C5 Tebal', key: 'ketebalan' as const },
                { label: 'C6 Keawetan', key: 'keawetan' as const },
                { label: 'C7 Quick Dry', key: 'quickDry' as const },
              ].map(item => (
                <div key={item.key}>
                  <label htmlFor={`edit-score-${item.key}`} className="block text-xs font-medium mb-1" style={{ color: 'var(--color-muted)' }}>
                    {item.label}
                  </label>
                  <select
                    id={`edit-score-${item.key}`}
                    value={formData[item.key]}
                    onChange={e => setFormData(p => ({ ...p, [item.key]: Number(e.target.value) }))}
                    className="w-full px-2 py-1.5 rounded-lg text-sm border bg-transparent font-bold"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-neon)' }}
                  >
                    {[1, 2, 3, 4, 5].map(v => (
                      <option key={v} value={v} style={{ backgroundColor: '#141c28', color: '#fff' }}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <Button variant="secondary" size="sm" type="button" onClick={() => setEditingMaterial(null)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={Boolean(deletingMaterial)}
        onClose={() => setDeletingMaterial(null)}
        title="Konfirmasi Hapus Bahan"
        description="Tindakan ini akan menghapus alternatif bahan dari daftar kalkulasi rekomendasi."
      >
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl border flex items-start gap-3"
            style={{ backgroundColor: 'rgba(255,100,124,0.08)', borderColor: 'rgba(255,100,124,0.3)', color: 'var(--color-danger)' }}
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold">
                Hapus bahan "{deletingMaterial?.nama}" ({deletingMaterial?.id})?
              </p>
              <p className="mt-1 text-xs opacity-80">
                Alternatif ini tidak akan lagi muncul di katalog maupun dipertimbangkan dalam kalkulasi Weighted Product pelanggan.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setDeletingMaterial(null)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={handleConfirmDelete}
              className="!bg-[var(--color-danger)] !text-white hover:!opacity-90"
            >
              Ya, Hapus Bahan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
