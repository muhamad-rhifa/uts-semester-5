import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// Data seed demo memori fallback (PRD §8)
let memoryMaterials = [
  {
    id: 'FAB-001',
    nama: 'Dryfit Milano',
    slug: 'dryfit-milano',
    deskripsi: 'Bahan jersey dryfit dengan tekstur milano yang halus dan nyaman digunakan untuk olahraga ringan hingga sedang.',
    hargaDemo: 45000,
    kelebihan: ['Ringan dan breathable', 'Warna cerah tahan lama', 'Nyaman untuk aktivitas harian'],
    status: 'Aktif',
    serapKeringat: 4,
    elastisitas: 4,
    printing: 4,
    ketebalan: 3,
    keawetan: 4,
    quickDry: 4,
  },
  {
    id: 'FAB-002',
    nama: 'Benzema',
    slug: 'benzema',
    deskripsi: 'Bahan jersey populer dengan keseimbangan antara kenyamanan dan ketahanan printing sublimasi.',
    hargaDemo: 40000,
    kelebihan: ['Elastis dan fleksibel', 'Printing tajam', 'Harga terjangkau'],
    status: 'Aktif',
    serapKeringat: 3,
    elastisitas: 4,
    printing: 4,
    ketebalan: 3,
    keawetan: 4,
    quickDry: 3,
  },
  {
    id: 'FAB-003',
    nama: 'Serena',
    slug: 'serena',
    deskripsi: 'Bahan jersey dengan ketebalan lebih baik, cocok untuk cuaca lebih dingin atau kebutuhan premium feel.',
    hargaDemo: 38000,
    kelebihan: ['Ketebalan optimal', 'Cocok cuaca dingin', 'Tekstur premium'],
    status: 'Aktif',
    serapKeringat: 3,
    elastisitas: 3,
    printing: 3,
    ketebalan: 4,
    keawetan: 3,
    quickDry: 3,
  },
  {
    id: 'FAB-004',
    nama: 'Paving',
    slug: 'paving',
    deskripsi: 'Bahan jersey ekonomis dengan performa seimbang, pilihan hemat untuk jersey tim dalam jumlah besar.',
    hargaDemo: 35000,
    kelebihan: ['Harga paling ekonomis', 'Cocok untuk tim besar', 'Mudah dirawat'],
    status: 'Aktif',
    serapKeringat: 3,
    elastisitas: 3,
    printing: 3,
    ketebalan: 3,
    keawetan: 3,
    quickDry: 3,
  },
  {
    id: 'FAB-005',
    nama: 'Dryfit Premium',
    slug: 'dryfit-premium',
    deskripsi: 'Bahan jersey dryfit kelas premium dengan daya serap terbaik dan hasil printing paling tajam.',
    hargaDemo: 52000,
    kelebihan: ['Daya serap keringat terbaik', 'Printing ultra tajam', 'Material eksklusif'],
    status: 'Aktif',
    serapKeringat: 5,
    elastisitas: 4,
    printing: 5,
    ketebalan: 2,
    keawetan: 5,
    quickDry: 5,
  },
]

let memoryCriteria = [
  { kode: 'C1', nama: 'Harga per pcs', tipe: 'cost', satuan: 'Rupiah', bobotDefault: 5, status: 'Aktif', deskripsi: 'Semakin rendah harga, semakin diprioritaskan.' },
  { kode: 'C2', nama: 'Daya Serap Keringat', tipe: 'benefit', satuan: 'Skor 1–5', bobotDefault: 4, status: 'Aktif', deskripsi: 'Kemampuan menyerap keringat saat aktivitas olahraga.' },
  { kode: 'C3', nama: 'Tingkat Kelenturan / Elastisitas Kain', tipe: 'benefit', satuan: 'Skor 1–5', bobotDefault: 3, status: 'Aktif', deskripsi: 'Kelenturan kain untuk keleluasaan bergerak.' },
  { kode: 'C4', nama: 'Kualitas Kecerahan Hasil Printing', tipe: 'benefit', satuan: 'Skor 1–5', bobotDefault: 4, status: 'Aktif', deskripsi: 'Ketajaman dan kecemerlangan cetak sublimasi.' },
  { kode: 'C5', nama: 'Ketebalan Kain / Gramasi', tipe: 'benefit', satuan: 'Skor 1–5', bobotDefault: 3, status: 'Aktif', deskripsi: 'Arah kriteria ditetapkan admin (benefit/cost).' },
  { kode: 'C6', nama: 'Keawetan Serat / Anti-Berbulu', tipe: 'benefit', satuan: 'Skor 1–5', bobotDefault: 3, status: 'Aktif', deskripsi: 'Ketahanan tekstur kain terhadap gesekan berulang (pilling).' },
  { kode: 'C7', nama: 'Kecepatan Kering / Quick Dry', tipe: 'benefit', satuan: 'Skor 1–5', bobotDefault: 3, status: 'Aktif', deskripsi: 'Seberapa cepat kain menguapkan kelembapan setelah basah.' },
]

let pool = null
let isConnectedToMySQL = false

export async function initDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'viajersey_spk',
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 2000,
  }

  try {
    pool = mysql.createPool(dbConfig)
    const conn = await pool.getConnection()
    await conn.ping()
    conn.release()
    isConnectedToMySQL = true
    console.log('[DB] Terhubung ke MySQL database:', dbConfig.database)
  } catch (err) {
    isConnectedToMySQL = false
    console.warn('[DB] MySQL belum tersedia (' + err.message + '). Menggunakan fallback repository memori.')
  }
}

export function getDatabaseStatus() {
  return {
    provider: isConnectedToMySQL ? 'mysql' : 'memory_fallback',
    connected: isConnectedToMySQL,
  }
}

// -------------------------------------------------------------------
// DATA ACCESS LAYER: MATERIALS
// -------------------------------------------------------------------
export async function getMaterials(activeOnly = true) {
  if (isConnectedToMySQL && pool) {
    try {
      const sql = activeOnly
        ? 'SELECT * FROM materials WHERE status = "Aktif"'
        : 'SELECT * FROM materials'
      const [rows] = await pool.query(sql)
      // Query skor untuk tiap material
      const [scores] = await pool.query('SELECT * FROM material_scores')
      return rows.map(r => {
        const matScores = scores.filter(s => s.material_id === r.id)
        const scoreMap = {}
        matScores.forEach(s => {
          scoreMap[s.criterion_kode] = s.nilai
        })
        return {
          id: r.id,
          nama: r.nama,
          slug: r.slug,
          deskripsi: r.deskripsi,
          hargaDemo: r.harga_demo,
          kelebihan: typeof r.kelebihan_json === 'string' ? JSON.parse(r.kelebihan_json) : r.kelebihan_json,
          status: r.status,
          serapKeringat: scoreMap['C2'] || 3,
          elastisitas: scoreMap['C3'] || 3,
          printing: scoreMap['C4'] || 3,
          ketebalan: scoreMap['C5'] || 3,
          keawetan: scoreMap['C6'] || 3,
          quickDry: scoreMap['C7'] || 3,
        }
      })
    } catch (err) {
      console.error('[DB Query Error]', err.message)
    }
  }

  return activeOnly
    ? memoryMaterials.filter(m => m.status === 'Aktif')
    : [...memoryMaterials]
}

export async function getMaterialByIdOrSlug(idOrSlug) {
  const all = await getMaterials(false)
  return all.find(m => m.id === idOrSlug || m.slug === idOrSlug) || null
}

export async function createMaterial(data) {
  const nextNum = memoryMaterials.length + 1
  const id = data.id || `FAB-${String(nextNum).padStart(3, '0')}`
  const slug = data.slug || data.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const newMaterial = {
    id,
    nama: data.nama,
    slug,
    deskripsi: data.deskripsi,
    hargaDemo: Number(data.hargaDemo),
    kelebihan: Array.isArray(data.kelebihan) ? data.kelebihan : ['Bahan jersey berkualitas'],
    gambarUrl: data.gambarUrl || null,
    status: data.status || 'Aktif',
    serapKeringat: Number(data.serapKeringat) || 3,
    elastisitas: Number(data.elastisitas) || 3,
    printing: Number(data.printing) || 3,
    ketebalan: Number(data.ketebalan) || 3,
    keawetan: Number(data.keawetan) || 3,
    quickDry: Number(data.quickDry) || 3,
  }

  if (isConnectedToMySQL && pool) {
    try {
      await pool.query(
        'INSERT INTO materials (id, nama, slug, deskripsi, harga_demo, kelebihan_json, status, gambar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [newMaterial.id, newMaterial.nama, newMaterial.slug, newMaterial.deskripsi, newMaterial.hargaDemo, JSON.stringify(newMaterial.kelebihan), newMaterial.status, newMaterial.gambarUrl]
      )
      const scores = [
        [newMaterial.id, 'C1', newMaterial.hargaDemo],
        [newMaterial.id, 'C2', newMaterial.serapKeringat],
        [newMaterial.id, 'C3', newMaterial.elastisitas],
        [newMaterial.id, 'C4', newMaterial.printing],
        [newMaterial.id, 'C5', newMaterial.ketebalan],
        [newMaterial.id, 'C6', newMaterial.keawetan],
        [newMaterial.id, 'C7', newMaterial.quickDry],
      ]
      await pool.query('INSERT INTO material_scores (material_id, criterion_kode, nilai) VALUES ?', [scores])
    } catch (err) {
      console.error('[DB Insert Error]', err.message)
    }
  }

  memoryMaterials.push(newMaterial)
  return newMaterial
}

export async function updateMaterial(id, updates) {
  const idx = memoryMaterials.findIndex(m => m.id === id)
  if (idx === -1) return null

  memoryMaterials[idx] = {
    ...memoryMaterials[idx],
    ...updates,
  }

  if (isConnectedToMySQL && pool) {
    try {
      if (updates.nama || updates.hargaDemo || updates.deskripsi || updates.kelebihan || updates.status || updates.gambarUrl !== undefined) {
        await pool.query(
          'UPDATE materials SET nama = COALESCE(?, nama), deskripsi = COALESCE(?, deskripsi), harga_demo = COALESCE(?, harga_demo), kelebihan_json = COALESCE(?, kelebihan_json), status = COALESCE(?, status), gambar_url = COALESCE(?, gambar_url) WHERE id = ?',
          [updates.nama, updates.deskripsi, updates.hargaDemo, updates.kelebihan ? JSON.stringify(updates.kelebihan) : null, updates.status, updates.gambarUrl, id]
        )
      }
    } catch (err) {
      console.error('[DB Update Error]', err.message)
    }
  }

  return memoryMaterials[idx]
}

export async function deleteMaterial(id) {
  const idx = memoryMaterials.findIndex(m => m.id === id)
  if (idx === -1) return false

  memoryMaterials.splice(idx, 1)

  if (isConnectedToMySQL && pool) {
    try {
      await pool.query('DELETE FROM materials WHERE id = ?', [id])
    } catch (err) {
      console.error('[DB Delete Error]', err.message)
    }
  }

  return true
}

// -------------------------------------------------------------------
// DATA ACCESS LAYER: CRITERIA
// -------------------------------------------------------------------
export async function getCriteria() {
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM criteria')
      if (rows.length > 0) {
        return rows.map(r => ({
          kode: r.kode,
          nama: r.nama,
          tipe: r.tipe,
          satuan: r.satuan,
          bobotDefault: r.bobot_default,
          status: r.status,
          deskripsi: r.deskripsi,
        }))
      }
    } catch (err) {
      console.error('[DB Criteria Error]', err.message)
    }
  }
  return [...memoryCriteria]
}

export async function updateCriterion(kode, updates) {
  const idx = memoryCriteria.findIndex(c => c.kode === kode)
  if (idx === -1) return null

  memoryCriteria[idx] = {
    ...memoryCriteria[idx],
    ...updates,
  }

  if (isConnectedToMySQL && pool) {
    try {
      await pool.query(
        'UPDATE criteria SET bobot_default = COALESCE(?, bobot_default), tipe = COALESCE(?, tipe), deskripsi = COALESCE(?, deskripsi) WHERE kode = ?',
        [updates.bobotDefault, updates.tipe, updates.deskripsi, kode]
      )
    } catch (err) {
      console.error('[DB Criterion Update Error]', err.message)
    }
  }

  return memoryCriteria[idx]
}

// -------------------------------------------------------------------
// DATA ACCESS LAYER: SCORES
// -------------------------------------------------------------------
export async function updateScores(materialId, scores) {
  const mat = memoryMaterials.find(m => m.id === materialId)
  if (!mat) return null

  if (scores.serapKeringat !== undefined) mat.serapKeringat = Number(scores.serapKeringat)
  if (scores.elastisitas !== undefined) mat.elastisitas = Number(scores.elastisitas)
  if (scores.printing !== undefined) mat.printing = Number(scores.printing)
  if (scores.ketebalan !== undefined) mat.ketebalan = Number(scores.ketebalan)
  if (scores.keawetan !== undefined) mat.keawetan = Number(scores.keawetan)
  if (scores.quickDry !== undefined) mat.quickDry = Number(scores.quickDry)
  if (scores.hargaDemo !== undefined) mat.hargaDemo = Number(scores.hargaDemo)

  if (isConnectedToMySQL && pool) {
    try {
      const entries = [
        ['C1', mat.hargaDemo],
        ['C2', mat.serapKeringat],
        ['C3', mat.elastisitas],
        ['C4', mat.printing],
        ['C5', mat.ketebalan],
        ['C6', mat.keawetan],
        ['C7', mat.quickDry],
      ]
      for (const [kode, val] of entries) {
        await pool.query(
          'INSERT INTO material_scores (material_id, criterion_kode, nilai) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nilai = ?',
          [materialId, kode, val, val]
        )
      }
    } catch (err) {
      console.error('[DB Update Scores Error]', err.message)
    }
  }

  return mat
}

// -------------------------------------------------------------------
// DATA ACCESS LAYER: AUTH & DASHBOARD
// -------------------------------------------------------------------
export async function authenticateAdmin(username, password) {
  // Untuk Phase 4, admin default 'admin' / 'admin123'
  if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
    return {
      id: 1,
      username: 'admin',
      nama: 'Administrator ViaJersey',
    }
  }
  return null
}

export async function getDashboardStats() {
  const materials = await getMaterials(false)
  const criteria = await getCriteria()
  const c5 = criteria.find(c => c.kode === 'C5')

  const completeEvaluatedCount = materials.filter(
    m =>
      m.hargaDemo > 0 &&
      m.serapKeringat >= 1 &&
      m.elastisitas >= 1 &&
      m.printing >= 1 &&
      m.ketebalan >= 1 &&
      m.keawetan >= 1 &&
      m.quickDry >= 1
  ).length

  const kelengkapanPenilaian =
    materials.length > 0 ? Math.round((completeEvaluatedCount / materials.length) * 100) : 0

  return {
    totalBahan: materials.length,
    kriteriaAktif: criteria.filter(c => c.status === 'Aktif').length,
    kelengkapanPenilaian,
    arahC5: c5?.tipe || 'benefit',
    bahanLengkapCount: completeEvaluatedCount,
  }
}
