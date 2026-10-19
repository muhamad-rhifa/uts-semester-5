import React, { createContext, useContext, useState, useEffect } from 'react'
import { MATERIALS_FIXTURE, type Material } from '../data/fixtures'

export interface CriterionConfig {
  kode: string
  nama: string
  tipe: 'benefit' | 'cost' | 'configurable'
  satuan: string
  bobotDefault: number
  status: string
  deskripsi: string
}

export const INITIAL_CRITERIA: CriterionConfig[] = [
  {
    kode: 'C1',
    nama: 'Harga per pcs',
    tipe: 'cost',
    satuan: 'Rupiah',
    bobotDefault: 5,
    status: 'Aktif',
    deskripsi: 'Semakin rendah harga, semakin diprioritaskan. Berjenis cost dengan eksponen negatif.',
  },
  {
    kode: 'C2',
    nama: 'Daya Serap Keringat',
    tipe: 'benefit',
    satuan: 'Skor 1–5',
    bobotDefault: 4,
    status: 'Aktif',
    deskripsi: 'Kemampuan menyerap keringat. Semakin tinggi skor kualitas, semakin baik (benefit).',
  },
  {
    kode: 'C3',
    nama: 'Elastisitas Kain',
    tipe: 'benefit',
    satuan: 'Skor 1–5',
    bobotDefault: 3,
    status: 'Aktif',
    deskripsi: 'Kelenturan kain untuk keleluasaan bergerak. Berjenis benefit.',
  },
  {
    kode: 'C4',
    nama: 'Kualitas Kecerahan Printing',
    tipe: 'benefit',
    satuan: 'Skor 1–5',
    bobotDefault: 4,
    status: 'Aktif',
    deskripsi: 'Ketajaman dan kecerahan cetak sublimasi. Berjenis benefit.',
  },
  {
    kode: 'C5',
    nama: 'Ketebalan Kain / Gramasi',
    tipe: 'configurable',
    satuan: 'Skor 1–5',
    bobotDefault: 3,
    status: 'Aktif',
    deskripsi: 'Arah kriteria ditetapkan admin (benefit = kokoh/tebal, cost = ringan/tipis).',
  },
  {
    kode: 'C6',
    nama: 'Keawetan Serat / Anti-Berbulu',
    tipe: 'benefit',
    satuan: 'Skor 1–5',
    bobotDefault: 3,
    status: 'Aktif',
    deskripsi: 'Ketahanan kain terhadap gesekan berulang dan anti-pilling. Berjenis benefit.',
  },
  {
    kode: 'C7',
    nama: 'Kecepatan Kering / Quick Dry',
    tipe: 'benefit',
    satuan: 'Skor 1–5',
    bobotDefault: 4,
    status: 'Aktif',
    deskripsi: 'Kecepatan kain menguapkan air dan mengering setelah basah. Berjenis benefit.',
  },
]

interface AdminContextType {
  materials: Material[]
  criteria: CriterionConfig[]
  arahC5: 'benefit' | 'cost'
  addMaterial: (data: Omit<Material, 'id'> & { id?: string }) => void
  updateMaterial: (id: string, updates: Partial<Material>) => void
  deleteMaterial: (id: string) => void
  updateCriterion: (kode: string, updates: Partial<CriterionConfig>) => void
  setArahC5: (arah: 'benefit' | 'cost') => void
  updateScores: (materialId: string, scores: Partial<Pick<Material, 'serapKeringat' | 'elastisitas' | 'printing' | 'ketebalan' | 'keawetan' | 'quickDry' | 'hargaDemo'>>) => void
  resetToFixture: () => void
}

const STORAGE_KEYS = {
  MATERIALS: 'viajersey_admin_materials_v2',
  CRITERIA: 'viajersey_admin_criteria_v2',
  ARAH_C5: 'viajersey_admin_arah_c5_v2',
}

const AdminContext = createContext<AdminContextType | null>(null)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<Material[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return MATERIALS_FIXTURE
  })

  const [criteria, setCriteria] = useState<CriterionConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CRITERIA)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return INITIAL_CRITERIA
  })

  const [arahC5, setArahC5State] = useState<'benefit' | 'cost'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARAH_C5)
      if (saved === 'benefit' || saved === 'cost') return saved
    } catch {
      // fallback
    }
    return 'benefit'
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials))
    } catch {
      // ignore storage error
    }
  }, [materials])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(criteria))
    } catch {
      // ignore
    }
  }, [criteria])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ARAH_C5, arahC5)
    } catch {
      // ignore
    }
  }, [arahC5])

  // Sinkronisasi real-time antar-tab browser (misal Tab 1 Admin & Tab 2 Web Utama)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.MATERIALS && e.newValue) {
        try {
          setMaterials(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
      if (e.key === STORAGE_KEYS.CRITERIA && e.newValue) {
        try {
          setCriteria(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
      if (e.key === STORAGE_KEYS.ARAH_C5 && e.newValue) {
        if (e.newValue === 'benefit' || e.newValue === 'cost') {
          setArahC5State(e.newValue)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const addMaterial = (data: Omit<Material, 'id'> & { id?: string }) => {
    const nextNumber = materials.length + 1
    const newId = data.id?.trim() || `FAB-${String(nextNumber).padStart(3, '0')}`
    const newMaterial: Material = {
      ...data,
      id: newId,
      slug: data.slug || data.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }
    setMaterials(prev => [...prev, newMaterial])
  }

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    )
  }

  const deleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id))
  }

  const updateCriterion = (kode: string, updates: Partial<CriterionConfig>) => {
    setCriteria(prev =>
      prev.map(c => (c.kode === kode ? { ...c, ...updates } : c))
    )
  }

  const setArahC5 = (arah: 'benefit' | 'cost') => {
    setArahC5State(arah)
  }

  const updateScores = (
    materialId: string,
    scores: Partial<Pick<Material, 'serapKeringat' | 'elastisitas' | 'printing' | 'ketebalan' | 'keawetan' | 'quickDry' | 'hargaDemo'>>
  ) => {
    setMaterials(prev =>
      prev.map(m => (m.id === materialId ? { ...m, ...scores } : m))
    )
  }

  const resetToFixture = () => {
    setMaterials(MATERIALS_FIXTURE)
    setCriteria(INITIAL_CRITERIA)
    setArahC5State('benefit')
    try {
      localStorage.removeItem(STORAGE_KEYS.MATERIALS)
      localStorage.removeItem(STORAGE_KEYS.CRITERIA)
      localStorage.removeItem(STORAGE_KEYS.ARAH_C5)
    } catch {
      // ignore
    }
  }

  return (
    <AdminContext.Provider
      value={{
        materials,
        criteria,
        arahC5,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        updateCriterion,
        setArahC5,
        updateScores,
        resetToFixture,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdminData(): AdminContextType {
  const ctx = useContext(AdminContext)
  if (!ctx) {
    throw new Error('useAdminData must be used within AdminProvider')
  }
  return ctx
}
