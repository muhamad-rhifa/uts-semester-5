import { Router } from 'express'
import {
  authenticateAdmin,
  getDashboardStats,
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getCriteria,
  updateCriterion,
  updateScores,
} from '../db.js'
import { requireAdminAuth } from '../middleware/auth.js'

const router = Router()

/**
 * POST /api/admin/auth/login
 * Verifikasi login admin
 */
router.post('/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Username dan password wajib diisi.',
        },
      })
    }

    const admin = await authenticateAdmin(username, password)
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Username atau password tidak sesuai.',
        },
      })
    }

    // Token sesi demo
    const token = `viajersey_adm_${Date.now()}_${Buffer.from(username).toString('base64')}`

    res.json({
      success: true,
      data: {
        token,
        admin,
      },
      message: 'Login berhasil.',
    })
  } catch (err) {
    next(err)
  }
})

// Semua rute di bawah ini wajib otentikasi admin
router.use(requireAdminAuth)

/**
 * GET /api/admin/dashboard
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const stats = await getDashboardStats()
    res.json({
      success: true,
      data: stats,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * CRUD BAHAN KAIN
 */
router.get('/materials', async (req, res, next) => {
  try {
    const materials = await getMaterials(false)
    res.json({
      success: true,
      data: materials,
    })
  } catch (err) {
    next(err)
  }
})

router.post('/materials', async (req, res, next) => {
  try {
    const { nama, hargaDemo, deskripsi, kelebihan, serapKeringat, elastisitas, printing, ketebalan } = req.body

    if (!nama || !hargaDemo || !deskripsi) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Nama bahan, harga demo, dan deskripsi wajib diisi.',
        },
      })
    }

    if (Number(hargaDemo) <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Harga demo harus berupa angka positif.',
        },
      })
    }

    const created = await createMaterial({
      nama,
      hargaDemo,
      deskripsi,
      kelebihan,
      serapKeringat,
      elastisitas,
      printing,
      ketebalan,
    })

    res.status(201).json({
      success: true,
      data: created,
      message: 'Bahan berhasil ditambahkan.',
    })
  } catch (err) {
    next(err)
  }
})

router.put('/materials/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await updateMaterial(id, req.body)

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Bahan dengan ID '${id}' tidak ditemukan.`,
        },
      })
    }

    res.json({
      success: true,
      data: updated,
      message: 'Data bahan berhasil diperbarui.',
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/materials/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await deleteMaterial(id)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Bahan dengan ID '${id}' tidak ditemukan.`,
        },
      })
    }

    res.json({
      success: true,
      message: `Bahan dengan ID '${id}' berhasil dihapus.`,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * MANAJEMEN KRITERIA & BOBOT
 */
router.get('/criteria', async (req, res, next) => {
  try {
    const criteria = await getCriteria()
    res.json({
      success: true,
      data: criteria,
    })
  } catch (err) {
    next(err)
  }
})

router.put('/criteria/:kode', async (req, res, next) => {
  try {
    const { kode } = req.params
    const { bobotDefault, tipe, deskripsi } = req.body

    if (bobotDefault !== undefined && (bobotDefault < 1 || bobotDefault > 5)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Bobot default harus bernilai 1 hingga 5.',
        },
      })
    }

    if (tipe !== undefined && tipe !== 'benefit' && tipe !== 'cost') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: "Tipe kriteria harus bernilai 'benefit' atau 'cost'.",
        },
      })
    }

    const updated = await updateCriterion(kode, { bobotDefault, tipe, deskripsi })
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Kriteria '${kode}' tidak ditemukan.`,
        },
      })
    }

    res.json({
      success: true,
      data: updated,
      message: `Kriteria ${kode} berhasil diperbarui.`,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * MATRIKS PENILAIAN ALTERNATIF
 */
router.get('/scores', async (req, res, next) => {
  try {
    const materials = await getMaterials(false)
    const scoresMatrix = materials.map(m => ({
      materialId: m.id,
      nama: m.nama,
      hargaDemo: m.hargaDemo,
      serapKeringat: m.serapKeringat,
      elastisitas: m.elastisitas,
      printing: m.printing,
      ketebalan: m.ketebalan,
    }))
    res.json({
      success: true,
      data: scoresMatrix,
    })
  } catch (err) {
    next(err)
  }
})

router.put('/scores/:materialId', async (req, res, next) => {
  try {
    const { materialId } = req.params
    const updated = await updateScores(materialId, req.body)

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Bahan dengan ID '${materialId}' tidak ditemukan.`,
        },
      })
    }

    res.json({
      success: true,
      data: updated,
      message: `Matriks skor untuk ${updated.nama} berhasil diperbarui.`,
    })
  } catch (err) {
    next(err)
  }
})

export default router
