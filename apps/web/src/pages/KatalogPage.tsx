import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminData } from '../context/AdminContext'
import MaterialCard from '../components/ui/MaterialCard'
import DemoBanner from '../components/ui/DemoBanner'
import Button from '../components/ui/Button'
import { Package, GitCompare, X } from 'lucide-react'

const MAX_COMPARE = 3

export default function KatalogPage() {
  const { materials } = useAdminData()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const navigate = useNavigate()

  const toggleCompare = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < MAX_COMPARE ? [...prev, id] : prev
    )
  }

  const handleCompare = () => {
    if (selectedIds.length < 2) return
    navigate(`/perbandingan?ids=${selectedIds.join(',')}`)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Package size={20} style={{ color: 'var(--color-neon)' }} aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--color-text)' }}>
            Katalog Bahan Jersey
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Bahan-bahan jersey yang tersedia untuk pembuatan jersey custom ViaJersey.
          Pilih hingga {MAX_COMPARE} bahan untuk dibandingkan.
        </p>
      </div>

      {/* Demo notice */}
      <div className="mb-6">
        <DemoBanner />
      </div>

      {/* Grid katalog */}
      {materials.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          role="status"
          aria-live="polite"
        >
          <Package size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--color-muted)' }} aria-hidden="true" />
          <p className="font-medium" style={{ color: 'var(--color-muted)' }}>Belum ada bahan yang tersedia.</p>
        </div>
      ) : (
        <>
          <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
            Menampilkan {materials.length} bahan aktif
            {selectedIds.length > 0 && (
              <span style={{ color: 'var(--color-neon)' }}> — {selectedIds.length}/{MAX_COMPARE} bahan dipilih untuk perbandingan</span>
            )}
          </p>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            role="list"
            aria-label="Daftar bahan jersey"
          >
            {materials.map(material => (
              <div key={material.id} role="listitem">
                <MaterialCard
                  material={material}
                  isSelected={selectedIds.includes(material.id)}
                  onToggleCompare={toggleCompare}
                  disableCompare={selectedIds.length >= MAX_COMPARE}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Floating compare bar */}
      {selectedIds.length > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl border px-5 py-3 flex items-center gap-4 shadow-2xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-neon)',
            boxShadow: '0 0 24px rgba(198,255,61,0.2)',
            minWidth: 'min(90vw, 400px)',
          }}
          role="status"
          aria-live="polite"
          aria-label={`${selectedIds.length} bahan dipilih untuk perbandingan`}
        >
          <div className="flex-1">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {selectedIds.length} bahan dipilih
            </span>
            <span className="text-xs ml-2" style={{ color: 'var(--color-muted)' }}>
              (maks. {MAX_COMPARE})
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCompare}
            disabled={selectedIds.length < 2}
            id="btn-bandingkan-sekarang"
            aria-disabled={selectedIds.length < 2}
          >
            <GitCompare size={14} aria-hidden="true" />
            Bandingkan
          </Button>
          <button
            onClick={() => setSelectedIds([])}
            className="p-1 rounded-lg transition-base"
            style={{ color: 'var(--color-muted)' }}
            aria-label="Batalkan semua pilihan perbandingan"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
